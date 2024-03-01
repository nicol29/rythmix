"use client";

import { BeatDocumentInterface } from "@/types/mongoDocTypes";
import TrackCard from "./trackCard";
import Modal from "@/components/Modal/modal";
import { useState } from "react";
import { CloseIcon } from "@/assets/icons";
import { removeBeatAndViews } from "@/server-actions/removeBeat";
import { toast } from "sonner";
import { usePathname } from "next/navigation";


export default function RenderTracks({ 
  userPublishedBeats 
}: { 
  userPublishedBeats: BeatDocumentInterface[];
}) {
  const [isDeleteModalActive, setIsDeleteModalActive] = useState<{ 
    beat: BeatDocumentInterface | null; 
    isOpen: boolean;
  }>({
    beat: null,
    isOpen: false
  });
  const pathname = usePathname();

  const openModal = (beat: BeatDocumentInterface) => {
    setIsDeleteModalActive({
      beat: beat,
      isOpen: true
    });
  }

  const closeModal = () => {
    setIsDeleteModalActive({
      beat: null,
      isOpen: false
    });
  }

  const deleteSelectedBeat = async () => {
    const selectedBeatId = isDeleteModalActive.beat?._id.toString();
    let res;

    if (selectedBeatId) res = await removeBeatAndViews(selectedBeatId, pathname);

    if (res?.success) {
      toast.success(res.message);
    } else if (!res?.success) {
      toast.error(res?.message);
    }

    closeModal();
  } 

  return(
    <>
      <ul className="w-5/6 flex flex-col gap-2 sm:max-w-[1200px]">
        { userPublishedBeats.map((beat, index) => 
          <TrackCard 
            key={beat._id.toString()} 
            index={index}
            beat={JSON.parse(JSON.stringify(beat))} 
            openModal={openModal}
          />
        )}
      </ul>
      { userPublishedBeats.length === 0 &&
          <span className="mt-16 text-neutral-500 font-medium text-lg">{`It's empty in here, start by uploading some tracks`}</span>
      }
      <Modal 
        isModalOpen={isDeleteModalActive.isOpen}
        closeModal={closeModal}
      >
        <div>
          <div className="flex justify-between items-center border-b border-neutral-700 pb-2 mb-4">
            <h3 className="text-2xl">Delete Forever?</h3>
            <CloseIcon onClick={closeModal} className="h-5 w-5 cursor-pointer" />
          </div>
          <p>Are you sure you want to delete this track?</p>
          <br />
          <p>This action cannot be undone and all related files will be lost.</p>
          <div className="flex gap-4 mt-10">
            <button onClick={deleteSelectedBeat} className="flex-1 py-2 rounded bg-red-500 text-white">Yes, Delete</button>
            <button onClick={closeModal} className="flex-1 py-2 rounded bg-neutral-500 text-white">Cancel</button>
          </div>
        </div>
      </Modal>
    </>
  )
}