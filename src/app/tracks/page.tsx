import Link from "next/link";
import { Suspense } from "react";
import Loading from "./loading";
import PublishedTracks from "./publishedTracks";


export default async function Tracks() {
  return (
    <main className="min-h-screen mt-14">
      <section className="relative bg-neutral-925 flex justify-center pt-10 sm:pt-16">
        <div className="w-5/6 sm:max-w-[1300px]">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl">Your Tracks</h1>
            <Link href="/upload" className="default-orange-button px-3 py-1 flex gap-2"><span>+</span>Create Track</Link>
          </div>
          <div className="mt-10 flex gap-4 text-lg text-neutral-400 sm:mt-16">
            <Link href="/tracks" className="px-1 border-b-2 border-orange-500">Published</Link>
            <Link href="/tracks/drafts" className="px-1">Drafts</Link>
          </div>
        </div>
      </section>
      <section className="flex flex-col items-center py-20">
        <div className="w-5/6 sm:max-w-[1200px] flex pl-24 text-neutral-500 mb-3">
          <div style={{ width: '40%' }}>Track</div>
          <div style={{ width: '20%' }} className="hidden lg:block">Formats</div>
          <div style={{ width: '20%' }} className="hidden lg:block">Date</div>
          <div style={{ width: '20%' }} className="ml-auto">Actions</div>
        </div>
        <Suspense fallback={<Loading />}>
          <PublishedTracks />
        </Suspense>
      </section>
    </main>
  )
}