
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, Anchor, MapPin, Calendar, Users, Waves, Coffee, Utensils, Wifi, Sun, Moon, CheckCircle2, ChevronDown, ChevronUp, Star, Mail, Download, Ship, ArrowRight
} from 'lucide-react';
import { CRUISES } from '../UI/constants';

interface CruisePackageDetailsProps {
    onNavigateBack: () => void;
}

const CABINS = [
    {
        id: 'interior',
        name: 'Interior Stateroom',
        desc: 'Cozy and budget-friendly. Perfect if you plan to spend most of your time exploring the ship.',
        size: '13-15 sqm',
        price: 459,
        features: ['Two twin beds (convertible)', 'Private Bathroom', '24h Room Service', 'Interactive TV'],
        image: 'https://images.unsplash.com/photo-1595867160753-48b4380dd725?q=80&w=800'
    },
    {
        id: 'balcony',
        name: 'Oceanview Balcony',
        desc: 'Wake up to a new view every day. Your private sanctuary with fresh sea breeze.',
        size: '18-20 sqm',
        price: 780,
        features: ['Private Balcony', 'Sitting Area', 'Floor-to-ceiling sliding glass doors', 'Vanity Area'],
        image: 'https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=800'
    },
    {
        id: 'suite',
        name: 'Palace Suite',
        desc: 'The ultimate luxury experience. Includes butler service and exclusive access to private pool areas.',
        size: '35-40 sqm',
        price: 1888,
        features: ['Butler Service', 'Private Pool Access', 'Premium Beverage Package', 'Priority Boarding'],
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=800'
    }
];

const ITINERARY = [
    { day: 1, port: 'Singapore', arrive: '-', depart: '17:00', activity: 'Embarkation. Buffet lunch opens at 12pm. Welcome party on pool deck.' },
    { day: 2, port: 'Penang (George Town)', arrive: '15:00', depart: '23:00', activity: 'Explore street art and hawker food. Optional shore excursion available.' },
    { day: 3, port: 'High Seas', arrive: '-', depart: '-', activity: 'Full day at sea. Enjoy the waterslide park, casino, and gala dinner.' },
    { day: 4, port: 'Singapore', arrive: '08:00', depart: '-', activity: 'Disembarkation after breakfast.' },
];

