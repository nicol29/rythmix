"use client";

import { BeatDocumentInterface } from "@/types/mongoDocTypes";
import Image from "next/image";
import { PlayAudioIcon, PauseAudioIcon } from "@/assets/icons"; 
import Link from "next/link";
import { useContext } from "react";
import { AudioPlayerContext } from "@/context/audioPlayerContext";
import addPlay from "@/server-actions/addPlay";


export default function BeatCard({ beat, option }: { beat: BeatDocumentInterface, option?: "simple" }) {
  const { isPlaying, setIsPlaying, playOrPauseTrack, openPlayBar, isPlayBarActive, track, setTrack, volume, setVolume } = useContext(AudioPlayerContext);

  const getPrice = () => {
    const { licenses } = beat;

    if (licenses.basic.selected) return licenses.basic.price;
    if (licenses.premium.selected) return licenses.premium.price;
    if (licenses.exclusive.selected) return licenses.exclusive.price;
  }

  const playTrack = async () => {
    openPlayBar();


    if (track?._id === beat._id) {
      playOrPauseTrack();
    } else {
      setTrack(beat);
      setIsPlaying(true);
      // addPlay(beat._id.toString());
    }
  }
  
  return (
    <div className="box-border rounded p-4 border border-transparent hover:bg-neutral-800 hover:border-neutral-750">
      <div className="relative group flex justify-center">
        <Link className="relative aspect-square w-[220px]" href={`/beat/${beat.urlIdentifier}`}>
          <Image className="object-cover rounded border border-neutral-750 cursor-pointer" fill sizes="w-full h-full" src={beat.assets.artwork.url} alt="Track art" />
        </Link>
        <div onClick={() => playTrack()} className="sm:hidden cursor-pointer hover:bg-transparent-d-black group-hover:block bg-transparent-l-black absolute w-12 h-12 rounded-full self-center">
          { track?._id === beat._id ?
            (isPlaying ? 
              <PauseAudioIcon className="w-full h-full text-neutral-300" /> :
              <PlayAudioIcon className="w-full h-full text-neutral-300" />
            ) : 
            <PlayAudioIcon className="w-full h-full text-neutral-300" />
          }
        </div>
      </div>
      <div className="mt-4 max-w-[220px]">
        <Link href={`/beat/${beat.urlIdentifier}`} className="text-lg"><h3 className="truncate">{beat.title}</h3></Link>
        <div className="flex justify-between items-center">
          { option === "simple" ?
            <div className="flex items-center justify-between gap-2 text-neutral-500 w-full">
              <span className="font-normal text-sm">{beat?.genre}</span>
              <span className="text-orange-500 bg-neutral-750 px-2 rounded-full">€ {getPrice()}</span>
            </div> :
            <>
              <Link href={`/${beat.producer.profileUrl}`} className="text-orange-500 font-medium">{beat.producer.userName}</Link>
              <div className="flex items-center gap-2 text-neutral-500">
                <span className="font-normal text-sm">{beat?.genre}</span>
                {beat?.genre && <div className="h-4 w-[1px] bg-neutral-700"></div>}
                <span className="text-orange-500 bg-neutral-750 px-2 rounded-full">€ {getPrice()}</span>
              </div>
            </>
          }
        </div>
      </div>
    </div>
  );
}

