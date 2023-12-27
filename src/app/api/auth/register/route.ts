import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { registrationSchema } from "@/schemas/registrationSchema";
import Users from "@/models/Users";
import connectMongoDB from "@/config/mongoDBConnection";
import { MongoError } from "mongodb";


export async function POST(request: Request) {
  const { userName, userType, email, password } = await request.json();

  try {
    const hashedPass = await hash(password, 10);

    await Users.create({
      userName,
      userType,
      email,
      password: hashedPass,
      profileUrl: email.split('@')[0],
    });

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });

  } catch (error) {
    // Check if error is a MongoError for duplicate email
      if ((error as MongoError).code === 11000) {
        console.log("lol")
        return NextResponse.json({ message: 'Email already exists', errorCode: 'EMAIL_EXISTS', email: email }, { status: 400 });
      }

    // Fallback error handler
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}