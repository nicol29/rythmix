"use client";

import { useContext } from "react";
import { AudioPlayerContext } from "@/context/audioPlayerContext";
import { PauseAudioIcon, PlayAudioIcon } from "@/assets/icons";
import { BeatDocumentInterface } from "@/types/mongoDocTypes";


export default function BeatRouteControls({ beat }: { beat: BeatDocumentInterface }) {
  const { isPlaying, setIsPlaying, playOrPauseTrack, openPlayBar, setNewPlaylist, track, setTrack } = useContext(AudioPlayerContext);

  const playTrack = async () => {
    openPlayBar();

    setNewPlaylist([beat]);

    if (track?._id === beat._id) {
      playOrPauseTrack();
    } else {
      setTrack(beat);
      setIsPlaying(true);
    }
  }

  return (
    <div onClick={() => playTrack()} className="w-[80px] h-[80px] rounded-full bg-orange-500 drop-shadow-lg cursor-pointer flex justify-center items-center">
      { track?._id === beat._id ?
        (isPlaying ? 
          <PauseAudioIcon className="w-full h-full text-neutral-300" /> :
          <PlayAudioIcon className="w-full h-full text-neutral-300" />
        ) : 
        <PlayAudioIcon className="w-full h-full text-neutral-300" />
      }
    </div>
  )
}