const CruisePackageDetails: React.FC<CruisePackageDetailsProps> = ({ onNavigateBack }) => {
    const [selectedCabin, setSelectedCabin] = useState('interior');
    const [expandedDay, setExpandedDay] = useState<number | null>(1);
    const [isBookingDrawerOpen, setIsBookingDrawerOpen] = useState(false);

    const activeCabin = CABINS.find(c => c.id === selectedCabin) || CABINS[0];

    const relatedCruises = useMemo(() => {
        // Exclude current cruise (assume 'c1' as placeholder logic)
        return CRUISES.filter(c => c.id !== 'c1').sort(() => 0.5 - Math.random()).slice(0, 3);
    }, []);

    const BookingCardContent = () => (
        <>
            <div className="text-center mb-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Price</p>
                <div className="text-4xl font-black text-brand-navy my-2">S${activeCabin.price}</div>
                <p className="text-xs text-gray-400">per person (before port taxes)</p>
            </div>
            
            <button className="w-full bg-brand-teal text-white font-bold py-4 rounded-xl shadow-lg hover:bg-brand-navy hover:scale-[1.02] transition-all mb-4">
                Book This Cabin
            </button>
            <button className="w-full bg-white text-brand-navy border-2 border-brand-navy font-bold py-4 rounded-xl hover:bg-gray-50 transition-all">
                Request Quote
            </button>

            <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Utensils size={18} className="text-brand-coral"/>
                    <span>All meals included (Buffet & Dining Room)</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Star size={18} className="text-brand-coral"/>
                    <span>World-class entertainment shows</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Wifi size={18} className="text-gray-400"/>
                    <span className="text-gray-400 line-through">Wi-Fi Package (Add-on)</span>
                </div>
            </div>
        </>
    );

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* 1. HERO SECTION (Ship Focus) */}
            <div className="relative h-[60vh] bg-brand-navy">
                <img 
                    src="https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=2000" 
                    alt="Genting Dream" 
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-linear-to-t from-brand-navy via-brand-navy/40 to-transparent" />
                
                <div className="absolute top-24 left-0 right-0 px-6 z-20">
                    <button 
                        onClick={onNavigateBack}
                        className="flex items-center gap-2 text-white bg-black/20 hover:bg-brand-teal backdrop-blur-md px-4 py-2 rounded-full font-medium transition-colors"
                    >
                        <ArrowLeft size={18} /> Back to Cruises
                    </button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20 pb-20">
                    <div className="container mx-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                             <div className="flex items-center gap-2 text-brand-teal font-bold uppercase tracking-widest text-sm mb-2">
                                <Anchor size={18} /> 4 Days 3 Nights
                             </div>
                             <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                                Genting Dream Getaway
                             </h1>
                             <p className="text-xl text-gray-200 flex items-center gap-2">
                                <MapPin size={20} /> Singapore • Penang • Singapore
                             </p>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 mt-6 relative z-30">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                    
                    {/* LEFT COLUMN */}
                    <div className="xl:col-span-8 space-y-12">
                        
                        {/* CABIN SELECTION */}
                        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                             <h2 className="text-2xl font-bold text-brand-navy mb-6 flex items-center gap-2">
                                <Sun size={24} className="text-brand-teal" /> Select Your Stateroom
                             </h2>
                             
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                {CABINS.map(cabin => (
                                    <button
                                        key={cabin.id}
                                        onClick={() => setSelectedCabin(cabin.id)}
                                        className={`rounded-2xl p-4 border-2 text-left transition-all ${
                                            selectedCabin === cabin.id 
                                            ? 'border-brand-teal bg-brand-teal/5 shadow-md' 
                                            : 'border-gray-100 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="font-bold text-brand-navy mb-1">{cabin.name}</div>
                                        <div className="text-brand-teal font-black text-lg">S${cabin.price}</div>
                                        <div className="text-xs text-gray-400">per pax</div>
                                    </button>
                                ))}
                             </div>

                             {/* Active Cabin Details */}
                             <motion.div 
                                key={selectedCabin}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex flex-col md:flex-row gap-6 bg-gray-50 rounded-2xl p-6 border border-gray-100"
                             >
                                <div className="w-full md:w-1/2 h-48 rounded-xl overflow-hidden shrink-0">
                                    <img src={activeCabin.image} alt={activeCabin.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-brand-navy mb-2">{activeCabin.name}</h3>
                                    <p className="text-sm text-gray-600 mb-4">{activeCabin.desc}</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {activeCabin.features.map(feat => (
                                            <div key={feat} className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                                <CheckCircle2 size={14} className="text-brand-green" /> {feat}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                                        <span className="text-xs font-bold uppercase text-gray-400">Size: {activeCabin.size}</span>
                                        <span className="text-brand-navy font-black text-xl">S${activeCabin.price}</span>
                                    </div>
                                </div>
                             </motion.div>
                        </div>

                        {/* ITINERARY */}
                        <div>
                            <h2 className="text-2xl font-bold text-brand-navy mb-6 flex items-center gap-2">
                                <MapPin size={24} className="text-brand-teal" /> Voyage Itinerary
                            </h2>
                            <div className="space-y-4">
                                {ITINERARY.map(item => (
                                    <div key={item.day} className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                                        <button 
                                            onClick={() => setExpandedDay(expandedDay === item.day ? null : item.day)}
                                            className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="bg-brand-navy text-white text-xs font-bold px-3 py-1 rounded-full uppercase">Day {item.day}</div>
                                                <div className="font-bold text-lg text-brand-navy">{item.port}</div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-xs text-gray-500 hidden md:block">
                                                    {item.arrive !== '-' && `Arrive: ${item.arrive}`}
                                                    {item.arrive !== '-' && item.depart !== '-' && ' | '}
                                                    {item.depart !== '-' && `Depart: ${item.depart}`}
                                                </div>
                                                {expandedDay === item.day ? <ChevronUp size={20} className="text-gray-400"/> : <ChevronDown size={20} className="text-gray-400"/>}
                                            </div>
                                        </button>
                                        {expandedDay === item.day && (
                                            <div className="px-6 pb-6 pt-0 text-gray-600 text-sm pl-20 border-t border-gray-50">
                                                <div className="pt-4 flex gap-3">
                                                    <Waves size={16} className="text-brand-teal mt-0.5 shrink-0" />
                                                    {item.activity}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: FIXED SIDEBAR (Col-4) */}
                    <div className="hidden xl:flex xl:col-span-4 flex-col gap-6 sticky top-24 self-start h-fit">
                        
                        {/* Booking Card */}
                        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-2xl">
                            <BookingCardContent />
                        </div>
                    </div>

                </div>
            </div>

            {/* RELATED VOYAGES SECTION */}
            <div className="bg-gray-50 py-20 border-t border-gray-200 mt-12">
                <div className="container mx-auto px-4 md:px-8">
                    <h3 className="text-2xl font-bold text-brand-navy mb-8">Other Voyages you may like</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {relatedCruises.map((cruise) => (
                            <div 
                                key={cruise.id}
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer border border-gray-100 flex flex-col h-full"
                            >
                                <div className="h-64 overflow-hidden relative">
                                    <img 
                                        src={cruise.image} 
                                        alt={cruise.title} 
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-brand-navy text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                                        <Ship size={12} className="text-brand-teal" /> {cruise.ship}
                                    </div>
                                </div>
                                
                                <div className="p-6 flex flex-col grow">
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-2">
                                         <Calendar size={12} /> {cruise.departure} • {cruise.nights} Nights
                                    </div>
                                    <h3 className="text-xl font-bold text-brand-navy mb-3 group-hover:text-brand-teal transition-colors leading-tight">
                                        {cruise.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-6 grow">{cruise.route}</p>
                                    
                                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase block">From</span>
                                            <span className="text-xl font-black text-brand-navy">{cruise.price}</span>
                                        </div>
                                        <span className="w-10 h-10 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-colors">
                                            <ArrowRight size={20} />
                                        </span>
                                    </div>
                                </div>
                            </div>
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
                    <span className="text-brand-green">S${activeCabin.price}</span> • Book Cabin
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
                            className="fixed bottom-0 left-0 right-0 bg-white z-80 xl:hidden rounded-t-3xl shadow-2xl h-[50vh] flex flex-col"
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
        </div>
    );
};

export default CruisePackageDetails;
