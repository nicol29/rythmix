import Header from "@/components/Header/header";
import BeatUploadForm from "@/components/BeatUploadForm/beatUploadForm";
import Beats from "@/models/Beats";
import connectMongoDB from "@/config/mongoDBConnection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { redirect } from "next/navigation";
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: "Edit track | Rythmix",
}


export default async function Edit ({ params }: { params: { beatId: string } }) {
  await connectMongoDB();

  const signedInUser = await getServerSession(authOptions);
  const res = await Beats.findOne({ urlIdentifier: params.beatId });

  if (!res) redirect("/tracks");

  const beat = JSON.parse(JSON.stringify(res));
  const beatsProducer = beat.producer._id.toString();

  if (beatsProducer !== signedInUser?.user.id) redirect("/tracks");
  if (beat.status === "draft") redirect(`/track/upload/${params.beatId}`);

  return (
    <>
      <Header />
      <main className="mt-14 pt-12 pb-24">
        <div className="flex justify-center">
          
        <BeatUploadForm 
          slug={params.beatId} 
          currentBeat={beat}
          formType="edit" 
          beatID={res._id.toString()}
        />
        </div>
      </main>
    </>
  )
}