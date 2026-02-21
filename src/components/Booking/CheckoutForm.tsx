"use client";

import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useRouter, useSearchParams } from "next/navigation";


export const CheckoutForm = () => {
  const searchParams = useSearchParams();
    const clientSecret = searchParams.get("client_secret")
  console.log(clientSecret,"client")

  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!elements || !stripe) {
      setErrorMessage("Stripe or Elements not loaded");
      return;
    }

    setIsProcessing(true);

    try {
      // Trigger form validation and wallet collection
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setErrorMessage(submitError.message || "Form validation failed");
        setIsProcessing(false);
        return;
      }

      // Confirm payment with Stripe
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret:clientSecret!,       
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
      });

      if (error) {
        setErrorMessage(error.message || "Payment failed");
        setIsProcessing(false);
      } else {
        // Payment succeeded or is processing (redirect handled by Stripe)
        router.push("/checkout/success");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An error occurred during payment");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <PaymentElement />
      </div>

      <button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
      >
        {isProcessing ? "Processing…" : "Pay now"}
      </button>

      <p className="text-center text-xs text-gray-500">
        Your payment information is secured by Stripe.
      </p>
    </form>
  );
};
