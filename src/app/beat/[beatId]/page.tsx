import Header from "@/components/Header/header";
import TrackDisplayCard from "./trackDisplayCard";
import Beats from "@/models/Beats";
import connectMongoDB from "@/config/mongoDBConnection";
import { BeatDocumentInterface, LicenseInterface } from "@/types/mongoDocTypes";
import { TrolleyIcon } from "@/assets/icons";
import CommentSection from "./commentSection";


export default async function Beat({ params }: { params: { beatId: string } }) {
  await connectMongoDB();

  const res = await Beats.findOne({ urlIdentifier: params.beatId });
  const beat: BeatDocumentInterface = JSON.parse(JSON.stringify(res));

  return (
    <>
      <Header />
      <main className="min-h-screen mt-14 flex flex-col items-center gap-6">
        <TrackDisplayCard beat={beat} />
        <div className="p-4 w-full text-lg flex flex-col gap-5">
          <section className="rounded border border-neutral-700 bg-neutral-850 p-4">
            <h2 className="text-lg">Details</h2>
            <div className="border-t border-neutral-700 mt-1 flex pt-4">
              <div className="flex flex-col gap-5 flex-grow">
                <div>
                  <p className="text-base">Genre</p>
                  <p className="font-light text-sm text-neutral-400">{beat.genre}</p>
                </div>
                <div>
                  <p className="text-base">Bpm</p>
                  <p className="font-light text-sm text-neutral-400">{beat.bpm}</p>
                </div>
                <div>
                  <p className="text-base">Produced By</p>
                  <p className="font-light text-sm text-neutral-400">{beat.producer.userName}</p>
                </div>
              </div>
              <div className="flex flex-col gap-5 flex-grow">
                <div>
                  <p className="text-base">Key</p>
                  <p className="font-light text-sm text-neutral-400">{beat.key}</p>
                </div>
                <div>
                  <p className="text-base">Mood</p>
                  <p className="font-light text-sm text-neutral-400">{beat.mood}</p>
                </div>
                <div>
                  <p className="text-base">Date Published</p>
                  <p className="font-light text-sm text-neutral-400">{beat.formattedDate}</p>
                </div>
              </div>
            </div>
          </section>
          <section className="rounded border border-neutral-700 bg-neutral-850 p-4">
            <h2>Licenses</h2>
            <div className="border-t border-neutral-700 mt-1 flex flex-col pt-4">
              <LicenseCard license={beat.licenses.basic} name={"Basic"} format={"MP3 Format"} />
              <LicenseCard license={beat.licenses.premium} name={"Premium"} format={"MP3 / WAV Format"} />
              <LicenseCard license={beat.licenses.exclusive} name={"Exclusive"} format={"MP3 / WAV Format"} />
            </div>
          </section>
          <section className="rounded border border-neutral-700 bg-neutral-850 p-4">
            <h2>Comments</h2>
            <CommentSection />
          </section>
        </div>
      </main>
    </>
  )
}

function LicenseCard({ license, name, format }: { license: LicenseInterface; name: "Basic" | "Premium" | "Exclusive"; format: string }) {
  if (license.selected) {
    return (
      <>
        <div className="flex justify-between w-full">
          <div>
            <p className="text-base">{name}</p>
            <p className="font-light text-sm italic text-neutral-400">{format}</p>
            <p className="text-base mt-2">€ {license.price}</p>
          </div>
          <div className="flex items-end gap-3">
            <p className="text-sm font-semibold text-orange-500 cursor-pointer">View license agreements</p>
            <button className="default-orange-button w-11 h-11 flex items-center justify-center">
              <TrolleyIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="h-[1px] w-full bg-neutral-700 my-4"></div>
      </>
    )
  }
}