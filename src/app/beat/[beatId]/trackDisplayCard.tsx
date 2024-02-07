import { BeatDocumentInterface } from "@/types/mongoDocTypes";
import Image from "next/image";
import uniqid from "uniqid";
import { TrolleyIcon, ListensIcon, LikesIcon } from "@/assets/icons";


export default function TrackDisplayCard({ beat }: { beat: BeatDocumentInterface } ) {
  const artworkUrl = beat.assets.artwork.url;

  return (
    <section className="w-screen bg-neutral-850 relative drop-shadow-md">
      <div className="relative w-screen aspect-square drop-shadow">
        <Image src={artworkUrl} priority fill sizes="w-full h-full" alt="Track artwork" className="w-full h-full object-cover" />
        <div className="absolute h-full w-full inset-0 bg-gradient-to-b from-transparent to-neutral-600 opacity-100"></div>
      </div>
      <ul className="flex gap-2 mt-2 absolute right-4 top-2">
        { beat.tags.map(item => 
          <li className="flex gap-1 items-center bg-neutral-850 rounded-full px-2 border border-neutral-700 text-sm" key={uniqid()}># {item}</li>)}
      </ul>
      <div className="w-3/5 absolute bottom-[120px] left-4">
        <h1 className="text-2xl text-shadow mb-2">{`Drake x Central Cee Type Beat "Away"`}</h1>
        <p className="font-light text-shadow">by <span className="text-orange-500 font-semibold">{beat.producer.userName}</span></p>
      </div>
      <div className="absolute right-4 bottom-[125px]">
        <div className="w-[80px] h-[80px] rounded-full bg-orange-500 drop-shadow-lg"></div>
      </div>
      <div className="flex gap-5 items-center h-14 justify-center">
        <div className="flex items-center gap-2"><ListensIcon className="h-5 w-5 text-orange-500" />3422 plays</div>
        <div className="h-4 w-[1px] bg-neutral-700"></div>
        <div className="flex items-center gap-2"><LikesIcon className="h-4 w-4 text-orange-500" />121 likes</div>
      </div>
      <button className="default-orange-button w-5/6 h-9 flex gap-3 items-center justify-center justify-self-center self-center mx-auto mb-5">
        <p>Purchase</p>
        <TrolleyIcon className="h-5 w-5 " />
      </button>
    </section>
  )
}

{/* <div className="w-screen bg-neutral-850 relative grid grid-rows-8">
      <div className="relative w-screen aspect-square drop-shadow row-start-1 row-span-6">
        <Image src={artworkUrl} priority fill sizes="w-full h-full" alt="Track artwork" className="w-full h-full object-cover" />
        <div className="absolute h-full w-full inset-0 bg-gradient-to-b from-transparent to-neutral-600 opacity-100"></div>
      </div>
      <ul className="flex gap-2 mt-2 absolute right-4 top-2">
        { beat.tags.map(item => 
          <li className="flex gap-1 items-center bg-neutral-850 rounded-full px-1 border border-neutral-700 text-sm" key={uniqid()}># {item}</li>)}
      </ul>
      <div className="row-start-3 absolute mt-auto ">
        <h1 className="text-2xl">{`Drake x Central Cee Type Beat "Away"`}</h1>
        <p className="font-light">by <span className="text-orange-500 font-semibold">{beat.producer.userName}</span></p>
      </div>
      <div className="absolute top-[75vw] right-0">
        <div className="w-[80px] h-[80px] rounded-full bg-orange-500 drop-shadow-lg"></div>
      </div>
      <div className="flex gap-5 items-center h-12 justify-self-center self-center">
        <div className="flex items-center gap-2"><ListensIcon className="h-5 w-5 text-orange-500" />3422 plays</div>
        <div className="h-4 w-[1px] bg-neutral-700"></div>
        <div className="flex items-center gap-2"><LikesIcon className="h-4 w-4 text-orange-500" />121 likes</div>
      </div>
      <button className="default-orange-button w-5/6 h-9 flex gap-3 items-center justify-center justify-self-center self-center">
        <p>Purchase</p>
        <TrolleyIcon className="h-5 w-5 " />
      </button>
    </div> */}