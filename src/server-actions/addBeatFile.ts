"use server";

import Beats from "@/models/Beats";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectMongoDB from "@/config/mongoDBConnection";
import cloudinary from "@/config/cloudinaryConfig";


const addBeatFile = async () => {
  connectMongoDB();

  const buffer = await item.file.arrayBuffer();
  let preppedFile: any;

  if (dropZoneName === "artworkFile") {
    const format = await sharp(buffer).metadata().then(metadata => metadata.format);
    let compressedImageBuffer;

    if (format) compressedImageBuffer = await sharp(buffer).resize({ width: 500 }).toFormat(format, { quality: 60 }).toBuffer();
    preppedFile = compressedImageBuffer;
  } else if (dropZoneName === "mp3File" || dropZoneName === "wavFile") {
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
}

export default addBeatFile;