import connectMongoDB from "@/config/mongoDBConnection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Users from "@/models/Users";
import SettingsSideNavBar from "../settingsSideNavBar";
import LicenseSettingsForm from "./licenseSettingsForm";
import { UserDocumentInterface } from "@/types/mongoDocTypes";


export default async function LicenseSettings() {
  const signedInUser = await getServerSession(authOptions);

  await connectMongoDB();
  const userFromDB: UserDocumentInterface | null = await Users.findOne({ _id: signedInUser?.user.id });
  const userFromDBJSON = JSON.parse(JSON.stringify(userFromDB));

  
  return (
    <main className="min-h-screen pt-14">
      <section className="relative bg-neutral-925 drop-shadow flex justify-center items-center py-10 lg:py-0 lg:h-[200px]">
        <div className="w-5/6 lg:full">
          <h1 className="text-3xl">Account Settings</h1>
        </div>
      </section>
      <section className="py-10 flex justify-center">
        <div className="w-5/6 flex flex-col gap-10 sm:max-w-[1300px] lg:max-w-[500px]">
          <SettingsSideNavBar activeRoute="licenses" />
          <LicenseSettingsForm 
            licenseName="Basic"
            licenseTerms={userFromDBJSON?.licenseTerms.basic} 
            userId={signedInUser?.user.id}
          /> 
          <div className="border-t border-neutral-700"></div>
          <LicenseSettingsForm 
            licenseName="Premium"
            licenseTerms={userFromDBJSON?.licenseTerms.premium} 
            userId={signedInUser?.user.id}
          />
          <div className="border-t border-neutral-700"></div>
          <LicenseSettingsForm 
            licenseName="Exclusive"
            licenseTerms={userFromDBJSON?.licenseTerms.exclusive} 
            userId={signedInUser?.user.id}
          />
        </div>
      </section>
    </main>
  )
}