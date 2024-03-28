"use client";

import { ReactNode, createContext, useState, useEffect } from "react";
import { CartItemInterface } from "@/types/mongoDocTypes";


interface CartItemsContextInterface {
  cartItems: CartItemInterface[]; 
  addItemToCart: (itemToAdd: CartItemInterface) => void;
  deleteItemFromCart: (itemToRemove: CartItemInterface) => void;
  emptyCart: () => void;
}

export const CartItemsContext = createContext<CartItemsContextInterface>({} as CartItemsContextInterface);

export default function CartItemsContextProvider({ children }: { children: ReactNode}) {
  const [cartItems, setCartItems] = useState<CartItemInterface[]>([]);

  useEffect(() => {
    const itemsFromLocalStorage = localStorage.getItem("cartItems");
    const checkForItems = itemsFromLocalStorage ? JSON.parse(itemsFromLocalStorage) : [];

    setCartItems(checkForItems);
  }, []);

  const addItemToCart = (itemToAdd: CartItemInterface) => {
    cartItems.forEach(item => {
      if (item === itemToAdd) return;
    })

    localStorage.setItem("cartItems", JSON.stringify([...cartItems, itemToAdd]));
    setCartItems([...cartItems, itemToAdd]);
  }

  const deleteItemFromCart = (itemToRemove: CartItemInterface) => {
    const updatedItems = cartItems.filter(item => item._id !== itemToRemove._id || 
      item.chosenLicense.licenseType !== itemToRemove.chosenLicense.licenseType
    );

    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    setCartItems(updatedItems);
  }

  const emptyCart = () => {
    localStorage.clear();
    
    setCartItems([]);
  }

  return (
    <CartItemsContext.Provider 
      value={{
        cartItems,
        addItemToCart,
        deleteItemFromCart,
        emptyCart
      }}
    >
      {children}
    </CartItemsContext.Provider>
  )
}