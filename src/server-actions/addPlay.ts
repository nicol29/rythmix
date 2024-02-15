"use server";

import Plays from "@/models/Plays";
import connectMongoDB from "@/config/mongoDBConnection";


const addPlay = async (beatId: string) => {
  try {
    await connectMongoDB();

    await Plays.create({
      beat: beatId
    });

  } catch (error) {
    console.log(error);
  }
}

export default addPlay;