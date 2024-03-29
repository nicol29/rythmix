import connectMongoDB from "@/config/mongoDBConnection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Users from "@/models/Users";
import SettingsSideNavBar from "../settingsSideNavBar";
import { UserDocumentInterface } from "@/types/mongoDocTypes";
import Image from "next/image";
import { Metadata } from 'next';
import Header from "@/components/Header/header";
import StripeOnboardSection from "./stripeOnboardSection";

export const metadata: Metadata = {
  title: "Payout settings | Rythmix",
}


export default async function PayoutSettings() {
  const signedInUser = await getServerSession(authOptions);

  await connectMongoDB();
  const userFromDB = await Users.findOne({ _id: signedInUser?.user.id });
  const userFromDBJSON: UserDocumentInterface = JSON.parse(JSON.stringify(userFromDB));
  
  return (
    <>
      <Header />
      <main className="min-h-screen pt-14">
        <section className="relative bg-neutral-925 drop-shadow flex justify-center items-center py-10 lg:py-0 lg:h-[200px]">
          <div className="w-5/6 lg:full">
            <h1 className="text-3xl">Account Settings</h1>
          </div>
        </section>
        <section className="py-10 flex justify-center">
          <div className="w-5/6 flex flex-col gap-10 sm:max-w-[1300px] lg:max-w-[600px]">
            <SettingsSideNavBar activeRoute="payouts" />
            <div>
              <h2 className="text-xl mb-12">Payout Methods</h2>
              <div className="flex flex-col justify-between gap-6 sm:flex-row">
                <div className="relative h-28 aspect-square bg-neutral-800 rounded">
                  <Image 
                    src="/stripe-logo.jpeg" 
                    priority 
                    fill 
                    sizes="w-full h-full" 
                    className="h-full w-full object-cover rounded" 
                    alt="User uploaded image"
                  />
                </div>
                <div>
                  <StripeOnboardSection onBoardStatus={userFromDBJSON.stripeDetails.onBoardStatus} />
                  <p className="mt-4 text-neutral-400">To sell your beats on Rythmix and receive payments securely, you need to set up your payout information through Stripe, our payment processing partner.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}