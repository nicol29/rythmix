"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import Users from "@/models/Users";
import { UserDocumentInterface } from "@/types/mongoDocTypes";

const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`);


export const openStripeDashBoard = async () => {
  try {
    const signedInUser = await getServerSession(authOptions);

    if (!signedInUser) return { success: false, error: "Unauthorised access" };

    const userFromDB = await Users.findById(signedInUser.user.id) as UserDocumentInterface;

    if (userFromDB.stripeDetails.onBoardStatus !== "complete") {
      return { success: false, error: "Must onboarded with Stripe" };
    } 

    const loginLink = await stripe.accounts.createLoginLink(
      userFromDB.stripeDetails.accountId
    );

    return { success: true, url: loginLink.url }
  } catch (error) {
    return { success: false, error };
  }
}