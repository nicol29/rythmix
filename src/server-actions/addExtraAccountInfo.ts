"use server";

import { TCompleteAccountSchema } from "@/schemas/completeAccountSchema";
import connectMongoDB from "@/config/mongoDBConnection";
import Users from "@/models/Users";

interface AuthenticatedUserData {
  id?: string, 
  isProfileCompleted?: boolean,
}


const addExtraAccountInfo = async (data: TCompleteAccountSchema, userProperties: AuthenticatedUserData) => {
  const { userName, userType } = data;

  if (!userProperties.isProfileCompleted) {
    connectMongoDB();

    const res = await Users.findByIdAndUpdate(userProperties.id, {
      userName,
      userType,
      isProfileCompleted: true,
    });

    if (res) return true;
  }
  return false;
}

export default addExtraAccountInfo;