"use client";

import { toast } from "sonner";


export default function WorkInProgressPrompt() {
  return (
    <button 
      onClick={() => toast.error("Following others is not currently supported")} 
      className="default-orange-button w-5/6 py-1 lg:w-[150px] lg:absolute lg:top-0 lg:right-0"
    >Follow</button>
  )
}