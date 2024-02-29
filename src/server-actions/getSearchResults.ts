"use server";

import Beats from "@/models/Beats";
import connectMongoDB from "@/config/mongoDBConnection";


export const getSearchResults = async (
  searchString: string, 
  filters?: { [key: string]: string | number }, 
  sortFilter?: number,
  queryPos?: number
) => {
  try {
    const docLimit = 10;

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
      "$match": { 
        ...filters,
        "status": "published"
      } 
    },];

    if (sortFilter) {
      mongoPipeline.push({ "$sort": { "createdAt": sortFilter} });
    }

    if (queryPos) {
      mongoPipeline.push({ $skip: queryPos * docLimit })
    }

    const results = await Beats.aggregate(mongoPipeline).limit(docLimit);

    const beats = JSON.parse(JSON.stringify(results));

    return { success: true, beats };
  } catch (error) {
    return { success: false, error };
  }
}