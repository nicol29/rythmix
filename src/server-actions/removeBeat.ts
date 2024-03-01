"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectMongoDB from "@/config/mongoDBConnection";
import Beats from "@/models/Beats";
import { getServerSession } from "next-auth";
import { BeatDocumentInterface } from "@/types/mongoDocTypes";
import mongoose from "mongoose";
import Plays from "@/models/Plays";
import cloudinary from "@/config/cloudinaryConfig";
import { revalidatePath } from "next/cache";
import Likes from "@/models/Likes";


export const removeBeatAndViews = async (beatId: string, url: string) => {
  const signedInUser = await getServerSession(authOptions);

  if (!signedInUser?.user) {
    return { success: false, message: "Permission denied" }
  }

  await connectMongoDB();
  const beatToDelete: BeatDocumentInterface | null = await Beats.findOne({ _id: beatId });

  if (beatToDelete?.producer._id.toString() !== signedInUser.user.id) {
    return { success: false, message: "Permission denied" }
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await Beats.deleteOne({ _id: beatId });
    await Plays.deleteMany({ beat: beatId });
    await Likes.deleteMany({ beat: beatId });

    await session.commitTransaction();

    await removeBeatAssets(`users/${signedInUser?.user.id}/beats/${beatId}/`);
    
    revalidatePath(url);

    return { success: true, message: "Successfully deleted track" };
  } catch (error) {
    console.log(error);
    await session.abortTransaction();

    return { success: false, message: "Transaction failed" };
  } finally {
    session.endSession();
  }
}

export const removeBeatAssets = async (folderPath: string) => {
  try {
    const deleteImages = cloudinary.api.delete_resources_by_prefix(folderPath, { resource_type: 'image' });
    const deleteMusicFiles = cloudinary.api.delete_resources_by_prefix(folderPath, { resource_type: 'video' });

    await Promise.all([deleteImages, deleteMusicFiles]);

    await cloudinary.api.delete_folder(folderPath.slice(0, -1));
  } catch (error) {
    console.log(error);
  }
}