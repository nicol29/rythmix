"use server";

import Likes from "@/models/Likes";
import connectMongoDB from "@/config/mongoDBConnection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export const addLike = async (beatId: string) => {
  await connectMongoDB();

  try {
    const signedInUser = await getServerSession(authOptions);

    await connectMongoDB();

    const res = await Likes.create({
      producer: signedInUser?.user.id,
      beat: beatId,
    }, { new: true });

    
    if (res) return { success: true, like: JSON.parse(JSON.stringify(res)) }
  } catch (error) {
    return { success: false, error }
  }
}

export const getLike = async (beatId: string) => {
  try {
    const signedInUser = await getServerSession(authOptions);

    await connectMongoDB();

    const res = await Likes.findOne({
      producer: signedInUser?.user.id,
      beat: beatId,
    });

    return { success: true, like: JSON.parse(JSON.stringify(res)) }
  } catch (error) {
    return { success: false, error }
  }
};

export const removeLike = async (beatId: string) => {
  await connectMongoDB();

  try {
    const signedInUser = await getServerSession(authOptions);

    await connectMongoDB();

    const res = await Likes.deleteOne({
      producer: signedInUser?.user.id,
      beat: beatId,
    });

    if (res) return { success: true, like: null }
  } catch (error) {
    return { success: false, error }
  }
}