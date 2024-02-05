import Header from '@/components/Header/header'
import Beats from '@/models/Beats'


export default async function Home() {
  // const beat = await Beats.findOne();
  // console.log(beat);

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p className="mt-36">Home Page</p>
      </main>
    </>
  )
}
