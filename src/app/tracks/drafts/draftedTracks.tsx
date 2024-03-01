import RenderTracks from "../renderTracks";
import connectMongoDB from "@/config/mongoDBConnection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BeatDocumentInterface } from "@/types/mongoDocTypes";
import Beats from "@/models/Beats";


export default async function DraftedTracks() {
  const signedInUser = await getServerSession(authOptions);

  await connectMongoDB();

  const userPublishedBeats: BeatDocumentInterface[] = await Beats.find({
    "producer._id": signedInUser?.user.id,
    "status": "draft"
  }).sort({ createdAt: -1 });

  
  return (
    <RenderTracks
      userPublishedBeats={JSON.parse(JSON.stringify(userPublishedBeats))}
    />
  )
}