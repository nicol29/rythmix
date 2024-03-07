"use server";

import Users from "@/models/Users";
import connectMongoDB from "@/config/mongoDBConnection";
import { TProfileSettingsSchema } from "@/schemas/profileSettingsSchema";
import { TLicenseSettingsSchema } from "@/schemas/licenseSettingsSchema";
import { revalidatePath } from "next/cache";
import { MongoError } from "mongodb";
import mongoose from "mongoose";
import Beats from "@/models/Beats";


export const updateProfileInfo = async (formData: TProfileSettingsSchema, userId: string) => {
  await connectMongoDB();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await Users.findOneAndUpdate({ _id: userId }, { $set: { 
        userName: formData.userName,
        profileUrl: formData.profileUrl,
        biography: formData.biography,
        country: formData.country,
      }
    });

    await Beats.updateMany({ "producer._id": userId }, { $set: {
        "producer": {
          userName: formData.userName,
          profileUrl: formData.profileUrl,
        }
      }
    });

    await session.commitTransaction();

    revalidatePath("/settings/profile");
    return { success: true };
  } catch (error) {
    await session.abortTransaction();

    if ((error as MongoError).code === 11000) {
      return { success: false, message: "Profile Url already exists", duplicateKey: true };
    }
    return { success: false, message: "Something went wrong", duplicateKey: false };
  } finally {
    session.endSession();
  }
}

export const updateLicenseSetting = async (
  formData: TLicenseSettingsSchema,
  licenseName: string,
  userId: string
) => {
  try {
    await connectMongoDB();

    const isProfitPerformanceTrue = formData.allowProfitPerformances === "true";

    await Users.findOneAndUpdate({ _id: userId }, { $set: {
      "licenseTerms": {
        [licenseName]: {
          distributionCopies: formData.distributionCopies,
          audioStreams: formData.audioStreams,
          musicVideos: formData.musicVideos,
          radioStations: formData.radioStations,
          allowProfitPerformances: isProfitPerformanceTrue,
          country: formData.country
        }
      }
    }})

    revalidatePath("/settings/licenses");
    return { success: true, message: `Updated ${licenseName} license terms` };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
}

export const updateNotificationSetting = async () => {
  try {
    await connectMongoDB();
    
  } catch (error) {
    console.log(error)
  }
  
}

