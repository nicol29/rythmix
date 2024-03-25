"use client";

import { CartItemsContext } from "@/context/cartItemsContext";
import { useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CloseIcon, CartIcon, Spinner } from "@/assets/icons";
import returnProfilePicture from "@/utils/returnUserProfilePicture";
import { CartItemInterface } from "@/types/mongoDocTypes";
import StripeCustomCheckout from "./stripeCustomCheckout";
import { createCheckoutSession } from "@/server-actions/stripe";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import InfoIcon from "@/components/InfoIcon/infoIcon";

const stripePromise = loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`);


export default function CartSection() {
  const { cartItems, deleteItemFromCart } = useContext(CartItemsContext);
  const [clientSecret, setClientSecret] = useState("");
  const [payNow, setPayNow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { status: signedInStatus } = useSession();

  const appearance = {
    theme: 'flat',
    variables: {
      colorPrimary: '#f97316',
      colorBackground: '#3c3c3c',
      colorText: '#d4d4d4',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  const returnFormats = (item: CartItemInterface) => {
    return item.chosenLicense.licenseType === "basic" ? "- MP3 Format" : "- MP3/WAV Format";
  }

  const returnTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.chosenLicense.licensePrice, 0);
  }

  const createPaymentIntent = async () => {
    setLoading(true);

    if (signedInStatus === "authenticated") {
      const items = cartItems.map(item => {
        return {
          beatId: item._id.toString(),
          chosenLicense: item.chosenLicense.licenseType
        }
      });
  
      const res = await createCheckoutSession(JSON.parse(JSON.stringify(items))); 
      setLoading(false);
      setClientSecret(res?.clientSecret);
  
      setPayNow(true);
    } else {
      toast.error("You must be signed in to complete this transaction");
    }
  }

  return (
    <section className="py-10 lg:flex lg:justify-center lg:py-16">
      <div className="flex flex-col items-center gap-10 lg:flex-row lg:w-full lg:max-w-[1250px] lg:px-6 lg:gap-24 lg:justify-between">
        <div className="w-11/12 self-start mx-auto lg:flex-grow">
          <span className="text-lg">Items ({cartItems.length})</span>
          { cartItems.length !== 0 ?
            ( cartItems.map(item => (
              <div key={item._id.toString()} className="flex items-center gap-2 lg:gap-12">
                <div className="flex gap-2 py-3 pl-2 flex-1 lg:gap-6">
                  <Link href={`/beat/${item.urlIdentifier}`} className="relative w-16 aspect-square self-start flex-shrink-0 lg:w-24">
                    <Image className="object-cover rounded border border-neutral-750" fill sizes="w-full h-full" src={returnProfilePicture(item.assets.artwork.url)} alt="Track art" />
                  </Link>
                  <div className="flex flex-col flex-1">
                    <Link href={`/beat/${item.urlIdentifier}`}>{item.title}</Link>
                    <span className="text-neutral-500 text-sm lg:mt-1">{item.chosenLicense.licenseType} License {returnFormats(item)}</span>
                    <div className="flex justify-between mt-2 lg:mt-auto">
                      <span className="text-orange-500 font-semibold text-sm">Review license terms</span>
                      <span className="text-orange-500 font-semibold">€ {item.chosenLicense.licensePrice}</span>
                    </div>
                  </div>
                </div>
                <CloseIcon onClick={() => deleteItemFromCart(item)} className="h-6 w-6 cursor-pointer flex-shrink-0" />
              </div>
            ))) :
            <div className="mt-16 flex flex-col items-center justify-center">
              <CartIcon className="w-24 h-24 text-neutral-600" />
              <span className="text-neutral-400 text-xl mt-2">Cart Empty</span>
              <span className="text-neutral-500">Items added to cart will be shown here</span>
            </div>
          } 
        </div>
        <div className="bg-neutral-800 border rounded border-neutral-700 w-11/12 p-4 lg:w-[400px]">
          <div className="border-b border-neutral-700 pb-2">
            <h2 className="text-lg">Cart Summary</h2>
          </div>
          <div className="py-4 flex flex-col gap-4">
            { cartItems.map(item => (
              <div key={item._id.toString()} className="flex items-center gap-2">
                <div className="relative w-14 aspect-square self-center flex-shrink-0">
                  <Image className="object-cover rounded border border-neutral-750" fill sizes="w-full h-full" src={returnProfilePicture(item.assets.artwork.url)} alt="Track art" />
                </div>
                <div className="truncate overflow-hidden flex-1">
                  <span>{item.title}</span>
                  <div className="flex justify-between mt-2">
                    <span className="text-neutral-500 text-sm">{item.chosenLicense.licenseType} License</span>
                    <span className="font-semibold">€ {item.chosenLicense.licensePrice}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between border-t pt-4 text-neutral-400 text-sm border-neutral-700">
            <span className="flex items-center gap-2">Platform Fee <InfoIcon dialogueText="This fee contributes to the maintenance and continuous improvement of the Rythmix platform, ensuring high-quality service and user experience." /></span>
            <span>€ {Math.round(returnTotal() * 1.8) / 100}</span>
          </div>
          <div className="flex justify-between text-neutral-400 text-sm mt-1">
            <span className="flex items-center gap-2">Transaction Fee <InfoIcon dialogueText="This fee covers the costs associated with secure payment processing, safeguarding your financial transactions." /></span>
            <span>€ {Math.round(returnTotal() * 3.2) / 100}</span>
          </div>
          <div className="flex justify-between border-tpt-2 mt-4 mb-8 font-bold">
            <span>Total ({cartItems.length} items)</span>
            <span>€ {(Math.round(returnTotal() * 5) / 100) + returnTotal()}</span>
          </div>
          {payNow ?
            (clientSecret && (
              <Elements options={options as any} stripe={stripePromise}>
                <StripeCustomCheckout />
              </Elements>
            )) :
            <button 
              disabled={loading}
              onClick={createPaymentIntent} 
              className={`default-orange-button font-semibold w-full py-2 rounded drop-shadow mt-4 ${loading && `hover:bg-orange-200 bg-orange-200 py-0`}`}
            >{loading ? <Spinner className="w-10 h-10" /> : "Proceed to Payment"}</button>
          }
        </div>
      </div>
    </section>
  )
}