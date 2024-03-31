"use server";

import Users from "@/models/Users";
import Customer_Orders from "@/models/CustomerOrders";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { UserDocumentInterface } from "@/types/mongoDocTypes";
import { createContract } from "@/utils/createContract";
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

    let totalPrice = 0;

    await connectMongoDB();

    const itemsOrderedByBuyer = await Promise.all(cartItems.map(async beat => {
      const beatFromDB = await Beats.findById(beat.beatId);
  
      if (beatFromDB) {
        const chosenLicensePrice = beatFromDB.licenses[beat.chosenLicense].price;
        const chosenLicenseTerms = beatFromDB.licenseTerms[beat.chosenLicense];
        
        totalPrice += chosenLicensePrice; 
  
        return {
          productId: beatFromDB._id,
          sellerId: beatFromDB.producer._id,
          price: Math.round(chosenLicensePrice * 100),
          contract: createContract(
            chosenLicenseTerms, 
            beatFromDB.producer.userName, 
            signedInUser?.user.userName,
            beatFromDB.title,
            chosenLicensePrice,
            beat.chosenLicense
          ),
          licenseType: beat.chosenLicense,
          licenseTerms: chosenLicenseTerms,
        };
      }
    }));

    const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create({
      amount: calculateFinalStripePriceInCents(totalPrice),
      currency: 'eur',
      transfer_group: uniqid(),
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: [],
      },
    });

    await Customer_Orders.create({
      totalAmount: calculateFinalStripePriceInCents(totalPrice),
      paymentIntentId: paymentIntent.id,
      items: itemsOrderedByBuyer,
      customerDetails: {
        customerId: signedInUser?.user.id,
      },
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

const calculateFinalStripePriceInCents = (totalPrice: number) => {
  const feePercentage = 5;

  const feeAmount = (totalPrice * feePercentage) / 100;
  const finalPriceWithFees = totalPrice + feeAmount;
  const totalPriceInCents = Math.round(finalPriceWithFees * 100); 

  return totalPriceInCents;
}
