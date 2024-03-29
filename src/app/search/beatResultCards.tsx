"use client";

import { BeatDocumentInterface, LicenseInterface, LicenseTermsInterface } from "@/types/mongoDocTypes";
import Link from "next/link";
import Image from "next/image";
import uniqid from "uniqid";
import returnCheapestLicensePrice from "@/utils/returnCheapestLicensePrice";
import { TrolleyIcon, PauseAudioIcon, PlayAudioIcon, Spinner, CloseIcon } from "@/assets/icons";
import { useContext, useRef, useEffect, useState } from "react";
import { AudioPlayerContext } from "@/context/audioPlayerContext";
import { getSearchResults } from "@/server-actions/getSearchResults";
import Modal from "@/components/Modal/modal";
import LicenseCard from "../beat/[beatId]/licenseCard";


export default function BeatResultCards({ 
  beats,
  searchString,
  filters,
  sortFilter
}: { 
  beats: BeatDocumentInterface[];
  searchString: string | undefined;
  filters: { [key: string]: string | number };
  sortFilter: number | undefined;
}) {
  const { isPlaying, setIsPlaying, playOrPauseTrack, openPlayBar, setNewPlaylist, track, setTrack, appendToPlaylist } = useContext(AudioPlayerContext);
  const [beatsPlaylist, setBeatsPlaylist] = useState<BeatDocumentInterface[]>([]);
  const [queryPos, setQueryPos] = useState(0);
  const [lastDocs, setLastDocs] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalBeat, setModalBeat] = useState<null | BeatDocumentInterface>(null);
  const spinnerRef = useRef(null);


  const playTrack = async (beat: BeatDocumentInterface) => {
    openPlayBar();

    createPlayList(beat);

    if (track?._id === beat._id) {
      playOrPauseTrack();
    } else {
      setTrack(beat);
      setIsPlaying(true);
    }
  }

  const createPlayList = (beat: BeatDocumentInterface) => {
    const currentBeatIndex = beatsPlaylist.findIndex(currentBeat => currentBeat._id.toString() === beat._id.toString());
    const playList = beatsPlaylist.slice(currentBeatIndex);

    setNewPlaylist(playList);
  }

  const getMoreBeats = async () => {
    const moreBeats = await getSearchResults(searchString, filters, sortFilter, queryPos);

    if (moreBeats.beats.length < 1) {
      setLastDocs(true);
      return;
    } 
    appendToPlaylist(moreBeats.beats);
    setBeatsPlaylist(beatsPlaylist => [...beatsPlaylist, ...moreBeats.beats]);
  }

  useEffect(() => {
    if (spinnerRef.current) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setQueryPos(queryPos => queryPos + 1);
        }
      });

      observer.observe(spinnerRef.current);

      return () => {
        observer.disconnect();
      }
    }
  }, [spinnerRef]);

  useEffect(() => {
    if (queryPos === 0) return;

    getMoreBeats();
  }, [queryPos]);

  useEffect(() => {
    setBeatsPlaylist(beats);
    setQueryPos(0);

    beats?.length < 1 ? setLastDocs(false) : setLastDocs(false);

  }, [beats]);

  const openModal = (chosenBeat: BeatDocumentInterface) => {
    setIsModalOpen(true);
    setModalBeat(chosenBeat);
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setModalBeat(null);
  }

  return (
    <div className="w-11/12 flex flex-col gap-3 max-w-[850px]">
      { beatsPlaylist.map((beat) => (
        <div key={beat._id.toString()} className="bg-neutral-850 rounded flex gap-3 p-2">
          <div className="relative h-full aspect-square flex justify-center items-center">
            <Image className="absolute object-cover rounded border border-neutral-750 cursor-pointer" fill sizes="w-full h-full" src={beat?.assets.artwork.url} alt="Track art" />
            <div onClickCapture={() => playTrack(beat)} className="cursor-pointer hover:bg-transparent-d-black bg-transparent-l-black absolute w-8 h-8 rounded-full self-center">
              { track?._id === beat._id ?
                (isPlaying ? 
                  <PauseAudioIcon className="w-full h-full text-neutral-300" /> :
                  <PlayAudioIcon className="w-full h-full text-neutral-300" />
                ) : 
                <PlayAudioIcon className="w-full h-full text-neutral-300" />
              }
            </div>
          </div>
          <div className="flex-grow">
            <div className="w-full flex justify-between">
              <div className="truncate max-w-[150px] sm:max-w-none">
                <Link href={`/beat/${beat.urlIdentifier}`} className="leading-3 truncate">{beat.title}</Link>
              </div>
              <ul className="hidden sm:flex sm:gap-2">
                { beat.tags.map(item => 
                  <li className="flex gap-1 items-center bg-neutral-750 text-neutral-400 rounded-full px-2 text-xs" key={uniqid()}># {item}</li>)}
              </ul>
            </div>
            <Link href={`/${beat.producer.profileUrl}`} className="text-sm text-orange-500">{beat.producer.userName}</Link>
            <div className="flex gap-3 items-center">
              <span className="text-neutral-500 text-xs font-base">{beat.genre}</span>
              <div className="h-2 w-[1px] bg-neutral-600"></div>
              <span className="text-neutral-500 text-xs font-base">{beat.bpm} bpm</span>
            </div>
          </div>
          <div className="w-[90px] flex items-center justify-end">
            <button onClick={() => openModal(beat)} className="default-orange-button self-center items-center flex px-1">
              <span className="font-normal">€{returnCheapestLicensePrice(beat)}</span>
              <TrolleyIcon className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      )) }
      <div ref={spinnerRef} >
        {!lastDocs && <Spinner className="h-11 w-11" />}
      </div>
      <Modal 
        isModalOpen={isModalOpen}
        closeModal={closeModal}
      >
        <div>
          <div className="flex justify-between items-center">
            <h2 id="licenses">Licenses</h2>
            <CloseIcon onClick={closeModal} className="h4 w-4 cursor-pointer" />
          </div>
          <div className="border-t border-neutral-700 mt-1 flex flex-col pt-4">
            <LicenseCard 
              beat={modalBeat as BeatDocumentInterface}
              license={modalBeat?.licenses.basic as LicenseInterface}
              licenseTerms={modalBeat?.licenseTerms.basic as LicenseTermsInterface}
              name={"Basic"} 
              format={"MP3 Format"} 
              closeModal={closeModal}
            />
            <LicenseCard 
              beat={modalBeat as BeatDocumentInterface}
              license={modalBeat?.licenses.premium as LicenseInterface} 
              licenseTerms={modalBeat?.licenseTerms.premium as LicenseTermsInterface}
              name={"Premium"} 
              format={"MP3 / WAV Format"} 
              closeModal={closeModal}
            />
            <LicenseCard 
              beat={modalBeat as BeatDocumentInterface}
              license={modalBeat?.licenses.exclusive as LicenseInterface} 
              licenseTerms={modalBeat?.licenseTerms.exclusive as LicenseTermsInterface}
              name={"Exclusive"} 
              format={"MP3 / WAV Format"} 
              closeModal={closeModal}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}