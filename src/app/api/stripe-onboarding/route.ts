import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { UserDocumentInterface } from "@/types/mongoDocTypes";
import connectMongoDB from "@/config/mongoDBConnection";
import Users from "@/models/Users";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


export async function GET() {
  try {
    await connectMongoDB();

    const signedInUser = await getServerSession(authOptions);

    if (!signedInUser?.user.id) {
      return Response.json({ error: 'Authorisation Required' }, { status: 401 });
    }

    const userFromDB = await Users.findById(signedInUser?.user.id) as UserDocumentInterface;
    let stripeAccountID = userFromDB?.stripeDetails.accountId;

    if (stripeAccountID) {
      const accountLink = await stripe.accountLinks.create({
        account: stripeAccountID,
        refresh_url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/stripe-onboarding`,
        return_url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/settings/payouts`,
        type: 'account_onboarding',
      });


      return Response.redirect(accountLink.url);
    } else {
      return Response.json({ error: 'Forbidden to access this resource' }, { status: 403 });
    }

    // const account = await stripe.accounts.retrieve(stripeAccountID);

  } catch (error) {
    console.error(error); 

    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}