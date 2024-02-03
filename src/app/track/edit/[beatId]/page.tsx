import Header from "@/components/Header/header";
import BeatUploadForm from "@/components/BeatUploadForm/beatUploadForm";
import Beats from "@/models/Beats";


export default async function Edit ({ params }: { params: { beatId: string } }) {
  const beat = await Beats.findOne({ urlIdentifier: params.beatId });

  return (
    <>
      <Header />
      <main className="mt-14 pt-12">
        <div className="flex justify-center">
          
          <BeatUploadForm slug={params.beatId} currentBeat={beat} />
        </div>
      </main>
    </>
  )
}