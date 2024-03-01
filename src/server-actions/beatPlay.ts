"use server";

import Plays from "@/models/Plays";
import connectMongoDB from "@/config/mongoDBConnection";


const addPlay = async (beatId: string, producerId: string) => {
  try {
    await connectMongoDB();

    await Plays.create({
      beat: beatId,
      producer: producerId
    });

  } catch (error) {
    console.log(error);
  }
}

export default addPlay;