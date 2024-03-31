import { CheckMarkIcon } from "@/assets/icons";
import Stripe from "stripe";
import Image from "next/image";
import Customer_Orders from "@/models/CustomerOrders";
import uniqid from "uniqid";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import EmptyCartOnClient from "./emptyCartOnClient";
import { Metadata } from 'next';
import Header from "@/components/Header/header";

export const metadata: Metadata = {
  title: "Your Order | Rythmix",
}

const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`);


export default async function OrderConfirmation({ 
  searchParams 
}: { 
  searchParams: { 
    payment_intent: string;
    payment_intent_client_secret: string;
    redirect_status: string;
  }
}) {
  const signedInUser = await getServerSession(authOptions);

  const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.retrieve(searchParams.payment_intent);
  const paymentMethod: Stripe.PaymentMethod = await stripe.paymentMethods.retrieve(paymentIntent.payment_method);

  const customerOrder = await Customer_Orders.findOne({ transferGroup: paymentIntent.transfer_group })
  .select(['customerDetails', 'items'])
  .populate({
    path: 'items.productId',
    select: 'assets title'
  });

  const customerID = customerOrder.customerDetails.customerId.toString();
  
  if (customerID !== signedInUser?.user.id) redirect("/");

  const { items } = customerOrder;

  const returnTotal = () => {
    return items.reduce((acc: any, item: any) => acc + (item.price / 100), 0);
  }


  return (
    <>
      <Header />
      <main className="min-h-screen pt-14">
        <section className="bg-neutral-925 drop-shadow flex justify-center items-center py-10 lg:py-0 lg:h-[200px]">
          <h1 className="text-3xl mb-2">Order Confirmation</h1>
        </section>
        {paymentIntent.status === "succeeded" &&
          <>
            <section className="drop-shadow flex flex-col bg-neutral-800 border border-neutral-700 w-11/12 mx-auto rounded my-12 lg:flex-row lg:justify-center lg:items-center lg:w-fit">
              <div className="px-4 py-6 flex flex-col gap-6 lg:px-12">
                <div className="flex gap-2 items-center">
                  <CheckMarkIcon className="h-10 w-10 text-green-400" />
                  <span className="text-xl">Thank you {paymentMethod.billing_details.name}</span>
                </div>
                <div className="w-full h-[1px] bg-neutral-700"></div>
                <div>
                  <h2 className="font-semibold text-lg mb-2">Your order has been confirmed</h2>
                  <p className="text-neutral-400">{`We've accepted your order, find your files attached below`}</p>
                </div>
                <div className="w-full h-[1px] bg-neutral-700"></div>
                <div>
                  <h2 className="font-semibold text-lg mb-2">Customer Information</h2>
                  <div className="flex gap-12">
                    <div className="flex-1">
                      <span className="font-semibold">Billing address</span>
                      <address className="flex flex-col text-neutral-400">
                        {paymentMethod.billing_details.address?.line1 && <span>{paymentMethod.billing_details.address.line1}</span> }
                        {paymentMethod.billing_details.address?.line2 && <span>{paymentMethod.billing_details.address.line2}</span> }
                        {paymentMethod.billing_details.address?.city && <span>{paymentMethod.billing_details.address.city}</span> }
                        {paymentMethod.billing_details.address?.state && <span>{paymentMethod.billing_details.address.state}</span> }
                        {paymentMethod.billing_details.address?.postal_code && <span>{paymentMethod.billing_details.address.postal_code}</span> }
                        {paymentMethod.billing_details.address?.country && <span>{paymentMethod.billing_details.address.country}</span> }
                      </address>
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="font-semibold">Payment Method</span>
                      <span className="text-neutral-400">{paymentMethod.type}</span>
                    </div>
                  </div>
                </div>
                <div className="w-full h-[1px] bg-neutral-700"></div>
                <div>
                  <h2 className="font-semibold text-lg mb-2">Files</h2>
                  <div className="flex flex-col gap-4">
                    {items.map((item: any, index: any) => (
                      <>
                        <div key={item.productId.toString()} className="flex flex-col gap-2">
                          <span>{item.productId.title}</span>
                          <div className="flex items-center gap-2">
                            <div className="relative w-16 aspect-square self-center flex-shrink-0">
                              <Image className="object-cover rounded border border-neutral-750" fill sizes="w-full h-full" src={item.productId.assets.artwork.url} alt="Track art" />
                            </div>
                            <div className="flex-1 h-16 flex flex-col justify-between">
                              <div className="grid grid-cols-3 gap-6 mt-auto">
                                <div className="flex flex-col">
                                  <span>MP3</span>
                                  <a href={`${item.productId.assets.mp3.url.replace('/upload/', '/upload/fl_attachment/')}`} aria-label="Download mp3 file" download data-disable-nprogress={true} className="max-w-[100px] bg-orange-500 text-center text-white rounded text-sm">Download</a>
                                </div>
                                {item.licenseType !== "basic" &&
                                  <div className="flex flex-col">
                                    <span>WAV</span>
                                    <a href={`${item.productId.assets.wav.url.replace('/upload/', '/upload/fl_attachment/')}`} aria-label="Download wav file" download data-disable-nprogress={true} className="max-w-[100px] bg-orange-500 text-center text-white rounded text-sm">Download</a>
                                  </div>
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                        {(items.length - 1) !== index && <div className="w-full h-[1px] bg-neutral-700"></div>}
                      </>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-neutral-850 px-4 py-6 drop-shadow-xl rounded-r lg:px-12 lg:self-stretch lg:min-w-[400px]">
                <div className="border-b border-neutral-700 pb-2">
                  <h2 className="text-lg">Summary</h2>
                </div>
                <div className="py-4 flex flex-col gap-4">
                  {items.map((item: any) => (
                    <div key={uniqid()} className="flex items-center gap-2">
                      <div className="relative w-14 aspect-square self-center flex-shrink-0">
                        <Image className="object-cover rounded border border-neutral-750" fill sizes="w-full h-full" src={item.productId.assets.artwork.url} alt="Track art" />
                      </div>
                      <div className="truncate overflow-hidden flex-1">
                        <span>{item.productId.title}</span>
                        <div className="flex justify-between mt-2">
                          <span className="text-neutral-500 text-sm">{item.licenseType} License</span>
                          <span className="font-semibold">€ {item.price / 100}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between border-t pt-4 text-neutral-400 text-sm border-neutral-700">
                  <span className="flex items-center gap-2">Platform Fee</span>
                  <span>€ {Math.round(returnTotal() * 1.8) / 100}</span>
                </div>
                <div className="flex justify-between text-neutral-400 text-sm mt-1">
                  <span className="flex items-center gap-2">Transaction Fee</span>
                  <span>€ {Math.round(returnTotal() * 3.2) / 100}</span>
                </div>
                <div className="flex justify-between border-tpt-2 my-4 font-bold">
                  <span>Total ({items.length} items)</span>
                  <span>€ {(Math.round(returnTotal() * 5) / 100) + returnTotal()}</span>
                </div>
              </div>
            </section>
            <EmptyCartOnClient />
          </>
        }
      </main>
    </>
  )
}