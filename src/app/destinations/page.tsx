'use client'
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ALL_PACKAGES } from '../../components/UI/constants';
import TripCard from '../../components/UI/TripCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, ChevronUp, ArrowUpDown, Check } from 'lucide-react';
import { SearchCriteria } from '../../../types';

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

// --- HELPERS & CONSTANTS ---

// 1. DATA MAPPING HELPERS
const getPriceVal = (priceStr: string) => parseInt(priceStr.replace(/[^0-9]/g, ''));

const getDurationNights = (tags: string[]) => {
  const nightTag = tags.find(t => t.toLowerCase().includes('night'));
  if (!nightTag) return 0;
  return parseInt(nightTag.replace(/[^0-9]/g, ''));
};

const getLocationDetails = (locStr: string) => {
  const parts = locStr.split('•').map(s => s.trim());
  const part1 = parts[0];
  const part2 = parts[1] || '';

  let region = 'Asia'; 
  let country = part1;
  let city = part2;

  // Refined Logic for accurate Region/Country/City mapping
  if (['Europe', 'Middle East'].includes(part1)) {
    region = part1;
    country = part2; // In this data format, the "country" slot takes the second part (e.g., Switzerland)
    city = ''; 
  } else if (part1 === 'Australia') {
      region = 'Oceania';
      country = 'Australia';
      city = part2;
  } else if (['China', 'Japan', 'Korea', 'Taiwan', 'Hong Kong', 'Macau'].includes(part1)) {
      region = 'East Asia';
  } else if (['Indonesia', 'Thailand', 'Vietnam', 'Singapore', 'Malaysia', 'Philippines', 'Cambodia', 'Laos', 'Myanmar'].includes(part1)) {
      region = 'Southeast Asia';
  } else if (['Maldives', 'India', 'Sri Lanka'].includes(part1)) {
      region = 'South Asia';
  }

  return { region, country, city };
};

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
    <div className="border-b border-gray-100 py-5">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center justify-between w-full mb-3 group"
      >
        <h4 className="font-bold text-brand-navy group-hover:text-[#0b4f4a] transition-colors">{title}</h4>
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
                    isOpen ? 'border-[#0b4f4a] ring-1 ring-[#0b4f4a]' : 'border-gray-200 hover:border-[#0b4f4a]/50'
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


interface DestinationsProps {
    onTripClick?: () => void;
    searchCriteria?: SearchCriteria | null;
}

