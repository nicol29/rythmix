import connectMongoDB from "@/config/mongoDBConnection";
import Header from "@/components/Header/header";
import Users from "@/models/Users";
import Beats from "@/models/Beats";
import BeatCard from "@/components/BeatCard/beatCard";
import Image from "next/image";
import returnProfilePicture from "@/utils/returnUserProfilePicture";


export default async function Profile({ params }: { params: { profileUrl: string } }) {
  await connectMongoDB();
  
  const producer = await Users.findOne({ 
    profileUrl: params.profileUrl 
  }, { password: 0 });

  const beats = await Beats.find({
    "producer._id": producer._id
  });

  return (
    <>
      <Header />
      <main className="min-h-screen mt-14 flex justify-center pt-14">
        <div className="h-[600px] w-[300px] bg-neutral-850 p-4 rounded">
          <div className="relative w-full aspect-square">
            <Image className="object-cover rounded border border-neutral-750" fill sizes="w-full h-full" src={returnProfilePicture(producer.profilePicture)} alt="Track art" />
          </div>
          <h1>{producer.userName}</h1>
        </div>
        <div className="px-16">
          <h2 className="text-2xl">Tracks</h2>
          <div className="grid gap-4 grid-cols-3 bg-neutral-850 p-4 rounded">
            { beats.map(beat => (
                <BeatCard key={beat.id} beatList={JSON.parse(JSON.stringify(beats))} beat={JSON.parse(JSON.stringify(beat))} option={"simple"} />
            )) }
          </div>
        </div>
      </main>
    </>
  )
}