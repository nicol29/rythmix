"use server";

import { TRegistrationSchema, registrationSchema } from "@/schemas/registrationSchema";
import connectMongoDB from "@/config/mongoDBConnection";
import Users from "@/models/Users";
import { hash } from "bcrypt";
import { MongoError } from "mongodb";
import Notifications from "@/models/Notifications";


const addUser = async (formData: TRegistrationSchema) => {
  try {
    await connectMongoDB();
    const { email, password }: TRegistrationSchema = registrationSchema.parse(formData);
    const hashedPass = await hash(password, 10);

    await Users.create({
      email,
      password: hashedPass,
      profileUrl: email.split('@')[0],
    });

    const newUser = await Users.findOne({ email: email });
    
    if (newUser) {
      await Notifications.create({
        userId: newUser?._id.toString(),
        type: 'system',
        message: 'Welcome to Rythmix, start by browsing beats.',
      });
    }

    return {success: true, message: "Registered successfully"};
  } catch (error) {
    if ((error as MongoError).code === 11000) {
      return {success: false, message: "Email already exists, please login.", userExists: true};
    }
    return {success: false, message: `Error adding user: ${error}`};
  }
}

export default addUser;