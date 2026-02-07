
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ALL_PACKAGES } from '../UI/constants';
import TripCard from '../UI/TripCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, ChevronUp, ArrowUpDown, Check } from 'lucide-react';
import { SearchCriteria } from '../../../types';
import BookingSidebar from './BookingSidebar';

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
const REGIONS = ['East Asia', 'Southeast Asia', 'South Asia', 'Europe', 'Middle East', 'Oceania'];

const DURATION_RANGES = [
  { label: 'Weekend (1-3 Days)', minNights: 0, maxNights: 2 },
  { label: 'Short Trip (4-6 Days)', minNights: 3, maxNights: 5 },
  { label: 'Immersive (7-10 Days)', minNights: 6, maxNights: 9 },
  { label: 'Long Haul (11+ Days)', minNights: 10, maxNights: 100 },
];

const TRAVEL_STYLES = ['Adventure', 'Foodie', 'Nature', 'Luxury', 'Family', 'City', 'Culture', 'Shopping'];

const SORT_OPTIONS = [
  { label: 'Most Popular', value: 'popular' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest', value: 'newest' },
];


const FareItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className="text-2xl font-semibold text-gray-700">{value}</p>
  </div>
)


// --- SUB-COMPONENTS ---

interface FilterSectionProps {
  title: string;
  children?: React.ReactNode;
  isOpenDefault?: boolean;
}

