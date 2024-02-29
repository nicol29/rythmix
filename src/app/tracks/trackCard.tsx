"use client";

import Link from "next/link";
import Image from "next/image";
import { BeatDocumentInterface } from "@/types/mongoDocTypes";
import { EditIcon, DeleteIcon } from "@/assets/icons";


export default function TrackCard({ 
  beat, index, openModal 
}: { 
  beat: BeatDocumentInterface;
  index: number;
  openModal: (beat: BeatDocumentInterface) => void; 
}) {

  return (
    <li className="flex items-center gap-4 w-full">
      <span className="text-neutral-500">{index + 1}</span>
      <div className="bg-neutral-850 rounded p-2 w-full flex items-center gap-4">
        <div className="relative h-12 aspect-square bg-neutral-700 rounded">
          { beat.assets?.artwork.url &&
            <Image className="absolute object-cover rounded border border-neutral-750 cursor-pointer" fill sizes="w-full h-full" src={beat.assets.artwork.url} alt="Track art" />
          }
        </div>
        <div className="w-full flex">
          <div style={{ width: '40%' }}>
            <Link href={`/beat/${beat.urlIdentifier}`}>{beat?.title}</Link>
          </div>
          <ul style={{ width: '20%' }} className="flex gap-2 text-sm">
            <li className={`border text-orange-500 border-orange-600 rounded px-2 py-1 ${!beat.assets?.artwork?.url && `opacity-30`}`}>IMG</li>
            <li className={`border text-orange-500 border-orange-600 rounded px-2 py-1 ${!beat.assets?.mp3?.url && `opacity-30`}`}>MP3</li>
            <li className={`border text-orange-500 border-orange-600 rounded px-2 py-1 ${!beat.assets?.wav?.url && `opacity-30`}`}>WAV</li>
          </ul>
          <div style={{ width: '20%' }} className="text-neutral-500">
            {beat?.formattedDate}
          </div>
          <div style={{ width: '20%' }} className="flex gap-4 items-center justify-end text-sm font-medium">
            <Link href={`/track/edit/${beat.urlIdentifier}`} className="flex items-center gap-1">
              <span>EDIT</span>
              <EditIcon className="h-4 w-4" />
            </Link>
            <div className="h-5 w-[1px] bg-neutral-700"></div>
            <button onClick={() => openModal(beat)} className="flex items-center gap-1 text-red-400">
              <span>DELETE</span>
              <DeleteIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </li>
  )
}