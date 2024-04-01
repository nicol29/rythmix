"use server";

import Users from "@/models/Users";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import connectMongoDB from "@/config/mongoDBConnection";
import cloudinary from "@/config/cloudinaryConfig";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";


export const addProfilePicture = async (file: any) => {
  try {
    await connectMongoDB();

    const signedInUser = await getServerSession(authOptions);

    const transformedFile = file.get("profilePicture") as File
    const arrayBuffer = await transformedFile.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const fileToUpload = { 
      file: buffer,
      url: null,
    }

    await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({
        folder: `users/${signedInUser?.user.id}/profile`,
        resource_type: "image",
        public_id: `profilePicture`,
        overwrite: true
      }, (error: any, result: any) => {
        if (error) {
          reject(error); 
        } else {
          fileToUpload.url = result.secure_url;
          
          resolve(result); 
        }
      }).end(fileToUpload.file);
    });

    const response = await Users.findOneAndUpdate({ _id: signedInUser?.user.id }, {
      profilePicture: fileToUpload.url
    }, { new: true });

    const updatedAsset = JSON.parse(JSON.stringify(response));

    if (response) return { success: true, accessUrl: updatedAsset.profilePicture };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
}

export const addProfilePictureV2 = async (file: any) => {
  try {
    await connectMongoDB();

    const signedInUser = await getServerSession(authOptions);

    const transformedFile = file.get("profilePicture") as File
    const arrayBuffer = await transformedFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mime = transformedFile.type;
    const encoding = 'base64';
    const base64Data = buffer.toString(encoding);
    const fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;

    const fileToUpload = { 
      file: buffer,
      url: "",
    }

    await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(fileUri, {
        folder: `users/${signedInUser?.user.id}/profile`,
        public_id: `profilePicture`,
        overwrite: true,
        invalidate: true,
        resource_type: "image",
      }, (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) {
          console.log(error);
          reject(error); 
        } else {
          if (result) {
            fileToUpload.url = result.secure_url;
          }

          resolve(result); 
        }
      });
    });

    const response = await Users.findOneAndUpdate({ _id: signedInUser?.user.id }, {
      profilePicture: fileToUpload.url
    }, { new: true });

    const updatedAsset = JSON.parse(JSON.stringify(response));

    if (response) return { success: true, accessUrl: updatedAsset.profilePicture };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
}