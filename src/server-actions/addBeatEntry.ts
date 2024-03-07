"use server";

import Beats from "@/models/Beats";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { MongoError } from "mongodb";
import { redirect } from "next/navigation";
import connectMongoDB from "@/config/mongoDBConnection";
import Users from "@/models/Users";
import { UserDocumentInterface } from "@/types/mongoDocTypes";


const addBeatEntry = async () => {
  const session = await getServerSession(authOptions);

  await connectMongoDB();

  const userFromDB: UserDocumentInterface | null = await Users.findOne({ 
    _id: session?.user.id 
  });

  let beat;
  let retryCount = 0;
  const maxRetries = 3;
  let randEightDigitIdentifier;


  while (!beat && retryCount < maxRetries ) {
    randEightDigitIdentifier = Math.floor(10000000 + Math.random() * 90000000);

    try {
      beat = await Beats.create({
        urlIdentifier: randEightDigitIdentifier,
        producer: { 
          _id: session?.user.id,
          userName: session?.user.userName,
          profileUrl: session?.user.profileUrl,
        },
        licenseTerms: { ...userFromDB?.licenseTerms }
      });

    } catch (error) {
      if ((error as MongoError).code === 11000) {
        console.log("Duplicate urlIdentifier, generating a new one.");
      } else {
        console.log("Error creating beat entry: ", error);
        retryCount = maxRetries;
      }
    }

    retryCount ++;
  }

  if (beat) redirect(`/track/upload/${randEightDigitIdentifier}`);
}

export default addBeatEntry;