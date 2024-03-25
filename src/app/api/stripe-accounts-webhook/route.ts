import connectMongoDB from "@/config/mongoDBConnection";
import Users from "@/models/Users";
import { NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
const endpointSecret = "whsec_ac9d04537f931ef8f36d7d0e097b317ae605c5905640d79b3fba897925edcc01";


export async function POST(request: NextRequest) {
  try {
    const sig = request.headers.get('stripe-signature');

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(await request.text(), sig, endpointSecret);
    } catch (err: any) {
      return Response.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    switch (event.type) {
      case 'account.updated':
        const accountUpdated = event.data.object;
        updateUserStripeStatus(accountUpdated.id);
        break;
      case 'account.external_account.deleted':
        const accountExternalAccountDeleted = event.data.object;
        break;
      case 'account.external_account.updated':
        const accountExternalAccountUpdated = event.data.object;
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return Response.json({ received: true }, { status: 200 });
  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


const updateUserStripeStatus = async (stripeAccountID: string) => {
  try {
    const account = await stripe.accounts.retrieve(stripeAccountID);

    if (account.charges_enabled && account.details_submitted && account.payouts_enabled) {
      await connectMongoDB();
      
      await Users.findOneAndUpdate({ "stripeDetails.accountId": account.id }, { $set: {
        "stripeDetails": {
          "onBoardStatus": "complete",
        }
      }}, { new: true });
    }
  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}