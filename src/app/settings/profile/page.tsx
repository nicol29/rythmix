import connectMongoDB from "@/config/mongoDBConnection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Users from "@/models/Users";
import SettingsSideNavBar from "../settingsSideNavBar";
import ProfileSettingsForm from "./profileSettingsForm";


export default async function ProfileSettings() {
  const signedInUser = await getServerSession(authOptions);

  await connectMongoDB();
  const userFromDB = await Users.findOne({ _id: signedInUser?.user.id });

  
  return (
    <main className="min-h-screen pt-14">
      <section className="relative bg-neutral-925 drop-shadow flex justify-center items-center py-10 lg:py-0 lg:h-[200px]">
        <div className="w-5/6 sm:max-w-[1300px]">
          <h1 className="text-3xl">Account Settings</h1>
        </div>
      </section>
      <section className="py-10 flex justify-center">
        <div className="w-5/6 flex flex-col gap-20 sm:max-w-[1300px] lg:max-w-[500px] ">
          <SettingsSideNavBar activeRoute="profile" />
          <ProfileSettingsForm 
            profileSettings={{
              userName: signedInUser?.user.userName,
              profileUrl: signedInUser?.user.profileUrl,
              biography: userFromDB?.biography,
              country: userFromDB?.country,
            }} 
          />
        </div>
      </section>
    </main>
  )
}