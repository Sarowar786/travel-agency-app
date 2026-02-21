"use client";

import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import { CheckoutForm } from "@/components/Booking/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function StripeCheckoutPage() {
  const searchParams = useSearchParams();
  const clientSecret = searchParams.get("client_secret"); // ✅ এটা নাও
  const amount = searchParams.get("amount");


  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Payment information missing.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-linear-to-br from-teal-50 to-green-50">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow p-8">
        <h3 className="text-xl font-bold text-teal-800 mb-4">
          Complete Payment
        </h3>
        {amount && (
          <p className="text-sm text-gray-600 mb-4">
            Total Amount: <span className="font-semibold">${amount}</span>
          </p>
        )}
        
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
}