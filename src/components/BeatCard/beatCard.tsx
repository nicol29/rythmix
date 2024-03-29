"use client";

import { BeatDocumentInterface } from "@/types/mongoDocTypes";
import Image from "next/image";
import { PlayAudioIcon, PauseAudioIcon } from "@/assets/icons"; 
import Link from "next/link";
import { useContext } from "react";
import { AudioPlayerContext } from "@/context/audioPlayerContext";
import returnCheapestLicensePrice from "@/utils/returnCheapestLicensePrice";


export default function BeatCard({ beatList, beat, option }: { beatList: BeatDocumentInterface[]; beat: BeatDocumentInterface; option?: "simple" }) {
  const { isPlaying, setIsPlaying, playOrPauseTrack, openPlayBar, setNewPlaylist, track, setTrack } = useContext(AudioPlayerContext);

  const playTrack = async () => {
    openPlayBar();

    createPlayList();

    if (track?._id === beat._id) {
      playOrPauseTrack();
    } else {
      setTrack(beat);
      setIsPlaying(true);
    }
  }

  const createPlayList = () => {
    const currentBeatIndex = beatList.findIndex(currentBeat => currentBeat._id.toString() === beat._id.toString());
    const playList = beatList.slice(currentBeatIndex);

    setNewPlaylist(playList);
  }
  
  return (
    <div className="box-border rounded p-2 border border-transparent hover:bg-neutral-750 hover:border-neutral-500 lg:p-4">
      <div className="relative group flex justify-center">
        <Link className="relative aspect-square w-[220px]" href={`/beat/${beat.urlIdentifier}`}>
          <Image className="object-cover rounded border border-neutral-750 cursor-pointer" fill sizes="w-full h-full" src={beat.assets.artwork.url} alt="Track art" />
        </Link>
        <div onClickCapture={() => playTrack()} className="sm:hidden cursor-pointer hover:bg-transparent-d-black group-hover:block bg-transparent-l-black absolute w-12 h-12 rounded-full self-center">
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
              <span className="text-orange-500 bg-neutral-750 px-2 rounded-full">€ {returnCheapestLicensePrice(beat)}</span>
            </div> :
            <>
              <Link href={`/${beat.producer.profileUrl}`} className="text-orange-500 font-medium">{beat.producer.userName}</Link>
              <div className="flex items-center gap-2 text-neutral-500">
                <span className="font-normal text-sm">{beat?.genre}</span>
                {beat?.genre && <div className="h-4 w-[1px] bg-neutral-700"></div>}
                <span className="text-orange-500 bg-neutral-750 px-2 rounded-full">€ {returnCheapestLicensePrice(beat)}</span>
              </div>
            </>
          }
        </div>
      </div>
    </div>
  );
}

