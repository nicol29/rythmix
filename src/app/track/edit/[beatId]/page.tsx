import Header from "@/components/Header/header";
import BeatUploadForm from "@/components/BeatUploadForm/beatUploadForm";
import Beats from "@/models/Beats";
import connectMongoDB from "@/config/mongoDBConnection";


export default async function Edit ({ params }: { params: { beatId: string } }) {
  await connectMongoDB();
  const res = await Beats.findOne({ urlIdentifier: params.beatId });
  const beat = JSON.parse(JSON.stringify(res));


  return (
    <>
      <Header />
      <main className="mt-14 pt-12">
        <div className="flex justify-center">
          
          <BeatUploadForm 
            slug={params.beatId} 
            currentBeat={beat}
            formType="edit" 
          />
        </div>
      </main>
    </>
  )
}