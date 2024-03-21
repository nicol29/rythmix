import { CartIcon, ExpandIcon, CloseIcon } from "@/assets/icons";
import { CartItemsContext } from "@/context/cartItemsContext";
import { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import returnProfilePicture from "@/utils/returnUserProfilePicture";


export default function CartTab({
  cartRef,
  manageDropDowns,
  activeDropDown
}: {
  cartRef: React.RefObject<HTMLDivElement>;
  manageDropDowns: (toggleActive: "profile" | "cart" | "notifications") => void;
  activeDropDown: "profile" | "cart" | "notifications" | null;
}) {
  const { cartItems, deleteItemFromCart } = useContext(CartItemsContext);

  return (
    <div ref={cartRef} className="ml-auto relative">
      <div onClick={() => manageDropDowns("cart")} className="flex items-center cursor-pointer gap-0.5">
        <div className="relative">
          <CartIcon className={"text-neutral-400 h-6"} />
          <div className={`${cartItems.length === 0 ? `hidden` : `absolute text-xs bg-red-400 h-3 w-3 rounded-full font-medium top-0 -right-1 text-white flex justify-center items-center`}`}>{cartItems.length}</div>
        </div>
        <ExpandIcon className={activeDropDown === "cart" ? "text-neutral-400 h-5 rotate-180 transition" : "text-neutral-400 h-5 transition"} />
      </div>
      <div className={activeDropDown === "cart" ? "absolute bg-neutral-850 border rounded border-neutral-750 min-w-[400px] right-1 mt-1" : "hidden"} aria-hidden={activeDropDown === "cart"} aria-label="cart">
        <div className="flex items-center justify-between gap-3 p-2 border-b border-neutral-700">
          <span className="text-lg">Cart ({cartItems.length})</span>
          <Link href="/cart-checkout" className="text-orange-500 font-bold text-sm">view cart</Link>
        </div>
        <div className="max-h-[350px] min-h-[350px] overflow-y-scroll">
          { cartItems.length !== 0 ?
            ( cartItems.map(item => (
              <div key={item._id.toString()} className="flex items-center">
                <Link href={`/beat/${item.urlIdentifier}`} className="flex gap-2 py-3 px-2 w-11/12">
                  <div className="relative w-16 aspect-square self-center flex-shrink-0">
                    <Image className="object-cover rounded border border-neutral-750" fill sizes="w-full h-full" src={returnProfilePicture(item.assets.artwork.url)} alt="Track art" />
                  </div>
                  <div className="max-w-[270px] truncate overflow-hidden">
                    <span>{item.title}</span>
                    <div className="flex justify-between mt-2">
                      <span className="text-neutral-500 text-base">{item.chosenLicense.licenseType} License</span>
                      <span className="text-orange-500 font-semibold">$ {item.chosenLicense.licensePrice}</span>
                    </div>
                  </div>
                </Link>
                <CloseIcon onClick={() => deleteItemFromCart(item)} className="h-6 w-6 cursor-pointer" />
              </div>
            ))) :
            <div className="mt-16 flex flex-col items-center justify-center">
              <CartIcon className="w-24 h-24 text-neutral-600" />
              <span className="text-neutral-400 text-xl mt-2">Cart Empty</span>
              <span className="text-neutral-500">Items added to cart will be shown here</span>
            </div>
          } 
        </div>
      </div>
    </div>
  )
}