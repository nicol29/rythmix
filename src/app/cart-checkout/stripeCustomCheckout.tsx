"use client";

import { useState, useEffect, FormEvent } from 'react';
import { PaymentElement, useStripe, useElements, AddressElement } from "@stripe/react-stripe-js";


export default function StripeCustomCheckout() {
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState('');

  const [message, setMessage] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (!paymentIntent?.status) return;

      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/order-confirmation`,
        receipt_email: email,
      },
    });
    if (error.type === "card_error" || error.type === "validation_error") {
      if (error.message) setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const addressElementOptions = {
    mode: "billing",
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <AddressElement id="address-element" options={addressElementOptions as any} />
      <div className='mt-6 text-neutral-300 font-light'>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email address"
          className="w-full mb-4 h-14 rounded-xl pl-4 bg-neutral-700"
        />
      </div>
      <PaymentElement id="payment-element" options={paymentElementOptions as any} />
      <button className="w-full py-2 default-orange-button mt-6" disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message" className="text-red-400">{message}</div>}
    </form>
  )
}