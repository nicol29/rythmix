"use server";

import Beats from "@/models/Beats";
import { TBeatUploadSchema } from "@/schemas/beatUploadSchema";
import cloudinary from "@/config/cloudinaryConfig";
import connectMongoDB from "@/config/mongoDBConnection";
import { BeatDocumentInterface, LicenseInterface } from "@/types/mongoDocTypes";

interface LicensesInterface {
  basic: LicenseInterface; 
  premium: LicenseInterface; 
  exclusive: LicenseInterface;
}


const addBeat = async (formData: TBeatUploadSchema, beatUrlId: string, action: "draft" | "published") => {
  try {
    connectMongoDB(); 

    const currentBeat = await Beats.findOne({ urlIdentifier: beatUrlId });

    if (action === "published") deleteWavIfOnlyBasicLicense(currentBeat, formData.licenses);

    const response = await Beats.findOneAndUpdate({ urlIdentifier: beatUrlId }, {
      title: formData.title,
      bpm: formData.bpm,
      key: formData.key,
      genre: formData.genre,
      mood: formData.mood,
      licenses: {
        ...formData.licenses
      },
      status: action,
    })

    if (response) return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}

const deleteWavIfOnlyBasicLicense = async (beat: BeatDocumentInterface, licenses: LicensesInterface) => {
  const { wav } = beat.assets;

  if (wav?.publicId && licenses.basic.selected && !licenses.premium.selected) {
    await cloudinary.uploader.destroy(wav.publicId, { resource_type: "video" });

    await Beats.findByIdAndUpdate(beat._id.toString(), { 
      $unset: { 'assets.wav.url': "", 'assets.wav.publicId': "" }
    });
  }
}

export default addBeat;