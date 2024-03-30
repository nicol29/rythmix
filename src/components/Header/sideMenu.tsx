import Image from "next/image";
import { CloseIcon, DashboardIcon, HomeIcon, PersonIcon, PianoIcon, SearchIcon, SettingsIcon } from "@/assets/icons";
import Link from "next/link";
import { Session } from "next-auth";


export default function SideMenu({ 
  menuToggled,
  manageSideMenu,
  session,
  authStatus
}: {
  menuToggled: boolean;
  manageSideMenu: () => void;
  session: Session | null;
  authStatus: string;
}) {
  return (
    <>
      <div onClick={() => manageSideMenu()} className={menuToggled ? "top-0 left-0 h-screen w-full bg-black opacity-45 absolute" : "hidden"}></div>
      <div className={menuToggled ? "h-screen w-5/6 absolute top-0 left-0 bg-neutral-850 border-r border-neutral-750 transition-all max-w-[300px]" : "h-screen w-5/6 absolute top-0 left-0 -translate-x-full bg-neutral-850 border-r border-neutral-750 transition-all max-w-[350px]"} aria-hidden={!menuToggled} aria-label="menu">
        <div className="h-14 border-b border-neutral-750 px-2 flex gap-3 items-center">
          <CloseIcon className="h-7 cursor-pointer text-neutral-400 flex-shrink-0" onClick={() => manageSideMenu()} />
          <Image
            src="/transparentRythmix.png"
            className="h-7 w-auto mt-1"
            alt="Rythmix Logo"
            width={1024}
            height={246}
          />
        </div>
        <div className="border-b border-neutral-750 py-4">
          <Link href="/" className="px-4 py-3 flex gap-4 items-center hover:bg-neutral-800">
            <HomeIcon className="h-6 w-6 text-neutral-400" />
            <span>Home</span>
          </Link>
          <Link href="/search?searchString=" className="px-4 py-3 flex gap-4 items-center hover:bg-neutral-800">
            <SearchIcon className="h-6 w-6 text-neutral-400" />
            <span>Search</span>
          </Link>
        </div>
        {authStatus !== "authenticated" ?
          <>
            <div className="border-b border-neutral-750 p-4 h-fit">
              <Link href="/login" className="bg-neutral-600 rounded flex py-2 justify-center font-semibold drop-shadow-lg text-neutral-300 hover:bg-neutral-500">Log In</Link>
            </div> 
            <div className="border-b border-neutral-750 p-4 h-fit">
              <Link href="/register" className="default-orange-button flex py-2 justify-center font-semibold drop-shadow-lg">Start Selling</Link>
            </div> 
          </> :
          <div className="border-b border-neutral-750 p-4 h-fit">
            <Link href="/upload" className="default-orange-button flex py-2 justify-center font-semibold drop-shadow-lg">+ Upload Track</Link>
          </div> 
        }
        {authStatus === "authenticated" &&
          <div className="py-4 flex flex-col gap-2">
            <span className="pl-4 text-lg text-neutral-300">Account</span>
            <div>
              <Link href={`/${session?.user.profileUrl}`} className="px-4 py-3 flex gap-4 items-center hover:bg-neutral-800">
                <PersonIcon className="h-6 w-6 text-neutral-400" />
                <span>Profile</span>
              </Link>
              <Link href="/tracks" className="px-4 py-3 flex gap-4 items-center hover:bg-neutral-800">
                <PianoIcon className="h-6 w-6 text-neutral-400" />
                <span>My Tracks</span>
              </Link>
              <Link href="/search?searchString=" className="px-4 py-3 flex gap-4 items-center hover:bg-neutral-800">
                <DashboardIcon className="h-6 w-6 text-neutral-400" />
                <span>Dashboard</span>
              </Link>
              <Link href="/settings/profile" className="px-4 text-orange-500 py-3 mt-6 flex gap-4 items-center hover:bg-neutral-700">
                <SettingsIcon className="h-6 w-6" />
                <span className="font-semibold">Edit Account</span>
              </Link>
            </div>
          </div>
        }
      </div>
    </>
  )
}