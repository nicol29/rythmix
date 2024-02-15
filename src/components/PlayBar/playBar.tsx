"use client";

import { useContext, useRef, useEffect } from "react";
import { AudioPlayerContext } from "@/context/audioPlayerContext";
import { VolumeIcon, VolumeMutedIcon, SkipPrevButton, SkipNextButton, PauseAudioIcon, PlayAudioIcon, LikesFilledIcon, LikesIcon } from "@/assets/icons";
import Link from "next/link";
import Image from "next/image";


export default function PlayBar() {
  const { isPlaying, playOrPauseTrack, playList, setIsPlaying, track, volume, setVolume, activeIndex, nextTrack, prevTrack, isPlayBarActive } = useContext(AudioPlayerContext);

  const waveSurferRef = useRef<null | any>(null);
  const waveFormRef = useRef<null | any>(null);


  useEffect(() => {
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

    if (!waveSurferRef.current && waveFormRef?.current) {
      initWaveSurfer();
    }

    if (waveSurferRef.current && typeof waveSurferRef.current.destroy === 'function') {
      return () => {
        waveSurferRef.current.destroy();
      }
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

      waveSurferRef.current?.on('ready', () => {
        waveSurferRef.current.play();
      });

      waveSurferRef.current?.on('finish', () => {
        nextTrack();
      })
    }
  }, [track]);

  useEffect(() => {
    if (waveSurferRef.current) {
      waveSurferRef.current?.on('seeking', () => {
        waveSurferRef.current?.play();
        setIsPlaying(true);
      });
    }
  }, [setIsPlaying, track]);

  useEffect(() => {
    if (waveSurferRef.current) {
      waveSurferRef.current.setVolume(volume);
    }
  }, [volume]);

  return (
    <section className={`bg-neutral-850 border-t border-neutral-700 bottom-0 w-full h-16 ${isPlayBarActive ? "fixed" : "hidden" }`}>
      <div className="w-full h-full pr-3 flex items-center gap-1 justify-between lg:gap-12 lg:px-5 lg:max-w-[1500px] lg:mx-auto">
        <div className="flex h-full gap-3 items-center w-3/6">
          <Link className="relative h-full aspect-square lg:w-14 lg:h-14" href={`/beat/${track?.urlIdentifier}`}>
            { track?.assets.artwork.url &&
              <Image className="absolute object-cover rounded border border-neutral-750 cursor-pointer" fill sizes="w-full h-full" src={track?.assets.artwork.url} alt="Track art" />
            }
          </Link>
          <div className="flex flex-col w-4/6 lg:w-[220px]">
            <Link href={`/beat/${track?.urlIdentifier}`} className="text-sm w-full truncate lg:text-base">{track?.title}</Link>
            <Link href={`/${track?.producer?.profileUrl}`} className="text-xs text-orange-500 font-medium mb-auto lg:text-sm">{track?.producer?.userName}</Link>
          </div>
          { <LikesIcon className={"h-6 w-6 text-orange-500 cursor-pointer flex-shrink-0"} /> }
        </div>
        <div className="absolute bottom-16 px-3 h-6 w-full overflow-y-hidden lg:static lg:h-12">
          <div ref={waveFormRef} className="h-12 w-full cursor-pointer lg:h-full"></div>
        </div>
        <div className="flex gap-8">
          <div className="hidden lg:flex lg:gap-2 lg:items-center">
            { volume === 0 ? 
              <VolumeMutedIcon onClick={() => setVolume(1)} className={"h-6 w-6 text-neutral-300 cursor-pointer"} /> : 
              <VolumeIcon onClick={() => setVolume(0)} className={"h-6 w-6 text-neutral-300 cursor-pointer"} />
            }
            <input className="h-1 w-[80px] cursor-pointer" type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} />
          </div>
          <div className="flex items-center gap-2">
            <SkipPrevButton onClick={prevTrack} className={`h-6 w-6 text-neutral-300 cursor-pointer ${activeIndex === 0 && "opacity-40"}`} />
            { isPlaying ? 
              <PauseAudioIcon onClick={playOrPauseTrack} className={"h-8 w-8 text-neutral-300 cursor-pointer"} /> :
              <PlayAudioIcon onClick={playOrPauseTrack} className={"h-8 w-8 text-neutral-300 cursor-pointer"} />
            }
            <SkipNextButton onClick={nextTrack} className={`h-6 w-6 text-neutral-300 cursor-pointer ${activeIndex === playList.length - 1 && "opacity-40"}`} />
          </div>
        </div>
      </div>
    </section>
  )
}