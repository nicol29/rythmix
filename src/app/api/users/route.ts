import connectMongoDB from "@/config/mongoDBConnection";
import { NextResponse } from "next/server";
import { registrationSchema } from "@/schemas/registrationSchema";
import Users from "@/models/Users";
import { MongoError } from "mongodb";


export async function POST (request: Request) {
  await connectMongoDB();

  try {
    // const { userName, email, userType, password } = registrationSchema.parse(await request.json());

    // await Users.create({
    //   userName,
    //   email,
    //   userType,
    //   password
    // });

    // return NextResponse.json({
    //   userName,
    //   email,
    //   userType,
    //   password
    // }, {status: 201});
  } catch (error) {
    if (error instanceof MongoError && error.code === 11000) {
      return NextResponse.json({ message: 'Email already exists', errorCode: 'EMAIL_EXISTS' }, { status: 400 });
    }
  }
}