"use client";

import { createContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BeatDocumentInterface } from "@/types/mongoDocTypes";


export const AudioPlayerContext = createContext<null | any>(null);

export default function AudioPlayerContextProvider({ children }: any) {
  const [volume, setVolume] = useState(1);
  const [isPlayBarActive, setIsPlayBarActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [track, setTrack] = useState<null | BeatDocumentInterface>(null);
  const [playList, setPlaylist] = useState<BeatDocumentInterface[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const pathName = usePathname();


  const openPlayBar = () => !isPlayBarActive ? setIsPlayBarActive(true) : null;

  const playOrPauseTrack = () => setIsPlaying(!isPlaying);

  const setNewPlaylist = (tracks: BeatDocumentInterface[]) => {
    setActiveIndex(0);
    setPlaylist(tracks);
  }

  const appendToPlaylist = (newTracks: BeatDocumentInterface[]) => {
    setPlaylist([...playList, ...newTracks]);
  }

  const prevTrack = () => {
    if (activeIndex === 0) return;

    setTrack(playList[activeIndex - 1]);
    setActiveIndex(activeIndex - 1);
    setIsPlaying(true);
  }

  const nextTrack = () => {
    if (activeIndex === playList.length - 1) return;

    setTrack(playList[activeIndex + 1]);
    setActiveIndex(activeIndex + 1);
    setIsPlaying(true);
  }

  useEffect(() => {
    const destroyPaths = ["/login", "/register"];

    destroyPaths.forEach(path => {
      if (path === pathName) {
        setIsPlayBarActive(false);
        setIsPlaying(false);
        setTrack(null);
        setPlaylist([]);
        setActiveIndex(0);
      }
    });
  }, [pathName]);

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
        appendToPlaylist,
        setTrack, 
        track, 
        playList, 
        openPlayBar, 
        activeIndex, 
        volume, 
        setVolume
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  )
}