const Destinations: React.FC<DestinationsProps> = ({ onTripClick, searchCriteria }) => {
  const router = useRouter();
  
  const handleTripClick = () => {
    router.push('/package-details');
  };

  // --- STATE ---
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const itemsPerPage = 9;

  // Filters
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  
  // Custom Dropdown State
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

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

  // Price Filter (Buffered)
  const [priceRange, setPriceRange] = useState<{min: string, max: string}>({ min: '', max: '' }); // Active Filter
  const [localPriceRange, setLocalPriceRange] = useState<{min: string, max: string}>({ min: '', max: '' }); // Input State
  
  // Sorting
  const [sortBy, setSortBy] = useState<string>('popular');
  const [isSortOpen, setIsSortOpen] = useState(false);

  // --- DERIVED DATA ---
  const availableLocations = useMemo(() => {
    const data = ALL_PACKAGES.map(p => getLocationDetails(p.location));
    
    // Filter Countries: Show countries belonging to the selected Region (or all if no region)
    const countries = Array.from(new Set(
      data.filter(d => !selectedRegion || d.region === selectedRegion).map(d => d.country)
    )).sort();

    // Filter Cities: Show cities belonging to the selected Region AND selected Country
    const cities = Array.from(new Set(
      data.filter(d => 
        (!selectedRegion || d.region === selectedRegion) && 
        (!selectedCountry || d.country === selectedCountry) && 
        d.city
      ).map(d => d.city)
    )).sort();

    return { countries, cities };
  }, [selectedRegion, selectedCountry]);


  // --- FILTERING LOGIC ---
  const filteredAndSortedPackages = useMemo(() => {
    let result = ALL_PACKAGES.filter(pkg => {
      const { region, country, city } = getLocationDetails(pkg.location);
      const price = getPriceVal(pkg.price);
      const nights = getDurationNights(pkg.tags);

      // 1. Location
      if (selectedRegion && region !== selectedRegion) return false;
      if (selectedCountry && country !== selectedCountry) return false;
      if (selectedCity && city !== selectedCity) return false;

      // 2. Duration
      if (selectedDurations.length > 0) {
        const matchesDuration = selectedDurations.some(label => {
          const range = DURATION_RANGES.find(r => r.label === label);
          return range && nights >= range.minNights && nights <= range.maxNights;
        });
        if (!matchesDuration) return false;
      }

      // 3. Style
      if (selectedStyles.length > 0) {
        const hasStyle = pkg.tags.some(t => selectedStyles.some(s => t.toLowerCase().includes(s.toLowerCase())));
        if (!hasStyle) return false;
      }

      // 4. Price
      if (priceRange.min && price < parseInt(priceRange.min)) return false;
      if (priceRange.max && price > parseInt(priceRange.max)) return false;

      return true;
    });

    // --- SORTING ---
    result = [...result]; 
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => getPriceVal(a.price) - getPriceVal(b.price));
        break;
      case 'price_desc':
        result.sort((a, b) => getPriceVal(b.price) - getPriceVal(a.price));
        break;
      case 'newest':
        result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      case 'popular':
      default:
        result.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        break;
    }

    return result;
  }, [selectedRegion, selectedCountry, selectedCity, selectedDurations, selectedStyles, priceRange, sortBy]);


  // --- SEARCH EFFECT ---
  useEffect(() => {
    if (searchCriteria) {
        // Reset Logic
        setSelectedRegion('');
        setSelectedDurations([]);
        setSelectedStyles([]);
        setPriceRange({ min: '', max: '' });
        setLocalPriceRange({ min: '', max: '' });
        
        // Country Logic
        // We need to find the proper Case for the country string
        // Get all unique countries from ALL_PACKAGES
        const allLocs = ALL_PACKAGES.map(p => getLocationDetails(p.location));
        const uniqueCountries = Array.from(new Set(allLocs.map(l => l.country)));
        
        const matchingCountry = uniqueCountries.find(c => c.toLowerCase() === searchCriteria.destination.toLowerCase());
        setSelectedCountry(matchingCountry || '');

        // City Logic
        if (searchCriteria.city) {
            const uniqueCities = Array.from(new Set(allLocs.map(l => l.city)));
            const matchingCity = uniqueCities.find(c => c.toLowerCase() === searchCriteria.city.toLowerCase());
            setSelectedCity(matchingCity || '');
        } else {
            setSelectedCity('');
        }

        // Trip Type Logic
        if (searchCriteria.tripType) {
             if (searchCriteria.tripType === 'weekend') {
                setSelectedDurations(['Weekend (1-3 Days)']);
             } else if (searchCriteria.tripType === 'culture') {
                setSelectedStyles(['Culture']);
             } else if (searchCriteria.tripType === 'family') {
                setSelectedStyles(['Family']);
             } else if (searchCriteria.tripType === 'cruise') {
                // map to nature/luxury approx
                setSelectedStyles(['Luxury']); 
             }
        }
    }
  }, [searchCriteria]); 

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(filteredAndSortedPackages.length / itemsPerPage);
  const currentData = filteredAndSortedPackages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
    setDirection('right');
  }, [selectedRegion, selectedCountry, selectedCity, selectedDurations, selectedStyles, priceRange, sortBy]);

  const handlePageChange = (p: number) => {
    if (p >= 1 && p <= totalPages) {
      setDirection(p > currentPage ? 'right' : 'left');
      setCurrentPage(p);
      window.scrollTo({ top: 400, behavior: 'smooth' }); // Scroll to top of grid, not top of page
    }
  };

  const clearFilters = () => {
    setSelectedRegion('');
    setSelectedCountry('');
    setSelectedCity('');
    setSelectedDurations([]);
    setSelectedStyles([]);
    setPriceRange({ min: '', max: '' });
    setLocalPriceRange({ min: '', max: '' });
  };

  const applyPriceFilter = () => {
    setPriceRange(localPriceRange);
  };

  const handlePriceKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        applyPriceFilter();
    }
  };

  const sidebarContent = (
    <div className="space-y-1" ref={sidebarRef}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold text-brand-navy">Filters</h3>
        <button onClick={clearFilters} className="text-sm text-[#0b4f4a] font-semibold hover:underline">Reset All</button>
      </div>

      {/* 1. REGION */}
      <FilterSection title="Region">
        <CustomDropdown
            label="Region"
            options={REGIONS}
            value={selectedRegion}
            placeholder="All Regions"
            isOpen={activeDropdown === 'region'}
            onToggle={() => setActiveDropdown(activeDropdown === 'region' ? null : 'region')}
            onChange={(val) => { 
                setSelectedRegion(val); 
                setSelectedCountry(''); 
                setSelectedCity(''); 
                setActiveDropdown(null);
            }}
        />
      </FilterSection>

      {/* 2. COUNTRY */}
      <FilterSection title="Country">
         <CustomDropdown
            label="Country"
            options={availableLocations.countries}
            value={selectedCountry}
            placeholder="All Countries"
            isOpen={activeDropdown === 'country'}
            onToggle={() => setActiveDropdown(activeDropdown === 'country' ? null : 'country')}
            onChange={(val) => { 
                setSelectedCountry(val); 
                setSelectedCity(''); 
                setActiveDropdown(null);
            }}
            disabled={availableLocations.countries.length === 0}
        />
      </FilterSection>

      {/* 3. CITY */}
      <FilterSection title="City">
        <CustomDropdown
            label="City"
            options={availableLocations.cities}
            value={selectedCity}
            placeholder="All Cities"
            isOpen={activeDropdown === 'city'}
            onToggle={() => setActiveDropdown(activeDropdown === 'city' ? null : 'city')}
            onChange={(val) => { 
                setSelectedCity(val);
                setActiveDropdown(null);
            }}
            disabled={availableLocations.cities.length === 0}
        />
      </FilterSection>

      {/* 4. DURATION */}
      <FilterSection title="Duration">
        <div className="space-y-2">
          {DURATION_RANGES.map((range) => (
            <label key={range.label} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedDurations.includes(range.label) ? 'bg-[#0b4f4a] border-[#0b4f4a]' : 'border-gray-300 bg-white group-hover:border-[#0b4f4a]'}`}>
                 {selectedDurations.includes(range.label) && <Check size={12} className="text-white" />}
              </div>
              <input 
                type="checkbox" 
                className="hidden"
                checked={selectedDurations.includes(range.label)}
                onChange={() => {
                  if (selectedDurations.includes(range.label)) {
                    setSelectedDurations(selectedDurations.filter(d => d !== range.label));
                  } else {
                    setSelectedDurations([...selectedDurations, range.label]);
                  }
                }}
              />
              <span className="text-sm text-gray-600 group-hover:text-brand-navy transition-colors">{range.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* 5. TRAVEL STYLE */}
      <FilterSection title="Travel Style">
        <div className="grid grid-cols-2 gap-2">
           {TRAVEL_STYLES.map((style) => (
             <label key={style} className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedStyles.includes(style) ? 'bg-[#0b4f4a] border-[#0b4f4a]' : 'border-gray-300 bg-white group-hover:border-[#0b4f4a]'}`}>
                   {selectedStyles.includes(style) && <Check size={10} className="text-white" />}
                </div>
                <input 
                  type="checkbox" 
                  className="hidden"
                  checked={selectedStyles.includes(style)}
                  onChange={() => {
                    if (selectedStyles.includes(style)) {
                      setSelectedStyles(selectedStyles.filter(s => s !== style));
                    } else {
                      setSelectedStyles([...selectedStyles, style]);
                    }
                  }}
                />
                <span className="text-sm text-gray-600 group-hover:text-brand-navy transition-colors">{style}</span>
             </label>
           ))}
        </div>
      </FilterSection>

      {/* 6. PRICE */}
      <FilterSection title="Price Range (S$)">
         <div className="flex items-center gap-3">
            <input 
              type="number" 
              placeholder="Min" 
              value={localPriceRange.min}
              onChange={(e) => setLocalPriceRange({ ...localPriceRange, min: e.target.value })}
              onBlur={applyPriceFilter}
              onKeyDown={handlePriceKeyDown}
              className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold text-brand-navy focus:outline-none focus:border-[#0b4f4a] focus:ring-1 focus:ring-[#0b4f4a] placeholder:text-gray-400 placeholder:font-normal"
            />
            <span className="text-gray-400 font-bold">-</span>
            <input 
              type="number" 
              placeholder="Max" 
              value={localPriceRange.max}
              onChange={(e) => setLocalPriceRange({ ...localPriceRange, max: e.target.value })}
              onBlur={applyPriceFilter}
              onKeyDown={handlePriceKeyDown}
              className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold text-brand-navy focus:outline-none focus:border-[#0b4f4a] focus:ring-1 focus:ring-[#0b4f4a] placeholder:text-gray-400 placeholder:font-normal"
            />
         </div>
      </FilterSection>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
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
              <span className="text-brand-green">Destinations</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* MOBILE FILTER & SORT BAR */}
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex divide-x divide-gray-200">
          <button 
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex-1 py-4 flex items-center justify-center gap-2 font-bold text-brand-navy active:bg-gray-50 transition-colors"
          >
            <Filter size={18} /> Filters
          </button>
          <button 
            onClick={() => setIsMobileSortOpen(true)}
            className="flex-1 py-4 flex items-center justify-center gap-2 font-bold text-brand-navy active:bg-gray-50 transition-colors"
          >
            <ArrowUpDown size={18} /> Sort
          </button>
        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-full sm:w-100 bg-white z-60 lg:hidden shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
                <h2 className="text-lg font-bold text-brand-navy">Filters</h2>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {sidebarContent}
              </div>
              <div className="p-4 border-t border-gray-100 bg-white">
                <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full bg-brand-green text-brand-navy font-bold py-3 rounded-xl shadow-lg hover:bg-[#8cc72b] transition-colors"
                >
                  Show Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MOBILE SORT DRAWER */}
      <AnimatePresence>
        {isMobileSortOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSortOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white z-60 lg:hidden rounded-t-3xl shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-xl text-brand-navy">Sort By</h3>
                 <button onClick={() => setIsMobileSortOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-500">
                    <X size={20}/>
                 </button>
              </div>
              <div className="space-y-2 mb-4">
                  {SORT_OPTIONS.map(opt => (
                     <button 
                        key={opt.value}
                        onClick={() => { setSortBy(opt.value); setIsMobileSortOpen(false); }}
                        className={`w-full text-left p-4 rounded-xl font-medium flex justify-between items-center transition-colors ${sortBy === opt.value ? 'bg-[#0b4f4a]/10 text-[#0b4f4a]' : 'text-brand-navy hover:bg-gray-50'}`}
                     >
                        {opt.label}
                        {sortBy === opt.value && <Check size={18} className="text-[#0b4f4a]"/>}
                     </button>
                  ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>


      <div className="container mx-auto px-4 md:px-8 mt-12 md:mt-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative">
          
          {/* LEFT SIDEBAR (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3">
             <div className="sticky top-28 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-h-[calc(100vh-9rem)] overflow-y-auto custom-scrollbar">
               {sidebarContent}
             </div>
          </aside>

          {/* MAIN CONTENT (Right) */}
          <main className="col-span-1 lg:col-span-9">
            
            {/* Top Bar: Count & Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <span className="font-bold text-gray-500 text-sm md:text-base">
                Showing <span className="text-brand-navy">{filteredAndSortedPackages.length}</span> packages
              </span>

              {/* Desktop Sort */}
              <div className="hidden lg:block relative">
                 <button 
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-bold text-brand-navy hover:border-[#0b4f4a] transition-all"
                 >
                   <ArrowUpDown size={14} />
                   Sort: <span className="text-[#0b4f4a]">{SORT_OPTIONS.find(o => o.value === sortBy)?.label}</span>
                 </button>
                 
                 {isSortOpen && (
                   <>
                   <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                   <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 animate-fadeIn">
                      {SORT_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => { setSortBy(opt.value); setIsSortOpen(false); }}
                          className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-50 ${sortBy === opt.value ? 'text-[#0b4f4a] bg-[#0b4f4a]/5' : 'text-gray-600'}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                   </div>
                   </>
                 )}
              </div>
            </div>

            {/* RESULTS GRID */}
            {filteredAndSortedPackages.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
                    <p className="text-xl text-gray-500 font-medium mb-4">No packages found matching your criteria.</p>
                    <button 
                        onClick={clearFilters}
                        className="text-[#0b4f4a] font-bold hover:underline px-6 py-2 rounded-full hover:bg-[#0b4f4a]/5 transition-colors"
                    >
                        Clear All Filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                <AnimatePresence mode='popLayout'>
                    {currentData.map((pkg) => (
                        <motion.div
                            key={pkg.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                        >
                            <TripCard trip={pkg} onClick={handleTripClick} />
                        </motion.div>
                    ))}
                </AnimatePresence>
                </div>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
                <div className="mt-20 mb-10 flex flex-col items-center select-none w-full">
                    
                    {/* DESKTOP PAGINATION (Flight Path) */}
                    <div className="hidden md:flex items-center gap-6 md:gap-12 relative z-0">
                        <motion.button 
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`group flex items-center gap-3 px-8 py-3 rounded-full border-2 font-bold transition-all duration-300 text-lg ${
                                currentPage === 1 
                                ? 'border-gray-200 bg-white text-gray-300 cursor-not-allowed'
                                : 'border-[#0b4f4a] bg-white text-[#0b4f4a] hover:bg-[#0b4f4a] hover:text-white'
                            }`}
                            whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
                            whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
                        >
                            <SleekPlane className={`w-6 h-6 transform -rotate-90 transition-colors duration-300 ${
                              currentPage === 1 ? 'text-gray-300' : 'text-[#0b4f4a] group-hover:text-white'
                            }`} />
                            <span>Previous</span>
                        </motion.button>

                        <div className="relative flex items-center">
                            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 -z-10 h-2">
                                <svg width="100%" height="4" className="overflow-visible">
                                    <line x1="0" y1="2" x2="100%" y2="2" stroke="#0b4f4a" strokeWidth="2" strokeDasharray="4 8" strokeLinecap="round" opacity="0.2" />
                                </svg>
                            </div>
                            <div className="flex items-center gap-12">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                                    const isActive = currentPage === pageNum;
                                    return (
                                        <div key={pageNum} className="relative">
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activePagePlane"
                                                    className="absolute -top-10 left-1/2 -translate-x-1/2 text-[#2CD4BF] z-20 drop-shadow-sm"
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{ opacity: 1, scale: 1, rotate: direction === 'right' ? 90 : -90 }}
                                                    transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 25 }}
                                                >
                                                    <SleekPlane className="w-8 h-8" />
                                                </motion.div>
                                            )}
                                            <motion.button
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-300 relative z-10 ${
                                                    isActive 
                                                    ? 'bg-[#0b4f4a] text-white border-[#0b4f4a] shadow-xl shadow-[#0b4f4a]/30 scale-110' 
                                                    : 'bg-white text-brand-navy border-[#0b4f4a]/30 hover:border-brand-coral hover:text-brand-coral'
                                                }`}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {pageNum}
                                            </motion.button>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <motion.button 
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`group flex items-center gap-3 px-8 py-3 rounded-full border-2 font-bold transition-all duration-300 text-lg ${
                                currentPage === totalPages 
                                ? 'border-gray-200 bg-white text-gray-300 cursor-not-allowed'
                                : 'border-[#0b4f4a] bg-white text-[#0b4f4a] hover:bg-[#0b4f4a] hover:text-white'
                            }`}
                            whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
                            whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
                        >
                            <span>Next</span>
                            <SleekPlane className={`w-6 h-6 transform rotate-90 transition-colors duration-300 ${
                              currentPage === totalPages ? 'text-gray-300' : 'text-[#0b4f4a] group-hover:text-white'
                            }`} />
                        </motion.button>
                    </div>

                    {/* MOBILE PAGINATION (Compact) */}
                    <div className="flex md:hidden items-center justify-between w-full max-w-sm gap-4">
                        <button
                           onClick={() => handlePageChange(currentPage - 1)}
                           disabled={currentPage === 1}
                           className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${
                             currentPage === 1 ? 'border-gray-100 text-gray-300 bg-white' : 'border-[#0b4f4a] text-[#0b4f4a] hover:bg-[#0b4f4a] hover:text-white'
                           }`}
                        >
                           <SleekPlane className="w-6 h-6 transform -rotate-90" />
                        </button>

                        <div className="flex flex-col items-center">
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Page</span>
                            <span className="text-xl font-black text-brand-navy">{currentPage} <span className="text-gray-300 font-medium">/ {totalPages}</span></span>
                        </div>

                        <button
                           onClick={() => handlePageChange(currentPage + 1)}
                           disabled={currentPage === totalPages}
                           className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${
                             currentPage === totalPages ? 'border-gray-100 text-gray-300 bg-white' : 'border-[#0b4f4a] text-[#0b4f4a] hover:bg-[#0b4f4a] hover:text-white'
                           }`}
                        >
                           <SleekPlane className="w-6 h-6 transform rotate-90" />
                        </button>
                    </div>

                </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Destinations;
