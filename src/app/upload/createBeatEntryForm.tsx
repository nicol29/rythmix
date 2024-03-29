"use client";

import addBeatEntry from "@/server-actions/addBeatEntry";
import { useState } from "react";


export default function CreateBeatEntryForm({
  onBoardStatus
}: {
  onBoardStatus: string;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleForm = async () => {
    await addBeatEntry();
    setIsLoading(true);
  }

  return (
    <form action={handleForm} className="w-full mt-auto">
      <button 
        disabled={onBoardStatus !== "complete"} 
        className={`w-full default-orange-button py-1 ${isLoading && `bg-orange-400`} ${onBoardStatus !== "complete" && "opacity-20 hover:bg-orange-500"}`}
      >{isLoading ? `Processing`: `Upload Beat`}</button>
    </form>
  )
}