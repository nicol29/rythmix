import Link from "next/link";


export default function SettingsSideNavBar({ 
  activeRoute 
}: { 
  activeRoute: "profile" | "licenses" | "notifications";
}) {
  return (
    <nav className="flex flex-col gap-4 lg:absolute lg:left-[100px] lg:p-4 lg:min-h-[500px] lg:w-[180px] lg:border-r border-neutral-600">
      <Link 
        href="/settings/profile" 
        className={`${activeRoute === "profile" && `border-l-[2px] border-orange-500 pl-2`}`}
      >Profile</Link>
      <div className="w-full h-[1px] bg-neutral-700"></div>
      <Link 
        href="/settings/licenses" 
        className={`${activeRoute === "licenses" && `border-l-[2px] border-orange-500 pl-2`}`}
      >Licences</Link>
      <div className="w-full h-[1px] bg-neutral-700"></div>
      <Link 
        href="/settings/notifications" 
        className={`${activeRoute === "notifications" && `border-l-[2px] border-orange-500 pl-2`}`}
      >Notifications</Link>
    </nav>
  )
}