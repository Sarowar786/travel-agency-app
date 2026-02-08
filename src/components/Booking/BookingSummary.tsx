import React from 'react'
import { CheckoutCountdown } from './CheckoutCountdown'
import Link from 'next/link'

type SummaryRowProps = {
    label: string;
    price: string;
    qty?: number;
    total?: string;
    negative?: boolean;
};

const SummaryRow: React.FC<SummaryRowProps> = ({
    label,
    price,
    qty,
    total,
    negative,
}) => {
    return (
        <div className="flex justify-between text-sm py-1">
            <span className="text-gray-600">{label}</span>
            <span className={negative ? "text-red-500" : "text-gray-800"}>
                {price}
                {qty && ` × ${qty}`} {total && ` ${total}`}
            </span>
        </div>
    );
};


export default function BookingSummary() {
    return (
        <div>
            <div >
                <div className="bg-teal-800 text-white px-4 py-2 font-semibold rounded-t-xl">
                    BOOKING SUMMARY
                </div>

                <div className="p-4 space-y-2">
                    <SummaryRow
                        label="Adult (Twin)"
                        price="$2,568"
                        qty={2}
                        total="$4,236"
                    />

                    <div className="border-t border-brand-sand my-2" />

                    <SummaryRow
                        label="Taxes"
                        price="$100"
                        qty={2}
                        total="$200"
                    />

                    <div className="border-t border-brand-sand my-2" />

                    <SummaryRow
                        label="CRKHOLDING 13"
                        price="($820)"
                        qty={2}
                        total="($1,000)"
                        negative
                    />

                    <div className="border-t border-brand-sand my-2" />

                    <div className="flex justify-between font-semibold">
                        <span className="text-black font-bold">Total SGD</span>
                        <span className="text-teal-700">$3,495</span>
                    </div>

                    {/* {expiresAt ? (
                    <CheckoutCountdown
                      expiresAt={expiresAt}
                      onExpire={() => {
                        // disable submit / show message / redirect
                      }}
                    />
                  ) : null} */}
                    <div className='mt-5 mx-5'>

                        <CheckoutCountdown
                            expiresAt={Date.now() + 35 * 60 * 1000}
                            onExpire={() => console.log("Expired")}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
