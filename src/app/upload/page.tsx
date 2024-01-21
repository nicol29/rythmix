import Header from "@/components/Header/header";
import addBeat from "@/server-actions/addBeat";


export default async function Upload () {

  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col justify-center items-center gap-3">
        <form action={addBeat}>
          <button>Upload Beat</button>
        </form>
      </main>
    </>
  )
}