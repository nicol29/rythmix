import Header from "@/components/Header/header";
import addBeatEntry from "@/server-actions/addBeatEntry";


export default async function Upload () {

  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col justify-center items-center gap-3">
        <form action={addBeatEntry}>
          <button>Upload Beat</button>
        </form>
      </main>
    </>
  )
}