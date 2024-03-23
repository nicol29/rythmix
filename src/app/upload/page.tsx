import Header from "@/components/Header/header";
import addBeatEntry from "@/server-actions/addBeatEntry";
import { InventoryIcon, AudioFileIcon } from "@/assets/icons";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import connectMongoDB from "@/config/mongoDBConnection";
import Users from "@/models/Users";
import { UserDocumentInterface } from "@/types/mongoDocTypes";
import Link from "next/link";


export default async function Upload () {
  const signedInUser = await getServerSession(authOptions);

  await connectMongoDB();
  const userFromDB = await Users.findOne({ _id: signedInUser?.user.id }) as UserDocumentInterface;
  const onBoardStatus = userFromDB?.stripeDetails?.onBoardStatus;

  return (
    <>
      <Header />
      <main className="min-h-screen pt-14">
        <section className="relative bg-neutral-925 drop-shadow flex justify-center items-center py-10 lg:py-0 lg:h-[200px]">
          <div className="w-5/6 lg:full">
            <h1 className="text-3xl">Upload</h1>
          </div>
        </section>
        <section className="py-8">
          <div className="p-4 flex flex-col gap-6 items-center sm:flex-row sm:justify-center">
            <div className="flex flex-col items-center gap-4 max-w-[350px] bg-neutral-925 p-6 rounded border border-neutral-850">
              <h2 className="text-2xl">Upload Production Track</h2>
              <AudioFileIcon className="h-36 w-36 text-neutral-600" />
              <p className="text-center text-neutral-400">Production tracks are music files designed for licensing by recording artists and songwriters. These files can range from simple beats to complex compositions with choruses, complete song structures, and vocal tracks.</p>
              <p className="text-center text-neutral-400">Typically, these tracks are crafted by individuals such as music producers, beat-makers, musicians, and vocalists.</p>
              <form action={addBeatEntry} className="w-full mt-8">
                <button disabled={onBoardStatus !== "complete"} className={`w-full default-orange-button py-1 ${onBoardStatus !== "complete" && "opacity-20 hover:bg-orange-500"}`}>Upload Beat</button>
              </form>
              { onBoardStatus !== "complete" && <Link href="/settings/payouts" className="font-semibold text-orange-500 text-sm">Setup payout method to upload</Link>}
            </div>
            <div className="flex flex-col items-center gap-4 max-w-[350px] bg-neutral-925 p-6 rounded border border-neutral-850">
              <h2 className="text-2xl">Upload Sound Kit</h2>
              <InventoryIcon className="h-36 w-36 text-neutral-600" />
              <p className="text-center text-neutral-400">Sound kits are collections of audio samples and sounds designed for use by music producers and beat-makers. These kits include a variety of sound elements such as drum loops, basslines, melodies and instrumental one shots.</p>
              <p className="text-center text-neutral-400">Sound kits, essential for producers and sound designers, offer diverse textures and tones to boost production quality and spark creativity.</p>
              <span className="text-orange-500 text-sm mt-8">Available Soon</span>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}