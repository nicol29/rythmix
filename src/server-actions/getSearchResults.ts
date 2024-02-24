"use server";

import Beats from "@/models/Beats";
import connectMongoDB from "@/config/mongoDBConnection";


export const getSearchResults = async (
  searchString: string, 
  filters?: { [key: string]: string | number }, 
  sortFilter?: number
) => {
  try {
    await connectMongoDB();

    let mongoPipeline: any = [{
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
      },
    }, { 
      "$match": { ...filters } 
    },];

    if (sortFilter) {
      mongoPipeline.push({ "$sort": { "createdAt": sortFilter} });
    }

    const results = await Beats.aggregate(mongoPipeline).limit(10);

    const beats = JSON.parse(JSON.stringify(results));

    return { success: true, beats };
  } catch (error) {
    return { success: false, error };
  }
}