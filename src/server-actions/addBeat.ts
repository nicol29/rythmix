"use server";

import Beats from "@/models/Beats";
import { TBeatUploadSchema } from "@/schemas/beatUploadSchema";
import cloudinary from "@/config/cloudinaryConfig";
import sharp from "sharp";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectMongoDB from "@/config/mongoDBConnection";



const addBeat = async (formData: TBeatUploadSchema, files: any, beatUrlId: string, action: "draft" | "published") => {
  try {
    connectMongoDB(); 

    const signedInUser = await getServerSession(authOptions);
    const currentBeat = await Beats.findOne({ urlIdentifier: beatUrlId });

    deleteOldFiles(currentBeat, formData.licenses.basic);

    const allFiles = [
      { file: files.get('artworkFile') as File, type: "artwork", url: null, publicId: "artwork" },
      { file: files.get('mp3File') as File, type: "mp3", url: null, publicId: "track_mp3" },
    ]

    const wavFile = files.get('wavFile') as File;
    if (wavFile) allFiles.push({ file: wavFile, type: "wav", url: null, publicId: "track_wav" });
  
    const uploadPromises = allFiles.map(async (item) => {
      const buffer = await item.file.arrayBuffer();
      let preppedFile: any;

      if (item.type === "artwork") {
        const format = await sharp(buffer).metadata().then(metadata => metadata.format);
        let compressedImageBuffer;

        if (format) compressedImageBuffer = await sharp(buffer).resize({ width: 500 }).toFormat(format, { quality: 60 }).toBuffer();
        preppedFile = compressedImageBuffer;
      } else if (item.type === "mp3" || item.type === "wav") {
        preppedFile = new Uint8Array(buffer);
      } 

      await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
          folder: `users/${signedInUser?.user.id}/beats/${currentBeat._id.toString()}`,
          resource_type: "auto",
          public_id: `${item.publicId}`,
          overwrite: true
        }, (error: any, result: any) => {
          if (error) {
            reject(error); 
          } else {
            item.url = result.secure_url;
            item.publicId = result.public_id;
            
            resolve(result); 
          }
        }).end(preppedFile);
      });

      return item;
    });

    const results = await Promise.all(uploadPromises);

    const response = await Beats.findOneAndUpdate({ urlIdentifier: beatUrlId }, {
      title: formData.title,
      bpm: formData.bpm,
      key: formData.key,
      genre: formData.genre,
      mood: formData.mood,
      licenses: {
        ...formData.licenses
      },
      assets: {
        artwork: { url: results[0]?.url, publicId: results[0]?.publicId, },
        mp3: { url: results[1]?.url, publicId: results[1]?.publicId, },
        wav: { url: results[2]?.url, publicId: results[2]?.publicId, },
      },
      status: action,
    })

    if (response) return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}

const deleteOldFiles = async (beat: any, basicLicense: { price: number, selected: boolean }) => {
  const { wav } = beat.assets;

  if (wav?.publicId && basicLicense.selected) {
    await cloudinary.uploader.destroy(wav.publicId, { resource_type: "video" });
    await Beats.findByIdAndUpdate(beat._id.toString(), { 
      $unset: { 'assets.wav.url': "", 'assets.wav.publicId': "" }
    });
  }
}

export default addBeat;