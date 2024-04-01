"use server";

import Beats from "@/models/Beats";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import connectMongoDB from "@/config/mongoDBConnection";
import cloudinary from "@/config/cloudinaryConfig";
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';


export const addBeatFile = async (file: any, beatUrlId: string, fileName: string) => {
  try {
    await connectMongoDB();

    const signedInUser = await getServerSession(authOptions);
    const currentBeat = await Beats.findOne({ urlIdentifier: beatUrlId });

    const transformedFile = file.get(fileName) as File
    const arrayBuffer = await transformedFile.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const fileToUpload = { 
      file: buffer,
      url: "",
      publicId: "",
      fileName: transformedFile.name,
    }

    await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({
        folder: `users/${signedInUser?.user.id}/beats/${currentBeat._id.toString()}`,
        resource_type: "auto",
        public_id: `${fileName}`,
        overwrite: true
      }, (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) {
          console.log(error);
          reject(error); 
        } else {
          if (result) {
            fileToUpload.url = result.secure_url;
            fileToUpload.publicId = result.public_id;
          }
          
          resolve(result); 
        }
      }).end(fileToUpload.file);
    });

    const fieldPathToUpdate = `assets.${fileName}`;
    const response = await Beats.findOneAndUpdate({ urlIdentifier: beatUrlId }, {
      [fieldPathToUpdate]: {
        url: fileToUpload.url,
        publicId: fileToUpload.publicId,
        fileName: fileToUpload.fileName,
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

export const addBeatFileV2 = async (file: any, beatUrlId: string, fileName: string) => {
  try {
    await connectMongoDB();

    const signedInUser = await getServerSession(authOptions);
    const currentBeat = await Beats.findOne({ urlIdentifier: beatUrlId });

    const transformedFile = file.get(fileName) as File
    const arrayBuffer = await transformedFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mime = transformedFile.type;
    const encoding = 'base64';
    const base64Data = buffer.toString(encoding);
    const fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;

    const fileToUpload = { 
      file: buffer,
      url: "",
      publicId: "",
      fileName: transformedFile.name,
    }

    await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(fileUri, {
        folder: `users/${signedInUser?.user.id}/beats/${currentBeat._id.toString()}`,
        public_id: fileName,
        overwrite: true,
        invalidate: true,
        resource_type: "auto"
      }, (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) {
          console.log(error);
          reject(error); 
        } else {
          if (result) {
            fileToUpload.url = result.secure_url;
            fileToUpload.publicId = result.public_id;
          }

          resolve(result); 
        }
      });
    });

    const fieldPathToUpdate = `assets.${fileName}`;
    const response = await Beats.findOneAndUpdate({ urlIdentifier: beatUrlId }, {
      [fieldPathToUpdate]: {
        url: fileToUpload.url,
        publicId: fileToUpload.publicId,
        fileName: fileToUpload.fileName,
      }
    }, { new: true });

    const updatedAsset = JSON.parse(JSON.stringify(response));
    if (response) return { success: true, asset: updatedAsset.assets[fileName] };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
}