"use server";

import Users from "@/models/Users";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserDocumentInterface } from "@/types/mongoDocTypes";
import { redirect } from "next/navigation";
import connectMongoDB from "@/config/mongoDBConnection";

const stripe = require('stripe')('sk_test_51Ow59cIoHbkQst2eofJmJDPN36VtirlFj8otKFZrnQCzZ9QJ68nAvwCnMwov6g7TgKqBzwsdl2UbiSjqS1z8DFwF002catJhqA');


export const onBoardUser = async () => {
  // Set your secret key. Remember to switch to your live secret key in production.
  // See your keys here: https://dashboard.stripe.com/apikeys
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