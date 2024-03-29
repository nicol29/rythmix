import { NotificationsIcon, ExpandIcon, SettingsIcon } from "@/assets/icons";
import { useEffect, useState } from "react";
import { getNotifications, markNotificationsAsRead } from "@/server-actions/notifications";
import Link from "next/link";
import Image from "next/image";
import returnProfilePicture from "@/utils/returnUserProfilePicture";
import getElapsedTime from "@/utils/getElapsedTime";


export default function NotificationsTab({
  notiRef,
  manageDropDowns,
  activeDropDown,
  authenticationStatus,
}: {
  notiRef: React.RefObject<HTMLDivElement>;
  manageDropDowns: (toggleActive: "profile" | "cart" | "notifications") => void;
  activeDropDown: "profile" | "cart" | "notifications" | null;
  authenticationStatus: string;
}) {
  const [notifications, setNotifications] = useState([]);
  const [isNotiRead, setIsNotiRead] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await getNotifications();
      
      if (res.success) setNotifications(res.notifications);
    })();
  }, []);

  const markAsRead = async () => {
    if (isNotiRead) return;

    await markNotificationsAsRead();
    const res = await getNotifications();
      
    if (res.success) {
      setNotifications(res.notifications);
      setIsNotiRead(true);
    }
  }

  const notificationHandler = (notification: any) => {
    if (notification.read === false && isNotiRead) setIsNotiRead(false);

    switch (notification.type) {
      case "comment":
        return <Link href={`/beat/${notification.resourceId}`} key={notification._id.toString()} className={`flex gap-2 py-3 px-2 border-b border-neutral-750 ${!notification.read && `new-notification-grey`}`}>
          <div className="relative w-10 aspect-square self-center flex-shrink-0">
            <Image className="object-cover rounded-full border border-neutral-750" fill sizes="w-full h-full" src={returnProfilePicture(notification.from?.profilePicture)} alt="Track art" />
          </div>
          <p className="text-sm">
            <span className="text-orange-500 font-bold">{notification.from.userName}</span> left a comment on your track.
            <span className='ml-3 text-xs text-neutral-500'>• {getElapsedTime(notification.createdAt)}</span>
          </p>
        </Link>
      case "like":
        return <Link href={`/beat/${notification.resourceId}`} key={notification._id.toString()} className={`flex gap-2 py-3 px-2 border-b border-neutral-750 ${!notification.read && `new-notification-grey`}`}>
          <div className="relative w-10 aspect-square self-center flex-shrink-0">
            <Image className="object-cover rounded-full border border-neutral-750" fill sizes="w-full h-full" src={returnProfilePicture(notification.from?.profilePicture)} alt="Track art" />
          </div>
          <p className="text-sm">
            <span className="text-orange-500 font-bold">{notification.from.userName}</span> liked your track.
            <span className='ml-3 text-xs text-neutral-500'>• {getElapsedTime(notification.createdAt)}</span>
          </p>
        </Link>
      case "system":
        return <div key={notification._id.toString()} className={`flex gap-2 py-3 px-2 border-b border-neutral-750 ${!notification.read && `new-notification-grey`}`}>
          <SettingsIcon className="w-10 h-10 flex-shrink-0 text-neutral-500" />
          <p className="text-sm">
            <span>{notification.message}</span>
            <span className='ml-3 text-xs text-neutral-500'>• {getElapsedTime(notification.createdAt)}</span>
          </p>
        </div>
      default:
        return null;
    }
  }

  return (
    authenticationStatus === "authenticated" &&
      <div ref={notiRef} className="sm:relative">
        <div onClick={() => manageDropDowns("notifications")} className="flex items-center cursor-pointer gap-0.5">
          <div className="relative">
            <NotificationsIcon className={"text-neutral-400 h-6"} />
            <div className={`${isNotiRead ? `hidden` : `absolute w-[6px] h-[6px] bg-red-400 rounded-full top-0 right-0`}`}></div>
          </div>
          <ExpandIcon className={activeDropDown === "notifications" ? "text-neutral-400 h-5 rotate-180 transition" : "text-neutral-400 h-5 transition"} />
        </div>
        <div className={activeDropDown === "notifications" ? "absolute bg-neutral-850 border rounded border-neutral-750 right-2 mt-1 w-5/6 sm:min-w-[400px] sm:right-1" : "hidden"} aria-hidden={activeDropDown === "cart"} aria-label="cart">
          <div className="flex items-center gap-3 p-2 border-b border-neutral-700">
            <span className="text-lg">Notifications</span>
            <span onClick={markAsRead} className={`text-red-400 text-sm font-bold ml-auto cursor-pointer ${isNotiRead ? `opacity-40` : `opacity-100`}`}>mark as read</span>
            <Link href="/settings/notifications"><SettingsIcon className="h-5 w-5" /></Link>
          </div>
          { notifications &&
            <div className="max-h-[350px] min-h-[350px] overflow-y-scroll">
              { notifications.map(notification => (
                  notificationHandler(notification)
              ))}
            </div>
          }
        </div>
      </div>
  )
}