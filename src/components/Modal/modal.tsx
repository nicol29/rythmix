"use client";

import { useEffect } from "react";


export default function Modal({ 
  isModalOpen,
  closeModal,
  children
}: {
  isModalOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
}) {

  useEffect(() => {
    isModalOpen ? document.body.style.overflow = "hidden" : document.body.style.overflow = "scroll";

    return () => {
      document.body.style.overflow = "unset";
    }
  }, [isModalOpen]);

  
  return (
    <section onClick={closeModal} className={isModalOpen ? "flex justify-center items-center top-0 left-0 h-screen w-full bg-transparent-l-black fixed z-30" : "hidden"} aria-hidden={!isModalOpen}>
      <dialog open={isModalOpen} onClick={(e) => e.stopPropagation()} className="text-neutral-400 w-5/6 p-4 bg-neutral-800 rounded drop-shadow-lg sm:w-[400px]">
        {children}
      </dialog>
    </section>
  )
}