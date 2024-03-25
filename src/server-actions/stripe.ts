"use server";

import Users from "@/models/Users";
import Customer_Orders from "@/models/CustomerOrders";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BeatDocumentInterface, UserDocumentInterface, CartItemInterface } from "@/types/mongoDocTypes";
import { redirect } from "next/navigation";
import connectMongoDB from "@/config/mongoDBConnection";
import Beats from "@/models/Beats";
import Stripe from "stripe";
import uniqid from "uniqid";

const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`);


export const onBoardUser = async () => {
  await connectMongoDB();

  const signedInUser = await getServerSession(authOptions);
  const userFromDB = await Users.findById(signedInUser?.user.id) as UserDocumentInterface;
  let stripeAccountID;

  if (userFromDB?.stripeDetails.accountId) {
    stripeAccountID = userFromDB?.stripeDetails.accountId;
  } else {
    const account = await stripe.accounts.create({
      type: 'express',
    });
    
    stripeAccountID = account.id;

    await Users.findOneAndUpdate({ _id: signedInUser?.user.id }, { $set: {
      "stripeDetails": {
        "accountId": stripeAccountID,
        "onBoardStatus": "incomplete",
      }
    }});
  }

  // const account = await stripe.accounts.retrieve(stripeAccountID);

  const accountLink = await stripe.accountLinks.create({
    account: stripeAccountID,
    refresh_url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/stripe-onboarding`,
    return_url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/settings/payouts`,
    type: 'account_onboarding',
  });

  redirect(accountLink.url);
}


export const createCheckoutSession = async (
  cartItems: {
  beatId: string;
  chosenLicense: "basic" | "premium" | "exclusive";
}[]) => {
  try {
    const signedInUser = await getServerSession(authOptions);

    if (cartItems.length === 0) return;
    if (!signedInUser?.user.id) return;

    const beatIds = cartItems.map(beatInCart => beatInCart.beatId);
    
    await connectMongoDB();
    const beatsFromDB = await Beats.find({ 
      "_id": { $in: beatIds } 
    }) as BeatDocumentInterface[];

    let totalPrice = 0;

    const itemsOrderedByBuyer = beatsFromDB.map((beat, index) => {
      const chosenLicensePrice = beat.licenses[cartItems[index].chosenLicense].price;

      totalPrice = totalPrice + chosenLicensePrice;

      return {
        productId: beat._id,
        sellerId: beat.producer._id,
        price: chosenLicensePrice,
      }
    });

    const totalPriceInCents = totalPrice * 100;

    const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create({
      amount: totalPriceInCents,
      currency: 'eur',
      transfer_group: uniqid(),
      payment_method_types: ["card"],
    });

    await Customer_Orders.create({
      totalAmount: totalPriceInCents,
      paymentIntentId: paymentIntent.id,
      items: itemsOrderedByBuyer,
      buyerId: signedInUser?.user.id,
      transferGroup: paymentIntent.transfer_group
    });

    return { 
      success: true, 
      clientSecret: JSON.parse(JSON.stringify(paymentIntent.client_secret))
    }
  } catch (error) {
    console.log(error)
    return { success: false, error }
  }
}
