"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Beats from "@/models/Beats";
import connectMongoDB from "@/config/mongoDBConnection";
import { revalidatePath } from "next/cache";


export async function addComment(comment: string, beatId: string) {
  const signedInUser = await getServerSession(authOptions);
  console.log(signedInUser)
  if (!signedInUser) redirect("/login");

  try {
    await connectMongoDB();

    const res = await Beats.findByIdAndUpdate(beatId, { $push: { 
        comments: {
          author: signedInUser.user.id,
          text: comment
        }
      } 
    });

    if (res) revalidatePath(`/beat/${beatId}`)
    // if (res) return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error, 
      message: "Something went wrong" 
    }
  }
}

export async function deleteComment(commentId: string, beatId: string) {
  try {
    await connectMongoDB();

    const res = await Beats.findByIdAndUpdate(beatId, {
      $pull: { comments: { _id: commentId } }
    });

    if (res) revalidatePath(`/beat/${beatId}`)
  } catch (error) {
    return { 
      success: false, 
      error, 
      message: "Something went wrong" 
    }
  }
}