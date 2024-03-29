"use client";

import { onBoardUser } from "@/server-actions/stripe";
import { CheckMarkIcon } from "@/assets/icons";
import { useState } from "react";


export default function StripeOnboardSection({ 
  onBoardStatus
}: {
  onBoardStatus: string
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleForm = async () => {
    await onBoardUser();
    setIsLoading(true);
  }

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between">
      <h3 className="text-xl">Connect Stripe Account</h3>
      { onBoardStatus === "complete" ?
        <span className="text-stripe-purple font-medium flex items-center gap-2">
          Connected
          <CheckMarkIcon className="h-5 w-5" />
        </span> :
        <form action={handleForm}>
          <button aria-label="Onboard Stripe" disabled={isLoading} className={`bg-stripe-purple text-sm text-white self-end px-3 py-1 rounded ${isLoading && `bg-stripe-light-purple`}`}>
            {isLoading ?
              "Processing":
              ( onBoardStatus === "unstarted" ? "Connect Stripe" : "Finish Connecting Stripe" )
            }
          </button>
        </form>
      }
    </div>
  )
}