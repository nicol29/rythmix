"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { MenuIcon, SearchIcon, CloseIcon, AccountCircleIcon, LogOutIcon, ExpandIcon, RegisterIcon, LogInIcon } from "@/assets/icons"
import Image from "next/image";
import Link from "next/link";
import returnProfilePicture from "@/utils/returnUserProfilePicture";
import useDetectOutsideClick from "@/hooks/useDetectOutsideClick";
import { useRouter, usePathname } from "next/navigation";
import SearchBar from "./searchBar";
import NotificationsTab from "./notificationsTab";
import CartTab from "./cartTab";
import SideMenu from "./sideMenu";


export default function Header() {
  const { data: session, status } = useSession();

  const router = useRouter();
  const path = usePathname();

  const [activeDropDown, setActiveDropdown] = useState<"profile" | "cart" | "notifications" | null>(null);
  const [menuToggled,setMenuToggled] = useState(false);
  const [searchToggled, setSearchToggled] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const notiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    menuToggled ? document.body.style.overflow = "hidden" : document.body.style.overflow = "auto";
    setActiveDropdown(null);
  }, [path, menuToggled]);

  useDetectOutsideClick([cartRef, profileRef, notiRef], () => setActiveDropdown(null));

  const manageDropDowns = (toggleActive: "profile" | "cart" | "notifications") => {
    activeDropDown === toggleActive ? setActiveDropdown(null) : setActiveDropdown(toggleActive);
  }

  const manageSideMenu = () => {
    menuToggled ? document.body.style.overflow = "auto" : document.body.style.overflow = "hidden";
    setMenuToggled(!menuToggled);
  }

  const changeToHomePage = () => {
    if (path !== "/") router.push("/");
  }

  return (
    <div>
      <header className="bg-neutral-850 fixed top-0 w-full z-20">
        <div className="px-2 h-14 flex gap-3 items-center border-b border-neutral-750 relative lg:gap-6">
          <MenuIcon className="text-neutral-400 h-7 cursor-pointer shrink-0" onClick={() => manageSideMenu()} data-testid="menu-icon"/>
          <div className="flex-shrink-0">
            <Image
              src="/transparentRythmix.png"
              className="h-6 w-auto mt-1 cursor-pointer hidden sm:block"
              alt="Rythmix Logo"
              width={1024}
              height={246}
              priority
              onClick={changeToHomePage}
            />
            <Image
              src="/transparentRythmixLogo.png"
              className="h-6 w-auto mt-1 cursor-pointer block sm:hidden"
              alt="Rythmix Logo"
              width={1024}
              height={1024}
              priority
              onClick={changeToHomePage}
            />
          </div>
          <button className="block sm:hidden" onClick={() => setSearchToggled(!searchToggled)} aria-label="Open searchbar">
            <SearchIcon className="text-neutral-400 h-6"/>
          </button>
          <div className={searchToggled ? "bg-neutral-800 w-full absolute top-full left-0 mt-px h-12 flex justify-center items-center scale-100 opacity-100 transition-all sm:static sm:w-auto sm:h-auto sm:bg-neutral-850" : "scale-0 opacity-0 sm:scale-100 sm:opacity-100 sm:block sm:static sm:w-auto sm:h-auto sm:bg-neutral-850"}>
            <SearchBar />
            <CloseIcon className="h-5 w-5 absolute right-3 text-neutral-500 cursor-pointer sm:hidden" onClick={() => setSearchToggled(!searchToggled)}/>
          </div>
          <CartTab 
            cartRef={cartRef}
            manageDropDowns={manageDropDowns}
            activeDropDown={activeDropDown}
          />
          <NotificationsTab 
            notiRef={notiRef}
            manageDropDowns={manageDropDowns}
            activeDropDown={activeDropDown}
            authenticationStatus={status}
          />
          <div ref={profileRef} className="relative">
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
                    <Link href={`/${session.user.profileUrl}`} className="relative w-9 h-9 self-center">
                      <Image className="rounded-full object-cover" src={returnProfilePicture(session.user.image)} priority fill sizes="w-full h-full" alt="User profile picture" />
                    </Link>
                    <div>
                      <Link href={`/${session.user.profileUrl}`} className="text-orange-500 font-semibold">{session.user.userName}</Link>
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
          <SideMenu 
            menuToggled={menuToggled} 
            manageSideMenu={manageSideMenu}
            session={session}
            authStatus={status}
          />
        </div>
      </header>
    </div>
  )
}