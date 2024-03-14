"use client";

import { LicenseInterface } from "@/types/mongoDocTypes";
import { TrolleyIcon, CloseIcon, CopyIcon, GenreIcon, VideoCamIcon, RadioIcon, MicrophoneIcon } from "@/assets/icons";
import Modal from "@/components/Modal/modal";
import { useState } from "react";
import { LicenseTermsInterface } from "@/types/mongoDocTypes";


export default function LicenseCard({ 
  license, 
  licenseTerms,
  name, 
  format 
}: { 
  license: LicenseInterface; 
  licenseTerms: LicenseTermsInterface;
  name: "Basic" | "Premium" | "Exclusive"; 
  format: string 
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);


  if (license.selected) {
    return (
      <>
        <div className="flex justify-between w-full">
          <div>
            <p className="text-base">{name}</p>
            <p className="font-light text-sm italic text-neutral-400">{format}</p>
            <p className="text-base mt-2">€ {license.price}</p>
          </div>
          <div className="flex items-end gap-3">
            <p onClick={() => setIsModalOpen(true)} className="text-sm font-semibold text-orange-500 cursor-pointer">View license terms</p>
            <button className="default-orange-button w-11 h-11 flex items-center justify-center">
              <TrolleyIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="h-[1px] w-full bg-neutral-700 my-4"></div>
        <Modal
          isModalOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          styles="w-fit"
        >
          <div className="text-base">
            <div className="flex justify-between items-center border-b border-neutral-700 pb-2 mb-4">
              <h3 className="text-2xl">{name} License Terms</h3>
              <CloseIcon onClick={() => setIsModalOpen(false)} className="h-5 w-5 cursor-pointer" />
            </div>
            <div className="flex flex-col gap-4 pt-2 sm:gap-20 sm:flex-row">
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex items-center gap-2"><CopyIcon className="h-5 w-5 text-neutral-500"/>{licenseTerms.distributionCopies} Distribution Copies</div>
                <div className="flex items-center gap-2"><GenreIcon className="h-5 w-5 text-neutral-500"/>{licenseTerms.audioStreams} Audio Streams</div>
                <div className="flex items-center gap-2"><VideoCamIcon className="h-5 w-5 text-neutral-500"/>{licenseTerms.musicVideos} Music Videos</div>
              </div>
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex items-center gap-2"><RadioIcon className="h-5 w-5 text-neutral-500"/>{licenseTerms.radioStations} Radio Stations</div>
                <div className="flex items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis">
                  <MicrophoneIcon className="h-5 w-5 text-neutral-500"/>{licenseTerms.allowProfitPerformances}
                  {licenseTerms.allowProfitPerformances ? "Profit live performances allowed" : "Non-profit live performances only"}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </>
    )
  }
}