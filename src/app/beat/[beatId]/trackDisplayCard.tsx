"use client";

import { BeatDocumentInterface } from "@/types/mongoDocTypes";
import Image from "next/image";
import uniqid from "uniqid";
import { TrolleyIcon, ListensIcon, LikesIcon } from "@/assets/icons";
import Link from "next/link";


export default function TrackDisplayCard({ beat }: { beat: BeatDocumentInterface } ) {
  const artworkUrl = beat.assets.artwork.url;

  return (
    <section className="custom-grid-layout w-screen bg-neutral-850 relative drop-shadow-md sm:border sm:border-neutral-700 sm:w-11/12 sm:max-w-[900px] sm:max-h-[300px] sm:p-4 sm:rounded-lg sm:absolute sm:top-[200px]">
      <div className="relative w-screen aspect-square drop-shadow sm:w-full sm:row-span-3">
        <Image src={artworkUrl} priority fill sizes="w-full h-full" alt="Track artwork" className="w-full h-full object-cover sm:rounded-lg" />
        <div className="absolute h-full w-full inset-0 bg-gradient-to-b from-transparent to-neutral-600 opacity-100 sm:hidden"></div>
      </div>
      <ul className="flex gap-2 mt-2 absolute right-4 top-2 sm:right-0 sm:-top-10">
        { beat.tags.map(item => 
          <li className="flex gap-1 items-center bg-neutral-850 rounded-full px-2 border border-neutral-700 text-sm" key={uniqid()}># {item}</li>)}
      </ul>
      <div className="w-3/5 absolute bottom-[120px] left-4 sm:static sm:ml-4 sm:row-start-1 sm:col-start-2 sm:col-span-3">
        <h1 className="text-2xl text-shadow mb-2 sm:mb-0">{`Drake x Central Cee Type Beat "Away"`}</h1>
        <Link href={`/${beat.producer.profileUrl}`} className='text-orange-500 font-medium text-base'>{beat.producer.userName}</Link>
      </div>
      <div className="absolute right-4 bottom-[125px] sm:static sm:row-start-3 sm:col-start-2 sm:col-span-3 sm:self-end sm:bg-neutral-900 sm:rounded-lg sm:p-4 sm:ml-4">
        <div className="w-[80px] h-[80px] rounded-full bg-orange-500 drop-shadow-lg cursor-pointer"></div>
        <div className="hidden sm:block"> </div>
      </div>
      <div className="flex gap-5 items-center h-14 justify-center sm:col-start-3 sm:col-span-2 sm:row-start-2 sm:ml-auto sm:pb-2">
        <div className="flex items-center gap-2"><ListensIcon className="h-5 w-5 text-orange-500" />{} plays</div>
        <div className="h-4 w-[1px] bg-neutral-700"></div>
        <div className="flex items-center gap-2"><LikesIcon className="h-4 w-4 text-orange-500" />{} likes</div>
      </div>
      <a href="#licenses" className="default-orange-button w-5/6 h-9 flex gap-3 items-center justify-center justify-self-center self-center mx-auto mb-5 sm:row-start-1 sm:col-start-4 sm:w-[115px] sm:mb-auto sm:mr-0">
        <p>Purchase</p>
        <TrolleyIcon className="h-5 w-5 " />
      </a>
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