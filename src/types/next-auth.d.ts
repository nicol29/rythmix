// types/next-auth.d.ts
import "next-auth";
import { ObjectId } from "mongoose";
import { JWT } from "next-auth/jwt";


declare module "next-auth" {
  interface User {
    _id?: ObjectId, 
    profileUrl?: string,
    profilePicture?: string | null,
    isProfileCompleted?: boolean,
    createdAt?: string,
  }

  interface Session {
    user: {
      id?: string, 
      profileUrl?: string,
      profilePicture?: string | null,
      isProfileCompleted?: boolean,
      createdAt?: string,
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    profileUrl?: string,
    profilePicture?: string | null,
    isProfileCompleted?: boolean,
    createdAt?: string,
  }
}