import Header from "@/components/Header/header";
import BeatUploadForm from "@/components/BeatUploadForm/beatUploadForm";


export default function Upload ({ params }: { params: { beatId: string } }) {
  
  return (
    <>
      <Header />
      <main className="mt-14 pt-12">
        <div className="flex justify-center">
          
          <BeatUploadForm slug={params.beatId} />
        </div>
      </main>
    </>
  )
}