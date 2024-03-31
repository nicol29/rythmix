"use server";

import Users from "@/models/Users";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectMongoDB from "@/config/mongoDBConnection";
import cloudinary from "@/config/cloudinaryConfig";


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