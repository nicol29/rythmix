"use client";

import { useState, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { MenuIcon, SearchIcon, CloseIcon, AccountCircleIcon, LogOutIcon, CartIcon, ExpandIcon, RegisterIcon, LogInIcon } from "@/assets/icons"
import Image from "next/image";
import Link from "next/link";
import returnProfilePicture from "@/utils/returnUserProfilePicture";
import useDetectOutsideClick from "@/hooks/useDetectOutsideClick";
import { useRouter, usePathname } from "next/navigation";


export default function Header() {
  const { data: session, status } = useSession();

  const router = useRouter();
  const path = usePathname();

  const [activeDropDown, setActiveDropdown] = useState<"profile" | "cart" | null>(null);
  const [menuToggled,setMenuToggled] = useState(false);
  const [searchToggled, setSearchToggled] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);

  useDetectOutsideClick([cartRef, profileRef], () => setActiveDropdown(null));

  const manageDropDowns = (toggleActive: "profile" | "cart") => {
    activeDropDown === toggleActive ? setActiveDropdown(null) : setActiveDropdown(toggleActive);
  }

  const manageSideMenu = () => {
    menuToggled ? document.body.style.overflow = "scroll" : document.body.style.overflow = "hidden";
    setMenuToggled(!menuToggled);
  }

  const changeToHomePage = () => {
    if (path !== "/") router.push("/");
  }

  return (
    <header className="bg-neutral-850 fixed top-0 w-full z-20">
      <div className="px-2 h-14 flex gap-3 items-center border-b border-neutral-750 relative sm:gap-6">
        <MenuIcon className="text-neutral-400 h-7 cursor-pointer" onClick={() => manageSideMenu()} data-testid="menu-icon"/>
        <img className="h-6 mt-1 cursor-pointer" src="/transparentRythmix.png" onClick={() => changeToHomePage()} />
        <button className="block sm:hidden" onClick={() => setSearchToggled(!searchToggled)} aria-label="Open searchbar">
          <SearchIcon className="text-neutral-400 h-6"/>
        </button>
        <div className={searchToggled ? "bg-neutral-800 w-screen absolute top-full left-0 mt-px h-12 flex justify-center items-center sm:static sm:w-auto sm:h-auto sm:bg-neutral-850" : "hidden sm:block sm:static sm:w-auto sm:h-auto sm:bg-neutral-850"}>
          <form className="w-4/5 rounded-full bg-neutral-750 h-9 border border-neutral-600 flex items-center justify-between px-3 sm:w-[300px] md:w-[400px]">
            <input type="text" placeholder="Search" className="bg-transparent outline-none w-5/6"/>
            <button>
              <SearchIcon className="text-neutral-400 h-6 cursor-pointer" />
            </button>
          </form>
          <CloseIcon className="h-5 w-5 absolute right-3 text-neutral-500 cursor-pointer sm:hidden" onClick={() => setSearchToggled(!searchToggled)}/>
        </div>
        <div ref={profileRef} className="ml-auto relative">
          { status === "authenticated" ?
            <>
              <div className="flex items-center cursor-pointer gap-1" onClick={() => manageDropDowns("profile")}>
                <div className="relative h-6 w-6">
                  <Image className="rounded-full object-cover" src={returnProfilePicture(session.user.image)} priority fill sizes="w-full h-full" alt="User profile picture" />
                </div>
                <ExpandIcon className={activeDropDown === "profile" ? "text-neutral-400 h-5 rotate-180 transition" : "text-neutral-400 h-5 transition"} />
              </div>
              <div className={activeDropDown === "profile" ? "absolute bg-neutral-850 border rounded border-neutral-750 min-w-[250px] right-1 p-2 mt-1" : "hidden"} aria-hidden={activeDropDown === "profile"} aria-label="profile menu">
                <div className="flex gap-3 border-b border-neutral-750 pb-2 mb-2">
                  <div className="relative w-9 h-9 self-center">
                    <Image className="rounded-full object-cover" src={returnProfilePicture(session.user.image)} priority fill sizes="w-full h-full" alt="User profile picture" />
                  </div>
                  <div>
                    <div className="text-orange-500 font-semibold">{session.user.userName}</div>
                    <div className="font-light text-sm">{session.user.email}</div>
                  </div>
                </div>
                <button className="text-orange-500 flex gap-1 items-center w-fit font-semibold" onClick={() => signOut()}>
                  <LogOutIcon className="h-5" />
                  Log Out
                </button>
              </div>
            </> :
            <>
              <div className="flex items-center cursor-pointer gap-1" onClick={() => manageDropDowns("profile")}>
                <AccountCircleIcon className="text-neutral-400 h-6 cursor-pointer"/>
                <ExpandIcon className={activeDropDown === "profile" ? "text-neutral-400 h-5 rotate-180 transition" : "text-neutral-400 h-5 transition"} />
              </div>
              <div className={activeDropDown === "profile" ? "absolute bg-neutral-850 border rounded border-neutral-750 min-w-[250px] right-1 p-2 mt-1 flex gap-2 flex-col" : "hidden"} aria-hidden={activeDropDown === "profile"} aria-label="profile menu">
                <div className="flex gap-3 border-b border-neutral-750 pb-2 items-center">
                  <AccountCircleIcon className="text-neutral-400 w-11"/>
                  <span>Currently Signed Out</span>
                </div>
                <Link href="/login" className="text-orange-500 flex gap-1 items-center w-fit font-semibold">
                  <LogInIcon className="h-5" />
                  Log In
                </Link>
                <Link href="/register" className="text-orange-500 flex gap-1 items-center w-fit font-semibold">
                  <RegisterIcon className="h-5" />
                  Register
                </Link>
              </div>
            </>
          }
        </div>
        <div ref={cartRef} className="relative">
          <div onClick={() => manageDropDowns("cart")} className="flex items-center cursor-pointer gap-0.5">
            <CartIcon className={"text-neutral-400 h-6"} />
            <ExpandIcon className={activeDropDown === "cart" ? "text-neutral-400 h-5 rotate-180 transition" : "text-neutral-400 h-5 transition"} />
          </div>
          <div className={activeDropDown === "cart" ? "absolute bg-neutral-850 border rounded border-neutral-750 min-w-[250px] right-1 px-2 mt-1" : "hidden"} aria-hidden={activeDropDown === "cart"} aria-label="cart">
            Filler Text
          </div>
        </div>
        <div onClick={() => manageSideMenu()} className={menuToggled ? "top-0 left-0 h-screen w-full bg-black opacity-45 absolute" : "hidden"}></div>
        <div className={menuToggled ? "h-screen w-5/6 absolute top-0 left-0 bg-neutral-850 border-r border-neutral-750 transition-all max-w-[350px]" : "h-screen w-5/6 absolute top-0 left-0 -translate-x-full bg-neutral-850 border-r border-neutral-750 transition-all max-w-[350px]"} aria-hidden={!menuToggled} aria-label="menu">
          <div className="h-14 border-b border-neutral-750 px-2 flex gap-3 items-center">
            <CloseIcon className="h-7 cursor-pointer text-neutral-400" onClick={() => manageSideMenu()} />
            <img className="h-7 mt-1" src="/transparentRythmix.png" />
          </div>
        </div>
      </div>
    </header>
  )
}