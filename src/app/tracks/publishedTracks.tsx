import RenderTracks from "./renderTracks";
import connectMongoDB from "@/config/mongoDBConnection";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { BeatDocumentInterface } from "@/types/mongoDocTypes";
import Beats from "@/models/Beats";


export default async function PublishedTracks() {
  const signedInUser = await getServerSession(authOptions);

  await new Promise(resolve => setTimeout(resolve, 3000));
  await connectMongoDB();

  const userPublishedBeats: BeatDocumentInterface[] = await Beats.find({
    "producer._id": signedInUser?.user.id,
    "status": "published"
  }).sort({ createdAt: -1 });

  
  return (
    <RenderTracks
      userPublishedBeats={JSON.parse(JSON.stringify(userPublishedBeats))}
    />
  )
}