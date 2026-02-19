"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking_id") || "";
  const paymentIntentId =
    searchParams.get("payment_intent") ||
    searchParams.get("payment_intent_id") ||
    "";
  const paymentIntentClientSecret =
    searchParams.get("payment_intent_client_secret") || "";
  const redirectStatus = searchParams.get("redirect_status") || "";

  // Stripe redirects with redirect_status=succeeded when payment is successful
  const isSuccess = redirectStatus === "succeeded" || !redirectStatus;

  return (
    <div className="min-h-screen bg-linear-to-br from-teal-50 to-green-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
          <svg
            className="h-10 w-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🎉 Booking Confirmed!
        </h1>
        <p className="text-gray-600 mb-2">
          Your payment was successful and your tour booking is confirmed.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          A confirmation email has been sent to your registered email address.
        </p>

        {/* Booking Details */}
        {(bookingId || paymentIntentId) && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Booking Details
            </h3>
            {bookingId && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Booking ID</span>
                <span className="font-medium text-gray-900 font-mono text-xs bg-gray-200 px-2 py-0.5 rounded">
                  {bookingId}
                </span>
              </div>
            )}
            {paymentIntentId && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment Ref</span>
                <span className="font-medium text-gray-900 font-mono text-xs bg-gray-200 px-2 py-0.5 rounded truncate max-w-45">
                  {paymentIntentId}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status</span>
              <span className="font-semibold text-green-600">✔ Paid</span>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full px-6 py-3 bg-teal-700 text-white font-semibold rounded-xl hover:bg-teal-800 transition-colors duration-200"
          >
            Return to Home
          </Link>
          <Link
            href="/destinations"
            className="block w-full px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors duration-200"
          >
            Explore More Tours
          </Link>
        </div>
      </div>
    </div>
  );
}
