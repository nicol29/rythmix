import Header from "@/components/Header/header";
import BeatUploadForm from "@/components/BeatUploadForm/beatUploadForm";
import connectMongoDB from "@/config/mongoDBConnection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Beats from "@/models/Beats";
import { redirect } from "next/navigation";


export default async function Upload ({ params }: { params: { beatId: string } }) {
  await connectMongoDB();

  const signedInUser = await getServerSession(authOptions);
  const res = await Beats.findOne({ urlIdentifier: params.beatId });

  if (!res) redirect("/tracks");

  const beat = JSON.parse(JSON.stringify(res));
  const beatsProducer = beat.producer._id.toString();
  
  if (beatsProducer !== signedInUser?.user.id) redirect("/tracks");
  if (beat.status === "published") redirect(`/tracks`);

  return (
    <>
      <Header />
      <main className="mt-14 pt-12 pb-20">
        <div className="flex justify-center">
          
        <BeatUploadForm 
            slug={params.beatId} 
            currentBeat={beat}
            formType="upload" 
        />
        </div>
      </main>
    </>
  )
}