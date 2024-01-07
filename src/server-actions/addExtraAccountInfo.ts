"use server";

import { TCompleteAccountSchema, completeAccountSchema } from "@/schemas/completeAccountSchema";
import connectMongoDB from "@/config/mongoDBConnection";
import Users from "@/models/Users";

interface AuthenticatedUserData {
  id?: string, 
  isProfileCompleted?: boolean,
}


const addExtraAccountInfo = async (data: TCompleteAccountSchema, userProperties: AuthenticatedUserData) => {
  try {
    const { userName, userType }: TCompleteAccountSchema = completeAccountSchema.parse(data);

    if (!userProperties.isProfileCompleted) {
      await connectMongoDB();

      await Users.findByIdAndUpdate(userProperties.id, {
        userName,
        userType,
        isProfileCompleted: true,
      });
    }

    return {success: true, message: "Account updated successfully"};
  } catch (error) {
    return {success: false, message: `${error}`};
  }
}

export default addExtraAccountInfo;