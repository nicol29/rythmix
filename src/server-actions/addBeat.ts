"use server";

import Beats from "@/models/Beats";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { MongoError } from "mongodb";
import { redirect } from "next/navigation";
import connectMongoDB from "@/config/mongoDBConnection";


const addBeat = async () => {
  await connectMongoDB();
  const session = await getServerSession(authOptions);

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
        }
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

export default addBeat;