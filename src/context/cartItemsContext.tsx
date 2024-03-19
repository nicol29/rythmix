"use client";

import { ReactNode, createContext, useState, useEffect } from "react";
import { BeatDocumentInterface } from "@/types/mongoDocTypes";


export const CartItemsContext = createContext<null | any>(null);

export default function CartItemsContextProvider({ children }: { children: ReactNode}) {
  const [cartItems, setCartItems] = useState<{}[]>([]);

  useEffect(() => {
    const itemsFromLocalStorage = localStorage.getItem("cartItems");
    const checkForItems = itemsFromLocalStorage ? JSON.parse(itemsFromLocalStorage) : [];

    setCartItems(checkForItems);
  }, []);

  const addItemToCart = (itemToAdd: {}) => {
    cartItems.forEach(item => {
      if (item === itemToAdd) return;
    })

    localStorage.setItem("cartItems", JSON.stringify([...cartItems, itemToAdd]));
    setCartItems([...cartItems, itemToAdd]);
  }

  const deleteItemFromCart = (item: {}) => {

  }

  return (
    <CartItemsContext.Provider 
      value={{
        cartItems,
        addItemToCart
      }}
    >
      {children}
    </CartItemsContext.Provider>
  )
}