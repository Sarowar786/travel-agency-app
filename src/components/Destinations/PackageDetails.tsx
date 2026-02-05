
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, ChevronDown, ChevronUp,
    Car, Hotel, Train, Moon, Camera, Utensils, Coffee, Ship, Users, Zap, Calendar, MapPin, CheckCircle2, XCircle, AlertCircle, FileText, HelpCircle, Download, Mail,
    Link
} from 'lucide-react';
import { ActivityOption, DayItinerary } from '../../../types';
import ActivityCustomizationModal from './ActivityCustomizationModal';
import { ALL_PACKAGES } from '../../components/UI/constants';
import TripCard from '../UI/TripCard';
// import { NavLink } from 'react-router-dom';

interface PackageDetailsProps {
    onNavigateBack: () => void;
}

// --- DATA ---

const ALTERNATIVES_DAY1_NIGHT: ActivityOption[] = [
    {
        id: 'd1n-walk',
        title: 'Jiefangbei Night Walk',
        tagline: 'The beating heart of Chongqing.',
        description: ['Explore the neon-lit pedestrian street.', 'Visit the Liberation Monument.', 'Street food tasting included.'],
        energy: 'Moderate',
        priceChange: 0,
        image: 'https://images.unsplash.com/photo-1570702580556-e4142750010c?q=80&w=1000',
        tags: ['#CityVibes', '#StreetFood']
    },
    {
        id: 'd1n-opera',
        title: 'Sichuan Opera VIP',
        tagline: 'Face-changing magic show.',
        description: ['Front row seats to legendary performance.', 'Private tea service included.', 'Backstage meet & greet.'],
        energy: 'Low',
        priceChange: 45,
        image: 'https://images.unsplash.com/photo-1535126320456-2244222c153f?q=80&w=1000',
        tags: ['#Culture', '#Show']
    }
];

const ALTERNATIVES_DAY2_AFTERNOON: ActivityOption[] = [
    {
        id: 'd2a-hongya',
        title: 'Hongyadong Exploration',
        tagline: 'The classic spirited away experience.',
        description: [
            'Explore the 11-story stilt house complex.',
            'Best views of the Jialing River bridge.',
            'Free entrance, self-guided.'
        ],
        energy: 'Moderate',
        priceChange: 0,
        image: 'https://images.unsplash.com/photo-1535025639604-9a804c092faa?q=80&w=1000',
        tags: ['#SpiritedAway', '#Photography']
    },
    {
        id: 'd2a-drone',
        title: 'Cyberpunk Drone Photo',
        tagline: 'Be the star of your own sci-fi movie.',
        description: [
            'Professional drone operator follows you.',
            'Receive a 1-minute 4K edited video.',
            'Pose on the Qiansimen Bridge.'
        ],
        energy: 'Low',
        priceChange: 30,
        image: 'https://images.unsplash.com/photo-1504222490345-c075b6008014?q=80&w=1000',
        tags: ['#DroneShot', '#InfluencerMode']
    },
    {
        id: 'd2a-bunker',
        title: 'Underground Food Bunker',
        tagline: 'Dining in a converted air-raid shelter.',
        description: [
            'Visit the hidden underworld of Chongqing.',
            'Hotpot served in a cool, cave-like setting.',
            'Includes private guide.'
        ],
        energy: 'Moderate',
        priceChange: 50,
        image: 'https://images.unsplash.com/photo-1626284323204-635293427302?q=80&w=1000',
        tags: ['#HiddenGem', '#History']
    }
];

