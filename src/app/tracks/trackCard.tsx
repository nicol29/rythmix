"use client";

import Link from "next/link";
import Image from "next/image";
import { BeatDocumentInterface } from "@/types/mongoDocTypes";


export default function TrackCard({ beat }: { beat: BeatDocumentInterface }) {


  return (
    <div className="bg-neutral-850 rounded p-2">
      <div className="relative h-14 aspect-square bg-neutral-700 rounded">
        { beat.assets?.artwork.url &&
          <Image className="absolute object-cover rounded border border-neutral-750 cursor-pointer" fill sizes="w-full h-full" src={beat.assets.artwork.url} alt="Track art" />
        }
      </div>
    </div>
  )
}