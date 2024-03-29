"use client";

import { toast } from "sonner";
import { TrolleyIcon } from "@/assets/icons";


export default function PurchaseButton() {
  return (
    <button 
      onClick={() => toast.error("Select a license type below")} 
      aria-label="Purchase beat" 
      className="default-orange-button w-5/6 h-9 flex gap-3 items-center justify-center justify-self-center self-center mx-auto mb-5 sm:row-start-1 sm:col-start-4 sm:w-[115px] sm:mb-auto sm:mr-0"
    >
      <p>Purchase</p>
      <TrolleyIcon className="h-5 w-5 " />
    </button>
  )
}