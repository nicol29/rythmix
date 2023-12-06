import connectMongoDB from "@/config/mongoDBConnection";
import { NextResponse } from "next/server";
import Users from "@/models/Users";


export async function POST (request: Request) {
  const { userName, email, userType, password } = await request.json();

  await connectMongoDB();
  await Users.create({
    userName,
    email,
    userType,
    password
  });

  return NextResponse.json({
    userName,
    email,
    userType,
    password
  }, {status: 201});
}