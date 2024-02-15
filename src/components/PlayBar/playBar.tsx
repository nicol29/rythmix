"use client";

import { useContext, useRef, useEffect, useState } from "react";
import { AudioPlayerContext } from "@/context/audioPlayerContext";
import Beats from "@/models/Beats";
import { VolumeIcon, VolumeMutedIcon, SkipPrevButton, SkipNextButton, PauseAudioIcon, PlayAudioIcon, LikesFilledIcon, LikesIcon } from "@/assets/icons";
import Link from "next/link";
import Image from "next/image";


export default function PlayBar() {
  const waveSurferRef = useRef<null | any>(null);
  const waveFormRef = useRef<null | any>(null);


  const { isPlaying, playOrPauseTrack, openPlayBar, isPlayBarActive, track, setTrack, volume, setVolume } = useContext(AudioPlayerContext);

  useEffect(() => {
    if (!waveFormRef.current) return;


    const initWaveSurfer = async () => {
      const WaveSurfer = (await import('wavesurfer.js')).default;

      waveSurferRef.current = WaveSurfer.create({
        container: waveFormRef.current,
        waveColor: 'rgb(255 237 213)',
        progressColor: 'rgb(249 115 22)',
        dragToSeek: true,
        barGap: 2,
        barWidth: 2,
        height: "auto",
        cursorWidth: 0,
        backend: 'MediaElement'
      })
    };

    initWaveSurfer();

    
    if (waveSurferRef.current && typeof waveSurferRef.current.destroy === 'function') {
      waveSurferRef.current.destroy();
    }
  }, []);

  useEffect(() => {
    if (waveSurferRef.current) {
      isPlaying ? waveSurferRef.current.play() : waveSurferRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (waveSurferRef.current) {
      waveSurferRef.current.load(track.assets.mp3.url);
    }
  }, [track]);

  useEffect(() => {
    if (waveSurferRef.current) {
      waveSurferRef.current.setVolume(volume);
    }
  }, [volume]);
  
  if (isPlayBarActive) {
    return (
      <>
        <section className="bg-neutral-850 border-t border-neutral-700 fixed bottom-0 w-full h-16">
          <div className="w-full max-w-[1500px] px-5 h-full mx-auto flex items-center justify-between gap-12">
            <div className="flex gap-3 items-center">
              <Link className="relative w-14 aspect-square" href={`/beat/${track.urlIdentifier}`}>
                <Image className="absolute object-cover rounded border border-neutral-750 cursor-pointer" fill sizes="w-full h-full" src={track.assets.artwork.url} alt="Track art" />
              </Link>
              <div className="w-[220px] flex flex-col">
                <Link href={`/beat/${track.urlIdentifier}`} className="w-full truncate">{track.title}</Link>
                <Link href={`/${track.producer.profileUrl}`} className="text-sm text-orange-500 font-medium mb-auto">{track.producer.userName}</Link>
              </div>
              { <LikesIcon className={"h-6 w-6 text-orange-500 cursor-pointer"} /> }
            </div>
            <div ref={waveFormRef} className="px-3 h-12 w-4/6"></div>
            <div className="flex gap-8">
              <div className="flex gap-2 items-center">
                { volume === 0 ? 
                  <VolumeMutedIcon onClick={() => setVolume(1)} className={"h-6 w-6 text-neutral-300 cursor-pointer"} /> : 
                  <VolumeIcon onClick={() => setVolume(0)} className={"h-6 w-6 text-neutral-300 cursor-pointer"} />
                }
                <input className="h-1 w-[80px] cursor-pointer" type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} />
              </div>
              <div className="flex items-center gap-2">
                <SkipPrevButton className={"h-6 w-6 text-neutral-300 cursor-pointer"} />
                { isPlaying ? 
                  <PauseAudioIcon onClick={playOrPauseTrack} className={"h-8 w-8 text-neutral-300 cursor-pointer"} /> :
                  <PlayAudioIcon onClick={playOrPauseTrack} className={"h-8 w-8 text-neutral-300 cursor-pointer"} />
                }
                <SkipNextButton className={"h-6 w-6 text-neutral-300 cursor-pointer"} />
              </div>
            </div>
          </div>
          {/* <p onClick={() => setTrack("https://artcore-mp3-previews.s3.eu-west-2.amazonaws.com/21ee6dca-5d12-40b9-9166-6a12e4f8cda9-74084.mp3")}>play</p> */}
        </section>
        {/* <div className="bg-neutral-850 fixed bottom-0 w-full h-16 border-t border-neutral-700">
          
        </div> */}
      </>
    )
  }
}