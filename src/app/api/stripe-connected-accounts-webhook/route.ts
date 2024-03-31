import connectMongoDB from "@/config/mongoDBConnection";
import Users from "@/models/Users";
import { NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`);
const webhookSecret = `${process.env.STRIPE_ACCOUNTS_WEBHOOK_SECRET}`;


export async function POST(request: NextRequest) {
  try {
    const sig = request.headers.get('stripe-signature');

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(await request.text(), sig, webhookSecret);
    } catch (err: any) {
      return Response.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    switch (event.type) {
      case 'account.updated':
        const accountUpdated = event.data.object;

        await updateUserStripeStatus(accountUpdated);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return Response.json({ received: true }, { status: 200 });
  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


const updateUserStripeStatus = async (account: Stripe.Account) => {
  try {
    if (account.charges_enabled && account.details_submitted && account.payouts_enabled) {
      await connectMongoDB();
      
      await Users.findOneAndUpdate({ "stripeDetails.accountId": account.id }, { $set: {
        "stripeDetails.onBoardStatus": "complete"
      }});
    }
  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}