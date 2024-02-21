"use server";

import Beats from "@/models/Beats";
import connectMongoDB from "@/config/mongoDBConnection";


export const getSearchResults = async (searchString: string) => {
  try {
    await connectMongoDB();

    const results = await Beats.aggregate([
      {
        "$search": {
          "index": "title-auto-complete",
          "autocomplete": {
            "query": `${searchString}`,
            "path": "title",
            "fuzzy": {
              "maxEdits": 2,
              "prefixLength": 3
            }
          }
        }
      }
    ]).limit(10);

    const beats = JSON.parse(JSON.stringify(results));

    return { success: true, beats };
  } catch (error) {
    return { success: false, error };
  }
}