import Header from "@/components/Header/header";
import TrackDisplayCard from "./trackDisplayCard";
import Beats from "@/models/Beats";
import connectMongoDB from "@/config/mongoDBConnection";
import { BeatDocumentInterface } from "@/types/mongoDocTypes";
import LicenseCard from "./licenseCard";
import CommentSection from "./commentSection";
import Users from "@/models/Users";
import { redirect } from "next/navigation";
import Image from "next/image";
import Plays from "@/models/Plays";
import Likes from "@/models/Likes";


export default async function Beat({ params }: { params: { beatId: string } }) {
  await connectMongoDB();

  const res = await Beats.findOne({ 
    urlIdentifier: params.beatId,
    status: "published"
  }).populate({
    path: 'comments.author',
    model: Users,
    select: 'userName profilePicture profileUrl'
  });
  if (!res) redirect("/");

  const beat: BeatDocumentInterface = JSON.parse(JSON.stringify(res));

  const totalLikes = await Likes.countDocuments({ beat: beat._id });
  const totalPlays = await Plays.countDocuments({ beat: beat._id });

  return (
    <>
      <Header />
      <main className="min-h-screen mt-14 flex flex-col items-center gap-6 pb-10 sm:relative">
        <div className="hidden sm:block sm:relative sm:w-screen sm:h-[400px] drop-shadow-lg">
          <Image src={beat.assets.artwork.url} priority fill sizes="w-full h-full" className="object-cover object-top" alt="User profile picture" />
          <div className="absolute w-full h-full inset-0 bg-gradient-to-b from-transparent to-neutral-600 opacity-100"></div>
        </div>
        <TrackDisplayCard 
          beat={beat} 
          totalLikes={JSON.parse(JSON.stringify(totalLikes))} 
          totalPlays={JSON.parse(JSON.stringify(totalPlays))} 
        />
        <div className="p-4 w-full text-lg flex flex-col gap-5 sm:w-11/12 sm:max-w-[932px] sm:mt-24 sm:grid sm:grid-cols-2 sm:grid-rows-2">
          <section className="rounded border border-neutral-700 bg-neutral-850 p-4">
            <h2 className="text-lg">Details</h2>
            <div className="border-t border-neutral-700 mt-1 flex pt-4">
              <div className="flex flex-col gap-5 flex-grow">
                <div>
                  <p className="text-base">Genre</p>
                  <p className="font-light text-sm text-neutral-400">{beat?.genre}</p>
                </div>
                <div>
                  <p className="text-base">Bpm</p>
                  <p className="font-light text-sm text-neutral-400">{beat?.bpm}</p>
                </div>
                <div>
                  <p className="text-base">Produced By</p>
                  <p className="font-light text-sm text-neutral-400">{beat.producer.userName}</p>
                </div>
              </div>
              <div className="flex flex-col gap-5 flex-grow">
                <div>
                  <p className="text-base">Key</p>
                  <p className="font-light text-sm text-neutral-400">{beat?.key}</p>
                </div>
                <div>
                  <p className="text-base">Mood</p>
                  <p className="font-light text-sm text-neutral-400">{beat?.mood}</p>
                </div>
                <div>
                  <p className="text-base">Date Published</p>
                  <p className="font-light text-sm text-neutral-400">{beat?.formattedDate}</p>
                </div>
              </div>
            </div>
          </section>
          <section className="rounded border border-neutral-700 bg-neutral-850 p-4">
            <h2 id="licenses">Licenses</h2>
            <div className="border-t border-neutral-700 mt-1 flex flex-col pt-4">
              <LicenseCard 
                license={beat.licenses.basic}
                licenseTerms={beat.licenseTerms.basic}
                name={"Basic"} 
                format={"MP3 Format"} 
              />
              <LicenseCard 
                license={beat.licenses.premium} 
                licenseTerms={beat.licenseTerms.premium}
                name={"Premium"} 
                format={"MP3 / WAV Format"} 
              />
              <LicenseCard 
                license={beat.licenses.exclusive} 
                licenseTerms={beat.licenseTerms.exclusive}
                name={"Exclusive"} 
                format={"MP3 / WAV Format"} 
              />
            </div>
          </section>
          <section className="rounded border border-neutral-700 bg-neutral-850 p-4 sm:col-span-2">
            <h2>Comments ({beat.comments.length})</h2>
            <CommentSection beat={beat} />
          </section>
        </div>
      </main>
    </>
  )
}

