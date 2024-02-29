import connectMongoDB from "@/config/mongoDBConnection";
import Users from "@/models/Users";
import Beats from "@/models/Beats";
import BeatCard from "@/components/BeatCard/beatCard";
import Image from "next/image";
import returnProfilePicture from "@/utils/returnUserProfilePicture";
import { UserDocumentInterface } from "@/types/mongoDocTypes";
import { LocationIcon, ListensIcon } from "@/assets/icons";
import dayjs from "dayjs";
import Plays from "@/models/Plays";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Link from "next/link";


export default async function Profile({ params }: { params: { profileUrl: string } }) {
  const signedInUser = await getServerSession(authOptions);

  await connectMongoDB();
  
  const producer: UserDocumentInterface | null = await Users.findOne({ 
    profileUrl: params.profileUrl 
  }, { password: 0 });

  const beats = await Beats.find({
    "producer._id": producer?._id,
    "status": "published"
  });

  const totalPlays = await Plays.countDocuments({ producer: producer?._id });

  return (
    <main className="min-h-screen px-4 my-14 flex justify-center pt-14">
      <div>
        <section className="w-full flex flex-col items-center mb-12 lg:flex-row lg:gap-6 lg:items-start lg:mb-14">
          <div className="relative w-5/12 aspect-square lg:max-w-[200px]">
            <Image className="object-cover rounded border border-neutral-750" fill sizes="w-full h-full" src={returnProfilePicture(producer?.profilePicture)} alt="Track art" />
          </div>
          <div className="w-full flex flex-col items-center lg:items-start lg:h-[200px] lg:relative">
            <div className="flex flex-col items-center lg:flex-row lg:gap-7">
              <h1 className="text-3xl font-medium mt-2 text-neutral-400 lg:mt-0">{producer?.userName}</h1>
              <div className="flex items-center gap-1 text-neutral-500">
                <LocationIcon className="w-4 h-4" />
                <span>{"Unknown"}</span>
              </div>
            </div>
            <div className="flex gap-4 mt-8 mb-3 lg:mt-3 lg:mb-0">
              <span className="cursor-pointer">{0} followers</span>
              <span className="cursor-pointer">{0} following</span>
            </div>
            { signedInUser?.user ?
              <Link href="/" className="default-orange-button text-center w-5/6 py-1 lg:w-[150px] lg:absolute lg:top-0 lg:right-0">Edit Profile</Link> :
              <button className="default-orange-button w-5/6 py-1 lg:w-[150px] lg:absolute lg:top-0 lg:right-0">Follow</button>
            }
            <div className="flex flex-col items-center mt-8 lg:flex-row lg:justify-between lg:w-full lg:mt-auto">
              <span className="flex items-center gap-1"><ListensIcon className="h-5 w-5" />{totalPlays} plays</span>
              <span className="text-neutral-500 text-sm mt-12 lg:mt-0">Member since: {dayjs(producer?.createdAt).format('DD MMM YYYY')}</span>
            </div>
          </div>
        </section>
        <div>
          <h2 className="text-xl mb-2">Tracks</h2>
          <div className="border-t border-neutral-700 pt-4 grid gap-2 grid-cols-2 lg:grid-cols-3 lg:gap-4">
            { beats.map(beat => (
                <BeatCard key={beat.id} beatList={JSON.parse(JSON.stringify(beats))} beat={JSON.parse(JSON.stringify(beat))} option={"simple"} />
            )) }
          </div>
        </div>
      </div>
    </main>
  )
}