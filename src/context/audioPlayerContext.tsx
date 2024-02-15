"use client"

import { createContext, useState, useRef, useEffect } from "react";
import { BeatDocumentInterface } from "@/types/mongoDocTypes";


export const AudioPlayerContext = createContext<null | any>(null);

export default function AudioPlayerContextProvider({ children }: any) {
  const [volume, setVolume] = useState(1);
  const [isPlayBarActive, setIsPlayBarActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [track, setTrack] = useState<null | BeatDocumentInterface>(null);

  const playOrPauseTrack = () => setIsPlaying(!isPlaying);
  const openPlayBar = () => !isPlayBarActive ? setIsPlayBarActive(true) : null;
  const setCurrentTrack = (url: string) => setTrack(track);

  return (
    <AudioPlayerContext.Provider value={{isPlaying, playOrPauseTrack, setIsPlaying, isPlayBarActive, openPlayBar, setCurrentTrack, setTrack, track, volume, setVolume}}>
      {children}
    </AudioPlayerContext.Provider>
  )
}