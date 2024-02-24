"use client";

import { BeatDocumentInterface } from "@/types/mongoDocTypes";
import Link from "next/link";
import Image from "next/image";
import uniqid from "uniqid";
import returnCheapestLicensePrice from "@/utils/returnCheapestLicensePrice";
import { TrolleyIcon } from "@/assets/icons";
import { useContext } from "react";
import { AudioPlayerContext } from "@/context/audioPlayerContext";


export default function BeatResultCards({ beats }: { beats: BeatDocumentInterface[] }) {
  return (
    <div className="w-11/12 flex flex-col gap-3 max-w-[850px]">
      { beats.map((beat) => (
        <div key={beat._id.toString()} className="bg-neutral-850 rounded flex gap-3 p-2">
          <div className="relative h-full aspect-square">
            <Image className="absolute object-cover rounded border border-neutral-750 cursor-pointer" fill sizes="w-full h-full" src={beat?.assets.artwork.url} alt="Track art" />
          </div>
          <div className="flex-grow">
            <div className="w-full flex justify-between">
              <div className="truncate max-w-[150px] sm:max-w-none">
                <Link href={`/beat/${beat.urlIdentifier}`} className="leading-3 truncate">{beat.title}</Link>
              </div>
              <ul className="hidden sm:flex sm:gap-2">
                { beat.tags.map(item => 
                  <li className="flex gap-1 items-center bg-neutral-750 text-neutral-400 rounded-full px-2 text-xs" key={uniqid()}># {item}</li>)}
              </ul>
            </div>
            <Link href={`/${beat.producer.profileUrl}`} className="text-sm text-orange-500">{beat.producer.userName}</Link>
            <div className="flex gap-3 items-center">
              <span className="text-neutral-500 text-xs font-base">{beat.genre}</span>
              <div className="h-4 w-[1px] bg-neutral-600"></div>
              <span className="text-neutral-500 text-xs font-base">{beat.bpm} bpm</span>
            </div>
          </div>
          <div className="w-[90px] flex items-center justify-end">
            <button className="default-orange-button self-center items-center flex px-1">
              <span className="font-normal">€{returnCheapestLicensePrice(beat)}</span>
              <TrolleyIcon className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      )) }
    </div>
  )
}