const RAW_ITINERARY: DayItinerary[] = [
    {
        day: 1,
        title: "Arrival & Cyberpunk Orientation",
        summary: "Land in the 8D city and witness the futuristic skyline.",
        slots: [
            { id: 'd1-1', time: "09:00", icon: Car, changeable: false, defaultActivityId: '', staticTitle: "Neon Skyline Airport Transfer", staticDesc: "Private MPV pickup. Catch your first glimpse of the 'Mountain City'.", staticImage: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=1000" },
            { id: 'd1-2', time: "11:00", icon: Hotel, changeable: false, defaultActivityId: '', staticTitle: "Hotel Check-in", staticDesc: "Cyberpunk Riverside Hotel with panoramic Yangtze views." },
            { id: 'd1-3', time: "14:00", icon: Train, changeable: false, defaultActivityId: '', staticTitle: "Monorail Cliff Ride", staticDesc: "Experience the famous Liziba Station where the train passes through a building.", staticImage: "https://images.unsplash.com/photo-1555126634-323283e090fa?q=80&w=1000" },
            { id: 'd1-4', time: "19:00", icon: Moon, changeable: true, defaultActivityId: 'd1n-walk', options: ALTERNATIVES_DAY1_NIGHT }
        ]
    },
    {
        day: 2,
        title: "Skyline Adventures",
        summary: "From high-altitude bridges to underground bunkers.",
        slots: [
            { id: 'd2-1', time: "09:00", icon: Camera, changeable: false, defaultActivityId: '', staticTitle: "Eling Park Skybridge", staticDesc: "Bird's eye view of the peninsula." },
            { id: 'd2-2', time: "12:00", icon: Utensils, changeable: false, defaultActivityId: '', staticTitle: "Hotpot Lunch", staticDesc: "Authentic 9-grid hotpot. Warning: Spicy!", staticImage: "https://images.unsplash.com/photo-1543886472-a7d03a55c259?q=80&w=1000" },
            { id: 'd2-3', time: "15:00", icon: Camera, changeable: true, defaultActivityId: 'd2a-hongya', options: ALTERNATIVES_DAY2_AFTERNOON },
            { id: 'd2-4', time: "21:00", icon: Train, changeable: false, defaultActivityId: '', staticTitle: "Light-Rail Night Run", staticDesc: "A surreal night ride along the illuminated Jialing River." }
        ]
    },
    {
        day: 3,
        title: "Old Town + Neon Nights",
        summary: "Ancient culture meets futuristic finish.",
        slots: [
            { id: 'd3-1', time: "10:00", icon: Coffee, changeable: false, defaultActivityId: '', staticTitle: "Ciqikou Old Town", staticDesc: "Ming-dynasty architecture and tea houses.", staticImage: "https://images.unsplash.com/photo-1588665792275-23132711d51a?q=80&w=1000" },
            { id: 'd3-2', time: "13:00", icon: Ship, changeable: false, defaultActivityId: '', staticTitle: "River Cruise", staticDesc: "Farewell lunch cruise on the Yangtze." },
            { id: 'd3-3', time: "16:00", icon: Users, changeable: false, defaultActivityId: '', staticTitle: "Free & Easy", staticDesc: "Last minute shopping or relaxation." },
            { id: 'd3-4', time: "19:00", icon: Car, changeable: false, defaultActivityId: '', staticTitle: "Airport Transfer", staticDesc: "Heading home." }
        ]
    }
];

const BASE_PRICE = 880;

// --- ACCORDION COMPONENT ---
const AccordionItem = ({ title, icon: Icon, children, defaultOpen = false }: { title: string, icon: any, children?: React.ReactNode, defaultOpen?: boolean }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm mb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <Icon size={20} className="text-brand-teal" />
                    <h3 className="font-bold text-brand-navy">{title}</h3>
                </div>
                {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 border-t border-gray-100 text-sm text-gray-600 leading-relaxed">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

interface PackageDetailsProps {
    onNavigateBack: () => void;
    onNavigateBooking: () => void;
}

const PackageDetails: React.FC<PackageDetailsProps> = ({ onNavigateBack, onNavigateBooking }) => {
    const [expandedDay, setExpandedDay] = useState<number | null>(1);
    const [selections, setSelections] = useState<Record<string, string>>({
        'd1-4': 'd1n-walk',
        'd2-3': 'd2a-hongya'
    });
    const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
    const [isBookingDrawerOpen, setIsBookingDrawerOpen] = useState(false);

    // --- CALCULATIONS ---

    const totalPrice = useMemo(() => {
        let total = BASE_PRICE;
        RAW_ITINERARY.forEach(day => {
            day.slots.forEach(slot => {
                if (slot.changeable && slot.options) {
                    const selectedId = selections[slot.id];
                    const option = slot.options.find(o => o.id === selectedId);
                    if (option) {
                        total += option.priceChange;
                    }
                }
            });
        });
        return total;
    }, [selections]);

    const relatedTrips = useMemo(() => {
        // Exclude current package ID '1' (Chongqing)
        const others = ALL_PACKAGES.filter(p => p.id !== '1');
        // Simple shuffle
        return others.sort(() => 0.5 - Math.random()).slice(0, 3);
    }, []);

    const handleConfirmSelection = (slotId: string, optionId: string) => {
        setSelections(prev => ({ ...prev, [slotId]: optionId }));
        setEditingSlotId(null);
    };
    const handleCloseModal = () => setEditingSlotId(null);

    const editingSlot = editingSlotId
        ? RAW_ITINERARY.flatMap(d => d.slots).find(s => s.id === editingSlotId)
        : null;

    // Derive day number for modal
    const editingDayNumber = editingSlotId
        ? RAW_ITINERARY.find(d => d.slots.some(s => s.id === editingSlotId))?.day || 1
        : 1;

    const getFormattedTime = (time: string) => {
        const [hrs, mins] = time.split(':').map(Number);
        const suffix = hrs >= 12 ? 'PM' : 'AM';
        const formattedHrs = hrs % 12 || 12;
        return `${formattedHrs}:${mins.toString().padStart(2, '0')} ${suffix}`;
    };

    const BookingCardContent = () => (
        <>
            <div className="text-center mb-6">
                <p className="text-brand-navy font-bold text-sm tracking-widest uppercase">Total Price</p>
                <div className="flex items-center justify-center gap-2 text-brand-navy my-2">
                    <span className="text-4xl lg:text-5xl font-black text-brand-navy">S${totalPrice}</span>
                </div>
                <p className="text-xs text-gray-400 font-bold">per person (NET)</p>
            </div>

            <div className="flex flex-col gap-3">
                {/* 1. Book This Escape */}
                <button
                    onClick={onNavigateBooking}
                    className="w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300 bg-brand-green text-brand-navy hover:bg-[#8cc72b] hover:scale-[1.02]">
                    Book This Escape
                </button>

                {/* 2. Enquire More */}
                <button className="w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300 bg-brand-navy text-brand-green hover:bg-brand-navy/90 hover:text-white hover:scale-[1.02]">
                    <Mail size={20} /> Enquire More
                </button>

                {/* 3. Download Brochure */}
                <button className="w-full py-4 rounded-xl font-bold text-lg shadow-sm flex items-center justify-center gap-2 transition-all duration-300 bg-white border-2 border-brand-navy text-brand-navy hover:bg-gray-50 hover:border-brand-teal">
                    <Download size={20} /> Download Brochure
                </button>
            </div>

            {/* Disclaimer / Info Section */}
            <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
                <div className="flex items-start gap-3 text-xs text-gray-500 leading-relaxed">
                    <CheckCircle2 size={16} className="text-brand-teal mt-0.5 shrink-0" />
                    <span>By booking, you acknowledge that you have read and accepted our Remarks and Terms & Conditions.</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-gray-500 leading-relaxed">
                    <HelpCircle size={16} className="text-brand-teal mt-0.5 shrink-0" />
                    <span>Have specific requirements or questions? Please enquire with us before booking.</span>
                </div>
            </div>
        </>
    );

    return (
        <div className="bg-white min-h-screen pb-20 font-sans">

            {/* 1. HERO SECTION */}
            <div className="relative h-auto min-h-[70vh] md:h-[75vh] bg-brand-navy flex flex-col">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1535025639604-9a804c092faa?q=80&w=1000"
                        alt="Chongqing Cyberpunk"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-brand-navy via-brand-navy/30 to-black/30"></div>
                </div>

                {/* Nav */}
                <div className="relative z-20 px-6 md:px-8 pt-24 md:pt-28">
                    <button
                        onClick={onNavigateBack}
                        className="flex items-center gap-2 text-white hover:text-brand-green transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-full font-medium"
                    >
                        <ArrowLeft size={18} /> Back
                    </button>
                </div>

                {/* Hero Content */}
                <div className="relative z-20 container mx-auto px-4 md:px-8 pb-12 mt-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-full"
                    >
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <span className="bg-brand-coral text-white text-xs font-bold px-3 py-1.5 rounded-full animate-pulse shadow-lg shadow-brand-coral/30">
                                🎉 EARLY-BIRD PROMO
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-none drop-shadow-sm max-w-5xl">
                            Chongqing Cyberpunk<br /><span className="text-transparent bg-clip-text bg-linear-to-r from-brand-green to-teal-200">Weekend Escape</span>
                        </h1>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white border-t border-white/10 pt-6 max-w-4xl">
                            <div>
                                <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Duration</p>
                                <p className="font-bold text-xl flex items-center gap-2"><Calendar size={18} className="text-brand-green" /> 3 Nights</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Location</p>
                                <p className="font-bold text-xl flex items-center gap-2"><MapPin size={18} className="text-brand-green" /> Chongqing</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Style</p>
                                <p className="font-bold text-xl flex items-center gap-2"><Zap size={18} className="text-brand-green" /> Adventure</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Min Pax</p>
                                <p className="font-bold text-xl flex items-center gap-2"><Users size={18} className="text-brand-green" /> 2 To Go</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* 2. MAIN CONTENT GRID */}
            <div className="container mx-auto px-4 md:px-8 py-12">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-12 relative">

                    {/* LEFT COLUMN: ITINERARY (Col-8) */}
                    <div className="xl:col-span-8">
                        <h2 className="text-3xl font-bold text-brand-navy mb-8">Itinerary</h2>

                        <div className="space-y-8">
                            {RAW_ITINERARY.map((day) => (
                                <div key={day.day} className="relative pl-0 md:pl-8">
                                    {/* Day Marker (Desktop Line) */}
                                    <div className="md:absolute left-0 top-0 bottom-0 w-px bg-gray-200 hidden md:block"></div>

                                    {/* Day Badge */}
                                    <div className="md:absolute -left-7.5 top-0 w-16 h-8 bg-brand-green text-brand-navy font-bold text-xs rounded-full flex items-center justify-center border-4 border-white shadow-sm hidden md:flex z-10 uppercase tracking-wide">
                                        Day {day.day}
                                    </div>

                                    {/* Day Card */}
                                    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        {/* Header */}
                                        <div
                                            className="p-6 md:p-8 bg-gray-50/50 cursor-pointer flex justify-between items-center group"
                                            onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                                        >
                                            <div>
                                                <h3 className="text-xl font-bold text-brand-navy mb-1 flex items-center gap-2">
                                                    <span className="md:hidden inline-block bg-brand-green text-brand-navy text-xs font-bold px-3 py-1 rounded-full uppercase">Day {day.day}</span>
                                                    {day.title}
                                                </h3>
                                                <p className="text-gray-500 text-sm">{day.summary}</p>
                                            </div>
                                            <ChevronDown
                                                size={20}
                                                className={`text-gray-400 transition-transform duration-300 ${expandedDay === day.day ? 'rotate-180' : ''}`}
                                            />
                                        </div>

                                        {/* Slots */}
                                        <AnimatePresence>
                                            {expandedDay === day.day && (
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: 'auto' }}
                                                    exit={{ height: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-6 md:p-8 space-y-8">
                                                        {day.slots.map((slot, idx) => {
                                                            const isLast = idx === day.slots.length - 1;
                                                            const selectedOption = slot.changeable && slot.options
                                                                ? slot.options.find(o => o.id === selections[slot.id])
                                                                : null;

                                                            return (
                                                                <div key={slot.id} className="relative flex gap-4 md:gap-6 group">
                                                                    {/* Time Column */}
                                                                    <div className="w-20 pt-1 text-right shrink-0">
                                                                        <span className="block font-bold text-brand-navy text-sm">{getFormattedTime(slot.time)}</span>
                                                                    </div>

                                                                    {/* Timeline Line */}
                                                                    <div className="relative flex flex-col items-center">
                                                                        <div className={`w-3 h-3 rounded-full border-2 z-10 bg-white ${slot.changeable ? 'border-brand-coral' : 'border-gray-300'}`}></div>
                                                                        {!isLast && <div className="grow w-px bg-gray-100 my-1"></div>}
                                                                    </div>

                                                                    {/* Content Column */}
                                                                    <div className="flex-1 pb-2">
                                                                        {slot.changeable && selectedOption ? (
                                                                            // CHANGEABLE SLOT
                                                                            <div
                                                                                onClick={() => setEditingSlotId(slot.id)}
                                                                                className="bg-brand-sand/30 hover:bg-brand-sand/50 rounded-2xl p-4 border border-brand-green/20 cursor-pointer transition-all relative overflow-hidden group/card"
                                                                            >
                                                                                <div className="flex items-start justify-between relative z-10">
                                                                                    <div className="flex gap-4">
                                                                                        <div className="w-16 h-16 rounded-xl bg-gray-200 overflow-hidden shrink-0">
                                                                                            <img src={selectedOption.image} alt="" className="w-full h-full object-cover" />
                                                                                        </div>
                                                                                        <div>
                                                                                            <div className="flex items-center gap-2 mb-1">
                                                                                                <span className="bg-brand-coral text-white text-[10px] font-bold px-1.5 py-0.5 rounded">CUSTOMIZABLE</span>
                                                                                                {selectedOption.priceChange > 0 && <span className="text-[10px] text-gray-500 font-bold">+S${selectedOption.priceChange}</span>}
                                                                                            </div>
                                                                                            <h4 className="font-bold text-brand-navy">{selectedOption.title}</h4>
                                                                                            <p className="text-sm text-gray-500 line-clamp-1">{selectedOption.tagline}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="bg-white/50 p-1.5 rounded-full text-brand-teal group-hover/card:bg-white group-hover/card:scale-110 transition-all">
                                                                                        <Zap size={16} fill="currentColor" />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            // STATIC SLOT
                                                                            <div className="flex gap-4 items-start">
                                                                                <div className="mt-1 p-2 bg-gray-50 rounded-full text-gray-400">
                                                                                    <slot.icon size={16} />
                                                                                </div>
                                                                                <div>
                                                                                    <h4 className="font-bold text-gray-800">{slot.staticTitle}</h4>
                                                                                    <p className="text-sm text-gray-500 leading-relaxed max-w-xl">{slot.staticDesc}</p>
                                                                                    {slot.staticImage && (
                                                                                        <div className="mt-3 rounded-lg overflow-hidden h-32 w-48 shadow-sm">
                                                                                            <img src={slot.staticImage} alt="" className="w-full h-full object-cover" />
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: FIXED SIDEBAR (Col-4) */}
                    <div className="hidden xl:flex xl:col-span-4 flex-col gap-6 sticky top-24 self-start h-fit">

                        {/* Booking Card (Always Visible) */}
                        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-2xl">
                            <BookingCardContent />
                        </div>

                        {/* Other Details (Naturally Flowing Below) */}

                        {/* Inclusions & Exclusions */}
                        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-lg">
                            <h3 className="text-xl font-bold text-brand-navy mb-6">Package Details</h3>

                            <div className="mb-6">
                                <h4 className="text-sm font-bold text-brand-green uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <CheckCircle2 size={16} /> Inclusions
                                </h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2"><div className="w-1 h-1 rounded-full bg-gray-400 mt-2" /> 3 Nights 4-Star Accommodation</li>
                                    <li className="flex items-start gap-2"><div className="w-1 h-1 rounded-full bg-gray-400 mt-2" /> Daily Hotel Breakfast</li>
                                    <li className="flex items-start gap-2"><div className="w-1 h-1 rounded-full bg-gray-400 mt-2" /> Private AC Vehicle for all transfers</li>
                                    <li className="flex items-start gap-2"><div className="w-1 h-1 rounded-full bg-gray-400 mt-2" /> Professional English/Mandarin Guide</li>
                                    <li className="flex items-start gap-2"><div className="w-1 h-1 rounded-full bg-gray-400 mt-2" /> All Entrance Fees as per itinerary</li>
                                    <li className="flex items-start gap-2"><div className="w-1 h-1 rounded-full bg-gray-400 mt-2" /> Guide & Driver Tipping</li>
                                </ul>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <h4 className="text-sm font-bold text-brand-coral uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <XCircle size={16} /> Exclusions
                                </h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2"><div className="w-1 h-1 rounded-full bg-gray-400 mt-2" /> International Air Tickets & Taxes</li>
                                    <li className="flex items-start gap-2"><div className="w-1 h-1 rounded-full bg-gray-400 mt-2" /> Visa Application Fees (if applicable)</li>
                                    <li className="flex items-start gap-2"><div className="w-1 h-1 rounded-full bg-gray-400 mt-2" /> Personal Travel Insurance</li>
                                    <li className="flex items-start gap-2"><div className="w-1 h-1 rounded-full bg-gray-400 mt-2" /> Personal Expenses (Laundry, Mini Bar)</li>
                                    <li className="flex items-start gap-2"><div className="w-1 h-1 rounded-full bg-gray-400 mt-2" /> Optional Tours & Add-ons</li>
                                </ul>
                            </div>
                        </div>

                        {/* FAQ Accordion */}
                        <div>
                            <h3 className="text-xl font-bold text-brand-navy mb-4">Frequently Asked Questions</h3>
                            <AccordionItem title="Do I need a Visa?" icon={HelpCircle}>
                                Visa requirements depend on your nationality. For Singaporeans traveling to China, a 15-day visa-free entry has been reinstated (subject to latest updates). Please check with our consultants for the latest requirements.
                            </AccordionItem>
                            <AccordionItem title="Is Travel Insurance included?" icon={AlertCircle}>
                                No, travel insurance is not included in the base fare. We strongly recommend purchasing comprehensive travel insurance that covers trip cancellation, medical expenses, and COVID-19 related disruptions. We can assist with purchasing this.
                            </AccordionItem>
                            <AccordionItem title="Can I extend my stay?" icon={Calendar}>
                                Absolutely! Since this is a land tour package, you are flexible to book your own flights. If you need us to arrange extra hotel nights, let us know during booking.
                            </AccordionItem>
                        </div>

                        {/* Remarks */}
                        <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                            <h3 className="text-sm font-bold text-brand-navy uppercase tracking-wider mb-4 flex items-center gap-2">
                                <FileText size={16} /> Important Remarks
                            </h3>
                            <ul className="space-y-3 text-xs text-gray-500 leading-relaxed list-disc pl-4">
                                <li>Minimum 10 adults for tour leader to be assigned.</li>
                                <li>Tour confirmation will be finalized no later than two weeks before the departure date.</li>
                                <li>Group tours are conducted in Mandarin, unless otherwise stated.</li>
                                <li>Travellers must ensure that names provided are exactly as how they appear on their passport barcode.</li>
                                <li>Travellers must ensure that their passports are valid for minimum 6 months from return date.</li>
                                <li>All airport/port taxes and fuel surcharges are subject to changes until air tickets are issued.</li>
                                <li>Tour fares do not include visa charges. Travellers must ensure they hold a valid tourist visa to enter the countries on their tour.</li>
                                <li>Tour fares do not include gratuities for tour leader/manager, overseas local guide(s) and driver.</li>
                                <li>An administrative fee may be charged for special requests or additional services.</li>
                                <li>Amendment(s)/cancellation(s) may incur amendment, cancellation and administrative fees.</li>
                                <li>Flight seating arrangement for the group seats are coordinated and assigned by airline and no changes are allowed.</li>
                                <li>Sequence of itinerary may be subject to change due to circumstances beyond the Company’s control.</li>
                                <li>All flight timings are subject to changes.</li>
                            </ul>
                        </div>

                        {/* Terms & Conditions */}
                        <div>
                            <h3 className="text-xl font-bold text-brand-navy mb-4">Terms & Conditions</h3>
                            <div className="bg-white rounded-xl border border-gray-100 p-4 text-xs text-gray-500 space-y-3">
                                <p><strong>Payment:</strong> A deposit of S$500 per person is required upon booking. Full payment must be made 30 days prior to departure.</p>
                                <p><strong>Cancellation Policy:</strong>
                                    <br />•  30 days: S$100 admin fee
                                    <br />• 15-29 days: 50% of tour fare
                                    <br />• 0-14 days: 100% of tour fare
                                </p>
                                <p><strong>Child Policy:</strong> Child with bed is 90% of adult fare. Child without bed is 70% of adult fare.</p>
                                <p><strong>Liability:</strong> Long Vacation acts only as an agent for the transportation companies, hotels, and other principals and shall not be liable for any injury, damage, loss, accident, or delay.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RELATED TRIPS SECTION */}
            <div className="bg-gray-50 py-20 border-t border-gray-200 mt-12">
                <div className="container mx-auto px-4 md:px-8">
                    <h3 className="text-2xl font-bold text-brand-navy mb-8">Other trips you may like</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {relatedTrips.map(trip => (
                            <TripCard
                                key={trip.id}
                                trip={trip}
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* MOBILE BOTTOM BAR (Visible on Tablet/Mobile < xl) */}
            <div className="xl:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-6 z-60 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
                <button
                    onClick={() => setIsBookingDrawerOpen(true)}
                    className="w-full bg-brand-navy text-white font-bold py-3 rounded-full hover:bg-brand-teal transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                    <span className="text-brand-green">S${totalPrice}</span> • Book Trip
                </button>
            </div>

            {/* MOBILE BOOKING DRAWER */}
            <AnimatePresence>
                {isBookingDrawerOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsBookingDrawerOpen(false)}
                            className="fixed inset-0 bg-black/50 z-70 xl:hidden backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 bg-white z-80 xl:hidden rounded-t-3xl shadow-2xl h-[65vh] flex flex-col"
                        >
                            <div className="w-full flex justify-center pt-3 pb-1" onClick={() => setIsBookingDrawerOpen(false)}>
                                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                            </div>

                            <div className="p-6 flex-1 overflow-y-auto">
                                <BookingCardContent />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* MODAL */}
            <AnimatePresence>
                {editingSlot && editingSlotId && (
                    <ActivityCustomizationModal
                        isOpen={!!editingSlotId}
                        onClose={handleCloseModal}
                        slot={editingSlot}
                        dayNumber={editingDayNumber}
                        currentSelectionId={selections[editingSlotId] || ''}
                        onConfirm={handleConfirmSelection}
                    />
                )}
            </AnimatePresence>

        </div>
    );
};

export default PackageDetails;
