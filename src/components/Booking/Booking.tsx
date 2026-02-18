import React, { useState, useMemo, useEffect, useRef, use } from "react";
import { ALL_PACKAGES } from "../UI/constants";
import TripCard from "../UI/TripCard";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Check,
} from "lucide-react";
import { SearchCriteria } from "../../../types";
import BookingSidebar from "./BookingSidebar";
import { useGetBookingFirstViewQuery } from "@/redux/api/destinationApi";
import { useRouter } from "next/navigation";
import { log } from "console";

// --- ICONS ---
const SleekPlane = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M21,16V14L13,9V3.5A1.5,1.5 0 0,0 11.5,2A1.5,1.5 0 0,0 10,3.5V9L2,14V16L10,13.5V19L8,20.5V22L11.5,21L15,22V20.5L13,19V13.5L21,16Z" />
  </svg>
);

// 2. FILTER OPTIONS
const REGIONS = [
  "East Asia",
  "Southeast Asia",
  "South Asia",
  "Europe",
  "Middle East",
  "Oceania",
];

const DURATION_RANGES = [
  { label: "Weekend (1-3 Days)", minNights: 0, maxNights: 2 },
  { label: "Short Trip (4-6 Days)", minNights: 3, maxNights: 5 },
  { label: "Immersive (7-10 Days)", minNights: 6, maxNights: 9 },
  { label: "Long Haul (11+ Days)", minNights: 10, maxNights: 100 },
];

const TRAVEL_STYLES = [
  "Adventure",
  "Foodie",
  "Nature",
  "Luxury",
  "Family",
  "City",
  "Culture",
  "Shopping",
];

const SORT_OPTIONS = [
  { label: "Most Popular", value: "popular" },
  { label: "fare: Low to High", value: "fare_asc" },
  { label: "fare: High to Low", value: "fare_desc" },
  { label: "Newest", value: "newest" },
];

const FareItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className="text-2xl font-semibold text-gray-700">{value}</p>
  </div>
);

// --- SUB-COMPONENTS ---

interface FilterSectionProps {
  title: string;
  children?: React.ReactNode;
  isOpenDefault?: boolean;
}

