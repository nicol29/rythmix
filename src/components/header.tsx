"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { MenuIcon, SearchIcon, CloseIcon, AccountCircleIcon, LogOutIcon } from "@/assets/icons"
import Image from "next/image";
import Link from "next/link";
import returnProfilePicture from "@/utils/returnUserProfilePicture";


export default function Header() {
  const [isMenuToggled, setIsMenuToggled] = useState(false);
  const [isSearchToggled, setIsSearchToggled] = useState(false);
  const [isProfileToggled, setIsProfileToggled] = useState(false);

  const { data: session, status } = useSession();


  return (
    <header className="bg-neutral-850 fixed top-0 w-full">
      <div className="px-2 h-14 flex gap-3 items-center border-b border-neutral-750 relative">
        <MenuIcon className="text-neutral-400 h-7" onClick={() => setIsMenuToggled(!isMenuToggled)}/>
        <button className="block sm:hidden" onClick={() => setIsSearchToggled(!isSearchToggled)} aria-label="Open searchbar">
          <SearchIcon className="text-neutral-400 h-6"/>
        </button>
        <div className={isSearchToggled ? "bg-neutral-800 w-screen absolute top-full left-0 mt-px h-12 flex justify-center items-center sm:static sm:w-auto sm:h-auto sm:bg-neutral-850" : "hidden sm:block sm:static sm:w-auto sm:h-auto sm:bg-neutral-850"}>
          <div className="w-4/5 rounded-full bg-neutral-750 h-9 border border-neutral-600 flex items-center justify-between px-3 sm:w-[350px]">
            <input type="text" placeholder="Search" className="bg-transparent outline-none w-5/6"/>
            <SearchIcon className="text-neutral-400 h-6" />
          </div>
          <CloseIcon className="h-5 w-5 absolute right-3 text-neutral-500 sm:hidden" onClick={() => setIsSearchToggled(!isSearchToggled)}/>
        </div>
        <div className="ml-auto">
          { status === "authenticated" ?
            <>
              <div className="relative h-7 w-7">
                <Image className="rounded-full object-cover h-full w-full" src={returnProfilePicture(session.user.image)} width={28} height={28} alt="User profile picture" onClick={() => setIsProfileToggled(!isProfileToggled)}/>
              </div>
              <div className={isProfileToggled ? "absolute bg-neutral-850 border rounded border-neutral-750 right-1.5 px-2 mt-1" : "hidden"}>
                <p className="text-orange-500 font-semibold">{session.user.userName}</p>
                <div className="text-orange-500 flex items-center" onClick={() => signOut()}>
                  <LogOutIcon className="h-5" />
                  Log Out
                </div>
              </div>
            </> :
            <>
              <AccountCircleIcon className="text-neutral-400 h-7" onClick={() => {setIsProfileToggled(!isProfileToggled)}}/>
              <div className={isProfileToggled ? "absolute bg-neutral-850 border rounded border-neutral-750 right-1.5 px-2 mt-1 flex flex-col" : "hidden"}>
                <Link href="/login">Log In</Link>
                <Link href="/register">Register</Link>
              </div>
          </>
          }
        </div>
        <div className={isMenuToggled ? "h-screen w-5/6 absolute top-0 left-0 bg-neutral-850 border-r border-neutral-750 transition-all sm:w-[350px]" : "h-screen w-5/6 absolute top-0 left-0 -translate-x-full bg-neutral-850 border-r border-neutral-750 transition-all sm:w-[350px]"} aria-hidden={!isMenuToggled} aria-label="menu">
          <CloseIcon className="h-6" onClick={() => setIsMenuToggled(!isMenuToggled)} />
        </div>
      </div>
    </header>
  )
}