import connectMongoDB from "@/config/mongoDBConnection";
import Users from "@/models/Users";
import Customer_Orders from "@/models/CustomerOrders";
import { NextRequest } from "next/server";
import Stripe from "stripe";
import { CustomerOrdersInterface } from "@/types/mongoDocTypes";
import Seller_Payouts from "@/models/SellerPayouts";

const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`);


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

        await updateUserStripeStatus(accountUpdated);
        break;
      case 'account.external_account.deleted':
        const accountExternalAccountDeleted = event.data.object;
        break;
      case 'account.external_account.updated':
        const accountExternalAccountUpdated = event.data.object;
        break;
      case 'payment_intent.canceled':
        const paymentIntentCanceled = event.data.object;
        break;
      case 'payment_intent.payment_failed':
        const paymentIntentPaymentFailed = event.data.object;
        break;
      case 'payment_intent.succeeded':
        const paymentIntentSucceeded = event.data.object;

        const updatedOrderDoc = await updateOrderStatus(paymentIntentSucceeded);

        if (updatedOrderDoc) {
          await createSeperateTransfers(paymentIntentSucceeded, updatedOrderDoc);
        }
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

const updateOrderStatus = async (paymentIntent: Stripe.PaymentIntent) => {
  try {
    const orderFromDB = await Customer_Orders.findOneAndUpdate({ 
      "paymentIntentId": paymentIntent.id 
    }, { $set: {
      "status": "completed",
      "customerDetails.billingAddress": await retrieveBillingAddress(paymentIntent),
      "customerDetails.email": paymentIntent.receipt_email,
    }}, { new: true }) as CustomerOrdersInterface;

    return orderFromDB;
  } catch (error) {
    console.log(error);
  }
}

const createSeperateTransfers = async (
  paymentIntent: Stripe.PaymentIntent, 
  updatedOrderDoc: CustomerOrdersInterface
) => {
  updatedOrderDoc.items.forEach(async (item) => {
    const seller = await Users.findById(item.sellerId, { 
      "stripeDetails.accountId": 1 
    });

    const transfer: Stripe.Transfer = await stripe.transfers.create({
      amount: item.price,
      currency: 'eur',
      destination: seller.stripeDetails.accountId,
      transfer_group: updatedOrderDoc.transferGroup,
    });

    await Seller_Payouts.create({
      sellerId: item.sellerId,
      totalAmount: item.price,
      paymentIntentId: paymentIntent.id,
      transferId: transfer.id,
      productId: item.productId,
      contract: item.contract,
      licenseType: item.licenseType,
      licenseTerms: item.licenseTerms,
      buyerId: updatedOrderDoc.customerDetails.customerId,
      transferGroup: updatedOrderDoc.transferGroup,
    });
  });
}

const retrieveBillingAddress = async (paymentIntent: Stripe.PaymentIntent) => {
  const paymentMethod = await stripe.paymentMethods.retrieve(paymentIntent.payment_method);

  return paymentMethod.billing_details;
}