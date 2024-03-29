"use server";

import Beats from "@/models/Beats";
import connectMongoDB from "@/config/mongoDBConnection";


export const getSearchResults = async (
  searchString: string | undefined, 
  filters?: { [key: string]: string | number }, 
  sortFilter?: number,
  queryPos?: number
) => {
  try {
    const docLimit = 10;

    await connectMongoDB();

    let mongoPipeline: any = [];

    if (searchString) {
      mongoPipeline.push({
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
      });
    }

    // This $match stage applies to all scenarios.
    mongoPipeline.push({ 
      "$match": { 
          ...filters,
          "status": "published"
      }
    });

    // Sorting
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