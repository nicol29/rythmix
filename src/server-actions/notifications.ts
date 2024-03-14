"use server";

import connectMongoDB from "@/config/mongoDBConnection";
import Notifications from "@/models/Notifications";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// const notificationsSchema = new mongoose.Schema({
//   userId: { type: ObjectId, ref: 'Users', required: true },
//   type: { type: String, enum: ['comment', 'like', 'purchase', 'system'], required: true },
//   message: { type: String },
//   from: { type: ObjectId, ref: 'Users' },
//   read: { type: Boolean, default: false },
//   resourceId: { type: String },
// });


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
      userId: signedInUser?.user.id,
      type: type,
      from: sender,
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

    await Notifications.updateMany({ userId: signedInUser?.user.id }, {
      read: true
    });
  } catch (error) {
    throw error;
  }
}