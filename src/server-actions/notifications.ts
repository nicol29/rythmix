"use server";

import connectMongoDB from "@/config/mongoDBConnection";
import Notifications from "@/models/Notifications";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export const getNotifications = async () => {
  try {
    const signedInUser = await getServerSession(authOptions);

    await connectMongoDB();

    const notifications = await Notifications.find({ 
      userId: signedInUser?.user.id 
    }).populate({
      path: "from",
      select: "profilePicture userName profileUrl"
    }).sort({ createdAt: -1 });


    return { success: true, notifications: JSON.parse(JSON.stringify(notifications)) }
  } catch (error) {
    throw error
  }
}

export const createSystemNotification = async (message: string) => {
  try {
    const signedInUser = await getServerSession(authOptions);

    await connectMongoDB();

    await Notifications.create({
      userId: signedInUser?.user.id,
      type: 'system',
      message: message,
    });
  } catch (error) {
    throw error
  }
}

export const createAssetNotification = async (
  type: 'comment' | 'like' | 'purchase',
  sender: string,
  resourceId: string,
) => {
  try {
    const signedInUser = await getServerSession(authOptions);

    await connectMongoDB();

    await Notifications.create({
      userId: sender,
      type: type,
      from: signedInUser?.user.id,
      resourceId: resourceId,
    });
  } catch (error) {
    throw error;
  }
}

export const markNotificationsAsRead = async () => {
  try {
    const signedInUser = await getServerSession(authOptions);

    await connectMongoDB();

    await Notifications.updateMany({ 
      userId: signedInUser?.user.id, 
      read: false
    }, {
      read: true
    });
  } catch (error) {
    throw error;
  }
}