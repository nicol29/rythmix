"use server";

import Beats from "@/models/Beats";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import connectMongoDB from "@/config/mongoDBConnection";
import cloudinary from "@/config/cloudinaryConfig";


export const generateCloudinarySecret = async (beatID: string, public_id: string) => {
  try {
    const signedInUser = await getServerSession(authOptions);

    if (!signedInUser?.user.id) return;

    const timestamp = Math.round((new Date()).getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request({
        timestamp: timestamp,
        folder: `users/${signedInUser?.user.id}/beats/${beatID}`,
        overwrite: 'true',
        public_id: public_id
    }, process.env.CLOUDINARY_API_SECRET ?? "");

    const info = {
      signature: signature,
      timestamp: timestamp,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    }

    return { success: true, info: JSON.parse(JSON.stringify(info)) }
  } catch (error) {
    console.log(error);
    return { success: false, error }
  }
}

export const uploadFileDetailsToDB = async (
  beatID: string,
  url: string, 
  publicId: string, 
  fileName: string,
  fileType: string
) => {
  try {
    const fieldPathToUpdate = `assets.${fileType}`;
    const response = await Beats.findByIdAndUpdate(beatID, {
      [fieldPathToUpdate]: {
        url,
        publicId,
        fileName,
      }
    }, { new: true });

    const updatedAsset = JSON.parse(JSON.stringify(response));
    if (response) return { success: true, asset: updatedAsset.assets[fileName] };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
}

export const removeBeatFile = async (beatUrlId: string, fileName: string, fileType: "video" | "image") => {
  try {
    await connectMongoDB();

    const currentBeat = await Beats.findOne({ urlIdentifier: beatUrlId });

    cloudinary.uploader.destroy(`${currentBeat.assets[fileName].publicId}`, { resource_type: fileType });

    const fieldPathToUpdate = `assets.${fileName}`;
    const response = await Beats.findOneAndUpdate({ urlIdentifier: beatUrlId }, { $unset: {
      [fieldPathToUpdate]: {
        url: "",
        publicId: "",
        fileName: "",
      }
    }});

    if (response) return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
}