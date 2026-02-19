"use client";

import React, { useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

import { useSearchParams, useRouter } from "next/navigation";
import { CheckoutForm } from "@/components/Booking/CheckoutForm";
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
const stripePromise = loadStripe(
  "pk_test_51Pyfi32MZV3T6mnfOxCnX5howJBaOlFklUstCHsIXLRpr7mIOjLe500vLg3NmyWTufeRgq1MjgNq9hCZqp1UX1sO00AJBcv3fZ",
);

export default function StripeCheckoutPage() {
    const searchParams = useSearchParams()
    const amount = searchParams.get("amount")
    console.log(amount, 'amonunt')

  const options = {
    mode: "payment",
    amount: Number(amount),
    currency: "usd",
    // Fully customizable with appearance API.
    appearance: {
      /*...*/
    },
  };
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-teal-50 to-green-50">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow p-8">
        <h3 className="text-xl font-bold text-teal-800 mb-4">
          Complete Payment
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Amount and booking details will be shown in the payment form.
        </p>
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm  />
        </Elements>
      </div>
    </div>
  );
}