const FilterSection = ({ title, children, isOpenDefault = true }: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <div className="border-b  border-gray-100 py-5">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center justify-between w-full mb-3 group"
      >
        <h4 className="font-bold text-brand-navy group-hover:text-brand-teal transition-colors">{title}</h4>
        {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            onAnimationStart={() => setIsAnimating(true)}
            onAnimationComplete={() => setIsAnimating(false)}
            style={{ overflow: isAnimating ? 'hidden' : 'visible' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Reusable Custom Dropdown Component for Sidebar
interface CustomDropdownProps {
    label: string;
    options: string[];
    value: string;
    onChange: (val: string) => void;
    placeholder: string;
    isOpen: boolean;
    onToggle: () => void;
    disabled?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ 
    label, options, value, onChange, placeholder, isOpen, onToggle, disabled 
}) => {
    return (
        <div className="relative">
            <button
                onClick={onToggle}
                disabled={disabled}
                className={`w-full text-left p-3 pr-10 rounded-xl border bg-gray-50 text-sm font-bold flex items-center justify-between transition-all ${
                    isOpen ? 'border-brand-teal ring-1 ring-brand-teal' : 'border-gray-200 hover:border-brand-teal/50'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer text-brand-navy'}`}
            >
                <span className="truncate">{value || placeholder}</span>
                <ChevronDown size={16} className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && !disabled && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-60 max-h-60 overflow-y-auto custom-scrollbar"
                    >
                        <ul className="py-2">
                            <li key="all">
                                <button
                                    onClick={() => onChange('')}
                                    className="w-full text-left px-4 py-3 hover:bg-brand-sand/30 flex items-center justify-between group transition-colors"
                                >
                                    <span className={`font-medium text-sm ${value === '' ? 'text-brand-navy' : 'text-gray-600'}`}>
                                        {placeholder}
                                    </span>
                                    {value === '' && (
                                        <span className="w-2 h-2 rounded-full bg-brand-green shadow-[0_0_8px_rgba(163,230,53,0.8)]"></span>
                                    )}
                                </button>
                            </li>
                            {options.map((option) => (
                                <li key={option}>
                                    <button
                                        onClick={() => onChange(option)}
                                        className="w-full text-left px-4 py-3 hover:bg-brand-sand/30 flex items-center justify-between group transition-colors"
                                    >
                                        <span className={`font-medium text-sm ${value === option ? 'text-brand-navy' : 'text-gray-600'}`}>
                                            {option}
                                        </span>
                                        {value === option && (
                                            <span className="w-2 h-2 rounded-full bg-brand-green shadow-[0_0_8px_rgba(163,230,53,0.8)]"></span>
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


interface BookingProps {
  onTripClick?: () => void;
  onNavigateMakeBooking: () => void;
}

type PriceItemProps = {
  label: string
  value: string
}


type Tour = {
  id: number
  date: string
  airline: string
  price: number
  flight:string
  schedule: string
}

const tours: Tour[] = [
  { id: 1, date: "Wed, 18 Feb 2026", airline: "CHINA EASTERN", price: 1548, flight:"Mub003", schedule: "Depart 09:00 AM - Arrive 02:00 PM" },
  { id: 2, date: "Fri, 27 Feb 2026", airline: "CHINA EASTERN", price: 1128, flight:"Mub003", schedule: "Depart 09:00 AM - Arrive 02:00 PM" },
  { id: 3, date: "Sun, 01 Mar 2026", airline: "CHINA EASTERN", price: 1078, flight:"Mub003", schedule: "Depart 09:00 AM - Arrive 02:00 PM" },
  { id: 4, date: "Sun, 08 Mar 2026", airline: "CHINA EASTERN", price: 1128, flight:"Mub003", schedule: "Depart 09:00 AM - Arrive 02:00 PM" },
]

const Booking: React.FC<BookingProps> = ({ onNavigateMakeBooking }) => {


  // Custom Dropdown State
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

const [activeId, setActiveId] = useState<number>(tours[0].id)



  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
            setActiveDropdown(null);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);



  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
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
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">7D NEW MT. LU/MT. DAJUE+ WUYUAN</h1>
            <p className="text-white ">
                大美庐山西湖山大觉山高铁火车7天游 
            </p>
            <div className="flex pt-2 items-center justify-center gap-2 text-white/80 text-sm md:text-base font-medium">
              <span className="text-black rounded bg-brand-green px-4 ">Booking</span>
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
            {tours.map((tour) => {
                const isOpen = activeId === tour.id

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
                        <p className="text-sm text-gray-500">{tour.date}</p>
                        <span className="inline-block text-sm font-semibold bg-brand-green text-black px-2 py-1 rounded">
                        {tour.airline}
                        </span>
                        <div className="flex gap-1 items-center">
                            <p className="font-semibold text-gray-900">
                        ${tour.price.toLocaleString()}
                        </p>
                        <ChevronDown />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="duration-300 bg-[#0B4F4A]  text-white hover:scale-[1.02] text-md font-semibold px-4 py-2 rounded-lg transition-all ">
                        BOOK ONLINE
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

                    {/* Row 1 */}
                    <div className="grid grid-cols-4 items-center text-sm py-2">
                        <p>{tour.date}</p>
                        <p>{tour.flight}</p>

                        <div className="col-span-2 flex items-center gap-3">
                        <span className="font-semibold text-teal-700">SIN</span>
                        <span>03:30</span>

                        <div className="flex-1 relative">
                            <div className="h-0.5 bg-teal-700 w-full" />
                            <span className="absolute right-0 -top-2 text-teal-700">✈</span>
                        </div>

                        <span>03:30</span>
                        <span className="font-semibold text-teal-700">SIN</span>
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-4 items-center text-sm py-2">
                        <p>{tour.date}</p>
                        <p>{tour.flight}</p>

                        <div className="col-span-2 flex items-center gap-3">
                        <span className="font-semibold text-teal-700">SIN</span>
                        <span>03:30</span>

                        <div className="flex-1 relative">
                            <div className="h-0.5 bg-teal-700 w-full" />
                            <span className="absolute right-0 -top-2 text-teal-700">✈</span>
                        </div>

                        <span>03:30</span>
                        <span className="font-semibold text-teal-700">SIN</span>
                        </div>
                    </div>
                    </div>

                    {/* ADULT FARE */}
                    <div className="mx-10 mb-6 bg-gray-50 border border-brand-sand rounded-xl p-6">
                    <p className="text-sm font-semibold text-teal-800 mb-4">
                        ADULT FARE
                    </p>

                    <div className="grid grid-cols-4 gap-6 text-sm">
                        <FareItem label="SINGLE FARE" value="$2098" />
                        <FareItem label="TWIN FARE" value="$2098" />
                        <FareItem label="TRIPLE FARE" value="$2098" />
                        <FareItem label="TAX" value="$100" />
                    </div>

                    <hr className="my-6 text-gray-300 " />

                    <p className="text-sm font-semibold text-teal-800 mb-4">
                        ADULT FARE
                    </p>

                    <div className="grid grid-cols-4 gap-6 text-sm">
                        <FareItem label="SINGLE FARE" value="$2098" />
                        <FareItem label="TWIN FARE" value="$2098" />
                        <FareItem label="TRIPLE FARE" value="$2098" />
                        <FareItem label="TAX" value="$100" />
                    </div>
                    </div>
                </motion.div>
)}

                    </AnimatePresence>
                </motion.div>
                )
            })}
            </div>
    {/* right side  */}
            <div className=" col-span-6 md:col-span-3 w-full space-y-4">
                <BookingSidebar onNavigateMakeBooking={onNavigateMakeBooking} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