const FilterSection = ({
  title,
  children,
  isOpenDefault = true,
}: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <div className="border-b  border-gray-100 py-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full mb-3 group"
      >
        <h4 className="font-bold text-brand-navy group-hover:text-brand-teal transition-colors">
          {title}
        </h4>
        {isOpen ? (
          <ChevronUp size={16} className="text-gray-400" />
        ) : (
          <ChevronDown size={16} className="text-gray-400" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onAnimationStart={() => setIsAnimating(true)}
            onAnimationComplete={() => setIsAnimating(false)}
            style={{ overflow: isAnimating ? "hidden" : "visible" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


interface BookingProps {
  country: string;
  id: number;
}

type fareItemProps = {
  label: string;
  value: string;
};

type Tour = {
  id: number;
  booking_country: string;
  booking_city: string;
  going_date: string;
  going_flight: string;
  coming_flight: string;
  going_start_schedule: string;
  going_end_schedule: string;
  coming_start_schedule: string;
  coming_end_schedule: string;
  single_bed_price: number;
  twin_bed_price: number;
  triple_bed_price: number;
  tax_price: number;
  adult_fare: number;
  child_fare: number;
  // added to match potential extended data or just optional if not always present
  adult_single_fare?: number;
  adult_twin_fare?: number;
  adult_triple_fare?: number;
  adult_tax_price?: number;
  child_single_fare?: number;
  child_twin_fare?: number;
  child_triple_fare?: number;
  child_tax_price?: number;
};

//recieve country and id here
const Booking: React.FC<BookingProps> = ({ country, id }) => {
  // Custom Dropdown State
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const [activeId, setActiveId] = useState<number>(0);
  const router = useRouter();

  const { data: booking, isLoading } = useGetBookingFirstViewQuery({
    country,
    id,
  });
  const bookingData = (booking?.data || []) as Tour[];
  console.log(bookingData, " booking data ");
  
  // Set initial active id from first tour or default
  useEffect(() => {
    if (bookingData && bookingData.length > 0) {
      setActiveId(bookingData[0].id);
    }
  }, [bookingData]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ... (rest of the component structure remains similar until we hit the usage of fares) ... */}
      {/* --- Booking HERO BANNER --- */}
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
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              7D NEW MT. LU/MT. DAJUE+ WUYUAN
            </h1>
            <p className="text-white ">大美庐山西湖山大觉山高铁火车7天游</p>
            <div className="flex pt-2 items-center justify-center gap-2 text-white/80 text-sm md:text-base font-medium">
              <span className="text-black rounded bg-brand-green px-4 ">
                Booking
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ===========================
        Main content start
    ===============================*/}
      <div className=" container mx-auto mt-12 px-4 md:px-6">
        <div className="grid grid-cols-6 md:grid-cols-12 gap-4 px-4 md:px-4">
          {/* left side */}
          <div className="col-span-6 md:col-span-9  w-full space-y-4">
            {bookingData.map((tour: any) => {
              const isOpen = activeId === tour.id;

              return (
                <motion.div
                  key={tour.id}
                  layout
                  className="bg-white rounded-lg border border-brand-sand  shadow-sm"
                >
                  {/* Header */}
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer"
                    onClick={() => setActiveId(tour.id)}
                  >
                    <div className="flex items-center gap-4 justify-center">
                      <p className="text-sm text-gray-500">{tour.going_date}</p>
                      <span className="inline-block text-sm font-semibold bg-brand-green text-black px-2 py-1 rounded">
                        {tour.going_flight}
                      </span>
                      <div className="flex gap-1 items-center">
                        <p className="font-semibold text-gray-900">
                          ${tour.adult_fare}
                        </p>
                        <ChevronDown />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveId(tour.id);
                        }}
                        className={`duration-300 text-md font-semibold px-4 py-2 rounded-lg transition-all ${
                          activeId === tour.id
                            ? "bg-[#0B4F4A] text-white hover:scale-[1.02]"
                            : "bg-white text-[#0B4F4A] border border-[#0B4F4A] hover:bg-[#0B4F4A] hover:text-white"
                        }`}
                      >
                        {activeId === tour.id ? "SELECTED" : "BOOK ONLINE"}
                      </button>
                    </div>
                  </div>

                  {/* Expandable content */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="overflow-hidden border-t border-brand-sand bg-white"
                      >
                        {/* FLIGHT INFO */}
                        <div className="mx-10 my-6 bg-gray-50 border border-brand-sand rounded-xl p-6">
                          {/* Header */}
                          <div className="grid grid-cols-4 text-xs text-gray-500 mb-4">
                            <p>DATE</p>
                            <p>FLIGHT</p>
                            <p className="col-span-2">SCHEDULE</p>
                          </div>

                          {/* Going Flight */}
                          <div className="grid grid-cols-4 items-center text-sm py-2">
                            <p>{tour.going_date}</p>
                            <p>{tour.going_flight}</p>

                            <div className="col-span-2 flex items-center gap-3">
                              <span className="font-semibold text-teal-700">
                                DEP
                              </span>
                              <span>{tour.going_start_schedule}</span>

                              <div className="flex-1 relative">
                                <div className="h-0.5 bg-teal-700 w-full" />
                                <span className="absolute right-0 -top-2 text-teal-700">
                                  ✈
                                </span>
                              </div>

                              <span>{tour.going_end_schedule}</span>
                              <span className="font-semibold text-teal-700">
                                ARR
                              </span>
                            </div>
                          </div>

                          {/* Coming Flight */}
                          <div className="grid grid-cols-4 items-center text-sm py-2">
                            <p>{tour.going_date}</p>
                            <p>{tour.coming_flight}</p>

                            <div className="col-span-2 flex items-center gap-3">
                              <span className="font-semibold text-teal-700">
                                DEP
                              </span>
                              <span>{tour.coming_start_schedule}</span>

                              <div className="flex-1 relative">
                                <div className="h-0.5 bg-teal-700 w-full" />
                                <span className="absolute right-0 -top-2 text-teal-700">
                                  ✈
                                </span>
                              </div>

                              <span>{tour.coming_end_schedule}</span>
                              <span className="font-semibold text-teal-700">
                                ARR
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* ADULT FARE */}
                        <div className="mx-10 mb-6 bg-gray-50 border border-brand-sand rounded-xl p-6">
                          <p className="text-sm font-semibold text-teal-800 mb-4">
                            ADULT FARE
                          </p>

                          <div className="grid grid-cols-4 gap-6 text-sm">
                            <FareItem
                              label="SINGLE FARE"
                              value={`$${tour.adult_single_fare || tour.single_bed_price || 0}`}
                            />
                            <FareItem
                              label="TWIN FARE"
                              value={`$${tour.adult_twin_fare || tour.twin_bed_price || 0}`}
                            />
                            <FareItem
                              label="TRIPLE FARE"
                              value={`$${tour.adult_triple_fare || tour.triple_bed_price || 0}`}
                            />
                            <FareItem
                              label="TAX"
                              value={`$${tour.tax_price}`}
                            />
                          </div>

                          <hr className="my-6 text-gray-300 " />

                          <p className="text-sm font-semibold text-teal-800 mb-4">
                            CHILD FARE
                          </p>

                          <div className="grid grid-cols-4 gap-6 text-sm">
                            <FareItem
                              label="SINGLE FARE"
                              value={`$${tour.child_single_fare || 0}`}
                            />
                            <FareItem
                              label="TWIN FARE"
                              value={`$${tour.child_twin_fare || 0}`}
                            />
                            <FareItem
                              label="TRIPLE FARE"
                              value={`$${tour.child_triple_fare || 0}`}
                            />
                            <FareItem
                              label="TAX"
                              value={`$${tour.tax_price}`}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
          {/* right side  */}
          <div className=" col-span-6 md:col-span-3 w-full space-y-4">
            <div className="border border-brand-sand rounded-xl overflow-hidden bg-white shadow-lg">
              <div className="bg-brand-green text-black p-4">
                <p className="text-xs tracking-wide uppercase">Closing</p>
                <p className="text-3xl font-bold">
                  ${bookingData.find((t) => t.id === activeId)?.adult_fare || 0}
                </p>
              </div>

              <div className="px-4 py-6 space-y-3 text-sm">
                <p className="flex items-center gap-2 text-gray-600">
                  📞 (+65) 6838 0001
                </p>
                <p className="flex items-center gap-2 text-gray-600">
                  📞 (+65) 9777 0960
                </p>

                <button
                  className="w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300 bg-brand-green text-brand-navy hover:bg-[#8cc72b] hover:scale-[1.02]"
                  onClick={() => {
                    const selectedTour = bookingData.find(
                      (t) => t.id === activeId,
                    );
                    if (selectedTour) {
                      const queryParams = new URLSearchParams({
                        destination_id: id.toString(),
                        // booking:selectedTour.id,
                        country: country,
                        tour_id: selectedTour.id.toString(),
                        adult_fare: selectedTour.adult_fare?.toString() || "0",
                        child_fare: selectedTour.child_fare?.toString() || "0",
                        going_flight: selectedTour.going_flight,
                        coming_flight: selectedTour.coming_flight,
                        going_date: selectedTour.going_date,
                        going_start_schedule: selectedTour.going_start_schedule,
                        going_end_schedule: selectedTour.going_end_schedule,
                        coming_start_schedule:
                          selectedTour.coming_start_schedule,
                        coming_end_schedule: selectedTour.coming_end_schedule,
                        single_bed_price: (
                          selectedTour.single_bed_price || 0
                        ).toString(),
                        twin_bed_price: (
                          selectedTour.twin_bed_price || 0
                        ).toString(),
                        triple_bed_price: (
                          selectedTour.triple_bed_price || 0
                        ).toString(),
                        tax_fare: (selectedTour.tax_price || 0).toString(),
                      }).toString();
                      router.push(`/make-booking?${queryParams}&booking=${selectedTour.id}`);
                    }
                  }}
                >
                  MAKE BOOKING
                </button>

                <button className="w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300 bg-brand-navy text-brand-green hover:bg-brand-navy/90 hover:text-white hover:scale-[1.02]">
                  ⬇ ITINERARY DOWNLOAD
                </button>

                <button className="text-xs text-teal-600 w-full mx-auto hover:underline">
                  ✉ EMAIL THIS PAGE
                </button>
              </div>
            </div>
            <BookingSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
