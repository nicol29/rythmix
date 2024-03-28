"use client";

import { useContext, useEffect } from "react";
import { CartItemsContext } from "@/context/cartItemsContext";


export default function EmptyCartOnClient() {
  const { emptyCart } = useContext(CartItemsContext);

  useEffect(() => {
    emptyCart();
  }, []);
  
  return null;
}