"use client";

import { createContext, useState } from "react";
import { BeatDocumentInterface } from "@/types/mongoDocTypes";


export const AudioPlayerContext = createContext<null | any>(null);

export default function AudioPlayerContextProvider({ children }: any) {
  const [volume, setVolume] = useState(1);
  const [isPlayBarActive, setIsPlayBarActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [track, setTrack] = useState<null | BeatDocumentInterface>(null);
  const [playList, setPlaylist] = useState<BeatDocumentInterface[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);


  const openPlayBar = () => !isPlayBarActive ? setIsPlayBarActive(true) : null;

  const playOrPauseTrack = () => setIsPlaying(!isPlaying);

  const setNewPlaylist = (tracks: BeatDocumentInterface[]) => {
    setActiveIndex(0);
    setPlaylist(tracks);
  }

  const prevTrack = () => {
    if (activeIndex === 0) return;

    setTrack(playList[activeIndex - 1]);
    setActiveIndex(activeIndex - 1);
  }

  const nextTrack = () => {
    if (activeIndex === playList.length - 1) return;

    setTrack(playList[activeIndex + 1]);
    setActiveIndex(activeIndex + 1);
  }

  return (
    <AudioPlayerContext.Provider 
      value={{
        isPlaying, 
        playOrPauseTrack, 
        nextTrack, 
        prevTrack, 
        setIsPlaying, 
        isPlayBarActive, 
        setNewPlaylist, 
        setTrack, 
        track, 
        playList, 
        openPlayBar, 
        activeIndex, 
        volume, 
        setVolume}}>
      {children}
    </AudioPlayerContext.Provider>
  )
}