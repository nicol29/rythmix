import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { registrationSchema } from "@/schemas/registrationSchema";
import Users from "@/models/Users";
import connectMongoDB from "@/config/mongoDBConnection";


export async function POST(request: Request) {
  try {
    const { userName, userType, email, password, } = await request.json();
    
    const hashedPass = await hash(password, 10);

    await connectMongoDB();
    await Users.create({
      userName,
      userType,
      email,
      "password": hashedPass,
      "profileUrl": email.split('@')[0],
    })

    // console.log(email, password);
  } catch (error) {
    console.log(error);
  }

  return NextResponse.json({ message: "success" });
}