
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Anchor, MapPin, Calendar, Users, Ship, ChevronRight, ChevronDown, Waves, Filter, X, Clock } from 'lucide-react';
import { CRUISES } from '../UI/constants';

interface CruiseProps {
    onCruiseClick: (id: string) => void;
}

// Reusable Custom Dropdown Component
interface CustomDropdownProps {
    value: string;
    onChange: (val: string) => void;
    options: string[];
    icon: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
    placeholder?: string;
    customLabel?: (opt: string) => string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ value, onChange, options, icon, isOpen, onToggle, placeholder, customLabel }) => {
    return (
        <div className="relative w-full">
            <button
                onClick={onToggle}
                className={`w-full text-left py-3 px-5 pl-12 pr-10 rounded-xl border flex items-center justify-between transition-all bg-white ${
                    isOpen ? 'border-brand-teal ring-1 ring-brand-teal' : 'border-gray-200 hover:border-brand-teal/50'
                }`}
            >
                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-teal">
                    {icon}
                </div>
                <span className="truncate text-sm font-bold text-brand-navy">
                    {placeholder ? (value === 'All' ? placeholder : value) : (customLabel ? customLabel(value) : value)}
                </span>
                <ChevronDown size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-60 max-h-60 overflow-y-auto custom-scrollbar"
                    >
                        <ul className="py-2">
                            {options.map((option) => (
                                <li key={option}>
                                    <button
                                        onClick={() => onChange(option)}
                                        className="w-full text-left px-5 py-3 hover:bg-brand-sand/30 flex items-center justify-between group transition-colors"
                                    >
                                        <span className={`font-medium text-sm ${value === option ? 'text-brand-navy' : 'text-gray-600'}`}>
                                            {customLabel ? customLabel(option) : option}
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

const Cruise: React.FC<CruiseProps> = ({ onCruiseClick }) => {
    // Primary Filter (Tab/Pill)
    const [filterShip, setFilterShip] = useState('All');
    
    // Secondary Filters
    const [filterMonth, setFilterMonth] = useState('All');
    const [filterDuration, setFilterDuration] = useState('All');

    // Dropdown state
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const filterContainerRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterContainerRef.current && !filterContainerRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Extract unique values
    const ships = useMemo(() => ['All', ...Array.from(new Set(CRUISES.map(c => c.ship)))], []);
    
    // Hardcoded for prototype demo
    const months = ['All', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
    const durations = ['All', 'Short (2-3 Nights)', 'Medium (4-5 Nights)', 'Long (6+ Nights)'];

    const filteredCruises = CRUISES.filter(c => {
        const matchesShip = filterShip === 'All' || c.ship === filterShip;
        
        // Mock logic for month filter since data is static strings like "Fri, 12 Oct"
        const matchesMonth = filterMonth === 'All' || c.departure.includes(filterMonth);
        
        let matchesDuration = true;
        if (filterDuration !== 'All') {
            if (filterDuration.includes('Short')) matchesDuration = c.nights <= 3;
            else if (filterDuration.includes('Medium')) matchesDuration = c.nights >= 4 && c.nights <= 5;
            else if (filterDuration.includes('Long')) matchesDuration = c.nights >= 6;
        }

        return matchesShip && matchesMonth && matchesDuration;
    });

    const activeFilterCount = (filterShip !== 'All' ? 1 : 0) + (filterMonth !== 'All' ? 1 : 0) + (filterDuration !== 'All' ? 1 : 0);

    const clearFilters = () => {
        setFilterShip('All');
        setFilterMonth('All');
        setFilterDuration('All');
    };

    return (
        <div className="bg-white min-h-screen">
            {/* HERO SECTION */}
            <div className="relative h-[60vh] bg-brand-navy flex items-center justify-center overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1506429676774-a7407a4190cb?q=80&w=2000" 
                    alt="Cruise Ship" 
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-40"
                />
                <div className="absolute inset-0 bg-linear-to-t from-brand-navy via-brand-navy/40 to-black/20" />
                
                <div className="relative z-10 text-center px-4 pt-10 max-w-4xl">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center justify-center gap-2 mb-4 text-brand-green">
                             <Anchor size={24} />
                             <span className="font-bold uppercase tracking-widest text-sm">Set Sail</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-xl">
                            The Ocean is Calling.
                        </h1>
                        <p className="text-gray-100 text-lg md:text-xl max-w-2xl mx-auto font-medium drop-shadow-md">
                           Unpack once, explore everywhere. Discover our curated voyages from Singapore.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* FILTER & LIST SECTION */}
            <div className="container mx-auto px-4 md:px-8 py-12">
                
                {/* Enhanced Filters */}
                <div className="mb-12 space-y-4 md:space-y-6" ref={filterContainerRef}>
                    
                    {/* Level 1: Primary Ship Filter */}
                    
                    {/* Mobile/Tablet: Dropdown (Collapsed View) */}
                    <div className="xl:hidden relative">
                         <CustomDropdown
                            value={filterShip}
                            onChange={(val) => { setFilterShip(val); setActiveDropdown(null); }}
                            options={ships}
                            icon={<Ship size={18} />}
                            isOpen={activeDropdown === 'ship'}
                            onToggle={() => setActiveDropdown(activeDropdown === 'ship' ? null : 'ship')}
                            customLabel={(val) => val === 'All' ? 'All Cruise Lines' : val}
                        />
                    </div>

                    {/* Desktop: Pills (Visible only on xl screens) */}
                    <div className="hidden xl:block w-full overflow-x-auto no-scrollbar pb-4">
                         <div className="flex items-center gap-3 justify-center">
                            {ships.map((brand) => (
                                <button
                                    key={brand}
                                    onClick={() => setFilterShip(brand)}
                                    className={`px-6 py-3 rounded-full text-sm font-bold transition-all border whitespace-nowrap ${
                                        filterShip === brand 
                                        ? 'bg-brand-navy text-brand-green border-brand-navy shadow-lg scale-105' 
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-brand-teal hover:text-brand-teal'
                                    }`}
                                >
                                    {brand === 'All' ? 'All Cruise Lines' : brand}
                                </button>
                            ))}
                         </div>
                    </div>

                    {/* Level 2: Secondary Filters (Bar) */}
                    <div className="bg-gray-50 rounded-2xl p-4 md:p-6 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                         
                         <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                             {/* Duration Filter */}
                             <div className="w-full md:w-64">
                                <CustomDropdown
                                    value={filterDuration}
                                    onChange={(val) => { setFilterDuration(val); setActiveDropdown(null); }}
                                    options={durations}
                                    icon={<Clock size={18} />}
                                    isOpen={activeDropdown === 'duration'}
                                    onToggle={() => setActiveDropdown(activeDropdown === 'duration' ? null : 'duration')}
                                />
                             </div>

                             {/* Month Filter */}
                             <div className="w-full md:w-48">
                                <CustomDropdown
                                    value={filterMonth}
                                    onChange={(val) => { setFilterMonth(val); setActiveDropdown(null); }}
                                    options={months}
                                    icon={<Calendar size={18} />}
                                    isOpen={activeDropdown === 'month'}
                                    onToggle={() => setActiveDropdown(activeDropdown === 'month' ? null : 'month')}
                                    customLabel={(val) => val === 'All' ? 'Any Month' : val}
                                />
                             </div>
                         </div>

                         {/* Results Count & Clear */}
                         <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                             <span className="text-sm font-bold text-gray-400">{filteredCruises.length} Voyages Found</span>
                             {activeFilterCount > 0 && (
                                <button 
                                    onClick={clearFilters}
                                    className="text-sm font-bold text-brand-coral flex items-center gap-1 hover:underline"
                                >
                                    <X size={16} /> Clear
                                </button>
                             )}
                         </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {filteredCruises.length > 0 ? (
                        filteredCruises.map((cruise) => (
                            <motion.div 
                                key={cruise.id}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
                                onClick={() => onCruiseClick(cruise.id)}
                            >
                                <div className="flex flex-col md:flex-row h-full">
                                    {/* Image Section */}
                                    <div className="w-full md:w-2/5 h-64 md:h-auto relative overflow-hidden">
                                        <img 
                                            src={cruise.image} 
                                            alt={cruise.title} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                        />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-brand-navy px-3 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                                            <Ship size={14} className="text-brand-teal"/> {cruise.ship}
                                        </div>
                                        <div className="absolute bottom-4 left-4 flex gap-2">
                                            {cruise.tags.map(tag => (
                                                <span key={tag} className="bg-brand-navy/90 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-8 md:p-10 flex-1 flex flex-col justify-center relative">
                                        {/* Watermark bg */}
                                        <Waves className="absolute -right-5 -bottom-5 text-gray-50 opacity-50 w-64 h-64 pointer-events-none" />

                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex flex-col">
                                                <span className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                                                    <Calendar size={12}/> {cruise.departure} • {cruise.nights} Nights
                                                </span>
                                                <h3 className="text-2xl md:text-3xl font-bold text-brand-navy group-hover:text-brand-teal transition-colors">
                                                    {cruise.title}
                                                </h3>
                                            </div>
                                            <div className="text-right hidden md:block">
                                                <span className="block text-gray-400 text-xs font-bold uppercase">From</span>
                                                <span className="block text-3xl font-black text-brand-navy">{cruise.price}</span>
                                                <span className="block text-gray-400 text-[10px]">Per Pax</span>
                                            </div>
                                        </div>

                                        {/* Route Visualizer */}
                                        <div className="my-6 relative z-10">
                                            <div className="flex items-center gap-4 text-sm font-medium text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                <MapPin size={18} className="text-brand-teal shrink-0" />
                                                {cruise.route}
                                            </div>
                                        </div>

                                        <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-100">
                                            <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                                                <Users size={16} /> 2 To Go
                                            </div>
                                            
                                            <div className="flex items-center gap-4">
                                                <div className="text-right md:hidden">
                                                    <span className="block text-2xl font-black text-brand-navy">{cruise.price}</span>
                                                </div>
                                                <button className="bg-brand-teal text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-brand-navy transition-colors flex items-center gap-2">
                                                    View Cabins <ChevronRight size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                            <p className="text-gray-500 font-medium">No cruises found matching your filters.</p>
                            <button onClick={clearFilters} className="text-brand-teal font-bold mt-2 hover:underline">Reset Filters</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cruise;
