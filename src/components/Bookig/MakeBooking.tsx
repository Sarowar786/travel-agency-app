import { div } from "framer-motion/client";
import React from "react";
import { motion } from 'framer-motion';

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
interface MakeBookingProps {
  onTripClick?: () => void;
  onNavigateMakeBooking: () => void;
}
const MakeBooking: React.FC<MakeBookingProps> = ({ onNavigateMakeBooking }) => {
  return (
    <div>
      {/* --- DESTINATIONS HERO BANNER --- */}
      <div className="relative h-[40vh] md:h-[50vh] bg-brand-navy overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop" 
          alt="Discover the World" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-linear-to-t from-brand-navy via-brand-navy/40 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">Discover the World</h1>
            <div className="flex items-center justify-center gap-2 text-white/80 text-sm md:text-base font-medium">
              <span>Home</span>
              <span className="w-1 h-1 rounded-full bg-brand-green"></span>
              <span className="text-brand-green">Booking</span>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 mt-6">
      {/* Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2 text-orange-500">
            <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm">
              ✓
            </span>
            <span className="text-sm">TOUR OVERVIEW</span>
          </div>

          <div className="flex items-center space-x-2 text-teal-600">
            <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm">
              ✓
            </span>
            <span className="text-sm">PASSENGER DETAILS</span>
          </div>

          <div className="flex items-center space-x-2 text-gray-400">
            <span className="w-6 h-6 rounded-full bg-gray-300 text-white flex items-center justify-center text-sm">
              3
            </span>
            <span className="text-sm">REVIEW & PAYMENT</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Section */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Tour Details */}
          <div className="border rounded-xl">
            <div className="bg-teal-800 text-white px-4 py-2 font-semibold rounded-t-xl">
              TOUR DETAILS
            </div>

            <div className="p-4 space-y-2">
              <h3 className="font-bold text-black">
                7D NEW MT. LU/MT. DAJUE + WUYUAN
              </h3>

              <div className="grid grid-cols-2 gap-4 text-gray-600 pt-3">
                <div>
                  <p className="font-medium text-sm text-gray-500">DEPARTURE DATE</p>
                  <p className="font-semibold text-black">
                    Wed, 18 Feb 2026 ✈
                  </p>
                </div>

                <div>
                  <p className="font-medium text-sm text-gray-500">RETURN DATE</p>
                  <p className="font-semibold text-black">
                    Tue, 24 Feb 2026
                  </p>
                </div>

                <div>
                  <p className="font-medium text-sm text-gray-500 pt-3">TOUR CODE</p>
                  <p className="font-semibold text-black">
                    02CKH1D 18/26MU
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Number of Rooms */}
          <div className="border rounded-xl">
            <div className="bg-teal-800 text-white px-4 py-2 font-semibold rounded-t-xl">
              NUMBER OF ROOMS
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm text-gray-800 font-semibold mb-1">
                  Select number of rooms, total 8 pax allowed per booking
                </label>
                <input
                  type="number"
                  className="w-50 border border-gray-300 bg-gray-100 rounded px-3 py-1.5 mt-1 shadow text-sm"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-xs font-semibold text-gray-900">
                <strong>NOTE:</strong> As a licensing condition of the Singapore
                Tourism Board, Commonwealth Travel Service Corporation Pte Ltd
                are required to inform you, the Client, to consider purchasing
                travel insurance.
                <br />
                <br />
                Get a comprehensive travel insurance policy to protect against
                unforeseen circumstances, such as baggage loss, flight delays,
                travel agent insolvency and medical emergencies.
              </div>
            </div>
          </div>

          {/* Room 1 */}
          <div className="border rounded-xl">
            <div className="bg-teal-800 text-white px-4 py-2 font-semibold rounded-t-xl">
              ROOM 1
            </div>

            <div className="px-4 pt-4 pb-6 grid grid-cols-1 md:grid-cols-5 gap-4 font-semibold">
              <div>
                <label className="text-sm text-gray-900">Adult</label>
                <select className="w-full border rounded-lg bg-gray-100  px-2 py-2 shadow text-sm">
                  <option>0</option>
                  <option>1</option>
                  <option>2</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-900">Child w/ Bed</label>
                <select className="w-full border rounded-lg bg-gray-100  px-2 py-2 shadow text-sm">
                  <option>0</option>
                  <option>1</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-900">Child w/o Bed</label>
                <select className="w-full border rounded-lg bg-gray-100  px-2 py-2 shadow text-sm">
                  <option>0</option>
                  <option>1</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-900">Infants</label>
                <select className="w-full border rounded-lg bg-gray-100  px-2 py-2 shadow text-sm">
                  <option>0</option>
                  <option>1</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-900">Room Type</label>
                <select className="w-full border rounded-lg bg-gray-100  px-2 py-2 shadow text-sm">
                  <option>Twin Bed</option>
                  <option>Double Bed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Summary */}
        <div className="col-span-12 lg:col-span-4">
          <div className="border rounded-xl">
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

              <div className="border-t my-2" />

              <SummaryRow
                label="Taxes"
                price="$100"
                qty={2}
                total="$200"
              />

              <div className="border-t my-2" />

              <SummaryRow
                label="CRKHOLDING 13"
                price="($820)"
                qty={2}
                total="($1,000)"
                negative
              />

              <div className="border-t my-2" />

              <div className="flex justify-between font-semibold">
                <span className="text-black font-bold">Total SGD</span>
                <span className="text-teal-700">$3,495</span>
              </div>

              <button className="w-full mt-4 bg-red-400 hover:bg-red-500 text-white py-2 rounded">
                NEXT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default MakeBooking;
