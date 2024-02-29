import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Link from "next/link";
import Beats from "@/models/Beats";
import TrackCard from "./trackCard";
import { BeatDocumentInterface } from "@/types/mongoDocTypes";


export default async function Tracks() {
  const signedInUser = await getServerSession(authOptions);

  const userPublishedBeats: BeatDocumentInterface[] = await Beats.find({
    "producer._id": signedInUser?.user.id,
    "status": "published"
  });


  return (
    <main className="min-h-screen mt-14">
      <section className="relative bg-neutral-925 flex justify-center pt-10">
        <div className="w-5/6 sm:max-w-[1400px]">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl">Your Tracks</h1>
            <Link href="/upload" className="default-orange-button px-3 py-1 flex gap-2"><span>+</span>Create Track</Link>
          </div>
          <div className="mt-10 flex gap-4 text-lg text-neutral-400">
            <Link href="/tracks" className="px-1 border-b-2 border-orange-500">Published</Link>
            <Link href="/tracks/drafts" className="px-1">Drafts</Link>
          </div>
        </div>
      </section>
      <section className="flex justify-center py-14">
        <ul className="w-5/6 flex flex-col gap-2 sm:max-w-[1200px]">
          { userPublishedBeats.map(beat => 
            <TrackCard 
              key={beat._id.toString()} 
              beat={JSON.parse(JSON.stringify(beat))} 
            />
          )}
        </ul>
      </section>
    </main>
  )
}