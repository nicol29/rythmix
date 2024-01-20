// types/next-auth.d.ts
import "next-auth";
import { ObjectId } from "mongoose";
import { JWT } from "next-auth/jwt";


declare module "next-auth" {
  interface User {
    _id?: ObjectId, 
    userName?: string,
    userType?: string,
    profileUrl?: string,
    profilePicture?: string | null,
    isProfileCompleted?: boolean,
  }

  interface Session {
    user: {
      id?: string, 
      userName?: string,
      userType?: string,
      profileUrl?: string,
      profilePicture?: string | null,
      image?: string | null,
      isProfileCompleted?: boolean,
    } & Session['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    userName?: string,
    userType?: string,
    profileUrl?: string,
    profilePicture?: string | null,
    image?: string | null,
    isProfileCompleted?: boolean,
  }
}