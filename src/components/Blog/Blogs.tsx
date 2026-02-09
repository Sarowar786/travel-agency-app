
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { BLOG_POSTS } from '../UI/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, ArrowRight, User, Search, ChevronDown, Tag, Share2, Twitter, Facebook, Linkedin, Filter } from 'lucide-react';
import DottedMapBackground from './DottedMapBackground';
import Image from 'next/image';

// --- SleekPlane Component (Reused for consistency) ---
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

// Reusable Custom Dropdown Component
interface CustomDropdownProps {
    value: string;
    onChange: (val: string) => void;
    options: string[];
    placeholder: string;
    isOpen: boolean;
    onToggle: () => void;
    disabled?: boolean;
    customLabel?: (val: string) => string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ value, onChange, options, placeholder, isOpen, onToggle, disabled, customLabel }) => {
    return (
        <div className="relative w-full">
            <button
                onClick={onToggle}
                disabled={disabled}
                className={`w-full text-left py-3 px-5 pr-10 rounded-full border flex items-center justify-between transition-all bg-gray-50 ${isOpen ? 'border-brand-teal ring-1 ring-brand-teal' : 'border-gray-200 hover:border-brand-teal/50'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer text-brand-navy'}`}
            >
                <span className="truncate text-sm font-bold">
                    {value ? (customLabel ? customLabel(value) : value) : placeholder}
                </span>
                <ChevronDown size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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
                            <li key="all-default">
                                <button
                                    onClick={() => onChange('')}
                                    className="w-full text-left px-5 py-3 hover:bg-brand-sand/30 flex items-center justify-between group transition-colors"
                                >
                                    <span className={`font-medium text-sm ${!value ? 'text-brand-navy' : 'text-gray-600'}`}>
                                        {placeholder}
                                    </span>
                                    {!value && (
                                        <span className="w-2 h-2 rounded-full bg-brand-green shadow-[0_0_8px_rgba(163,230,53,0.8)]"></span>
                                    )}
                                </button>
                            </li>
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


interface BlogsProps {
    //   onNavigate: (view: 'home' | 'destinations' | 'blogs') => void;
    onBlogClick: (id: string) => void;
}

const Blogs: React.FC<BlogsProps> = ({ onBlogClick }) => {
    // --- STATE ---
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

    // Custom Dropdown State
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const filterRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [direction, setDirection] = useState<'left' | 'right'>('right');
    const itemsPerPage = 6; // Adjusted for blog cards

    const categories = ['All', 'Guides', 'Inspiration', 'Tips', 'Food'];

    // --- DERIVED LISTS ---
    const countries = useMemo(() => {
        return Array.from(new Set(BLOG_POSTS.map(p => p.country).filter(Boolean) as string[])).sort();
    }, []);

    const cities = useMemo(() => {
        let posts = BLOG_POSTS;
        if (selectedCountry) {
            posts = posts.filter(p => p.country === selectedCountry);
        }
        return Array.from(new Set(posts.map(p => p.city).filter(Boolean) as string[])).sort();
    }, [selectedCountry]);

    // --- FILTERING LOGIC ---
    const filteredPosts = useMemo(() => {
        let result = BLOG_POSTS;

        // 0. Search Query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(post =>
                post.title.toLowerCase().includes(query) ||
                post.excerpt.toLowerCase().includes(query) ||
                post.author.toLowerCase().includes(query)
            );
        }

        // 1. Category
        if (activeCategory !== 'All') {
            result = result.filter(post => post.category === activeCategory);
        }

        // 2. Country
        if (selectedCountry) {
            result = result.filter(post => post.country === selectedCountry);
        }

        // 3. City
        if (selectedCity) {
            result = result.filter(post => post.city === selectedCity);
        }

        // 4. Sort by Date
        result = [...result].sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

        return result;
    }, [searchQuery, activeCategory, selectedCountry, selectedCity, sortOrder]);

    // --- PAGINATION LOGIC ---
    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
    const currentData = filteredPosts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
        setDirection('right');
    }, [searchQuery, activeCategory, selectedCountry, selectedCity, sortOrder]);

    const handlePageChange = (p: number) => {
        if (p >= 1 && p <= totalPages) {
            setDirection(p > currentPage ? 'right' : 'left');
            setCurrentPage(p);
            // Optional: Scroll to top of grid
            const gridTop = document.getElementById('blog-grid-start');
            if (gridTop) {
                gridTop.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    // Only show Featured Post layout if on Page 1, sorted by newest, and NO text search is active.
    const showFeaturedLayout = currentPage === 1 && !searchQuery && !selectedCountry && !selectedCity && sortOrder === 'newest';

    const featuredPost = showFeaturedLayout ? currentData[0] : null;
    const gridPosts = showFeaturedLayout ? currentData.slice(1) : currentData;

    const handleClearFilters = () => {
        setSearchQuery('');
        setActiveCategory('All');
        setSelectedCountry('');
        setSelectedCity('');
        setActiveDropdown(null);
    };

    return (
        <div className="bg-white min-h-screen relative overflow-hidden">

            {/* 1. HERO SECTION */}
            <div className="relative h-[50vh] bg-brand-navy overflow-hidden z-20">
                <Image
                    src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop"
                    alt="Travel Journal"
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-linear-to-t from-brand-navy via-brand-navy/20 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-brand-green font-bold uppercase tracking-widest text-sm mb-4 block">Our Journal</span>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">Stories from the Road</h1>
                        <p className="text-gray-300 max-w-lg mx-auto text-lg">
                            Travel tips, hidden gems, and local guides for your next adventure.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* 2. MAIN CONTENT WRAPPER WITH MAP BACKGROUND */}
            <div className="relative">
                {/* The Dotted World Map Background Layer */}
                <DottedMapBackground />

                {/* Updated z-index to z-30 to sit above Hero if overlapping, or just ensure interaction */}
                <div className="container mx-auto px-4 md:px-8 py-16 -mt-20 relative z-30">

                    {/* --- FILTER BAR --- */}
                    <div className="bg-white rounded-3xl shadow-xl p-4 md:p-6 mb-12 border border-gray-100 flex flex-col gap-6" ref={filterRef}>

                        {/* Search Row */}
                        <div className="relative w-full">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search articles by title, author, or keyword..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all font-medium text-brand-navy placeholder-gray-400"
                            />
                        </div>

                        {/* Categories Row */}
                        <div className="flex flex-wrap items-center justify-center gap-2 pb-6 border-b border-gray-100">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${activeCategory === cat
                                            ? 'bg-brand-green text-brand-navy shadow-lg shadow-brand-green/30 scale-105'
                                            : 'bg-gray-50 text-gray-500 hover:text-brand-navy hover:bg-gray-100'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Bottom Row: Detailed Filters */}
                        {/* Fixed clipping issue by removing overflow-x-auto and using flex-wrap */}
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-40">
                            <div className="flex flex-wrap md:flex-nowrap items-center gap-2 w-full md:w-auto">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider mr-2 whitespace-nowrap hidden md:block">Filter By:</span>

                                {/* Country Dropdown */}
                                <div className="min-w-40 w-full md:w-auto">
                                    <CustomDropdown
                                        value={selectedCountry}
                                        onChange={(val) => { setSelectedCountry(val); setSelectedCity(''); setActiveDropdown(null); }}
                                        options={countries}
                                        placeholder="All Countries"
                                        isOpen={activeDropdown === 'country'}
                                        onToggle={() => setActiveDropdown(activeDropdown === 'country' ? null : 'country')}
                                    />
                                </div>

                                {/* City Dropdown */}
                                <div className="min-w-40 w-full md:w-auto">
                                    <CustomDropdown
                                        value={selectedCity}
                                        onChange={(val) => { setSelectedCity(val); setActiveDropdown(null); }}
                                        options={cities}
                                        placeholder="All Cities"
                                        isOpen={activeDropdown === 'city'}
                                        onToggle={() => setActiveDropdown(activeDropdown === 'city' ? null : 'city')}
                                        disabled={!selectedCountry}
                                    />
                                </div>
                            </div>

                            {/* Sort */}
                            <div className="flex items-center gap-3 w-full md:w-auto justify-end md:justify-start">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Sort:</span>
                                <div className="min-w-45 w-full md:w-auto">
                                    <CustomDropdown
                                        value={sortOrder}
                                        onChange={(val) => { setSortOrder(val as 'newest' | 'oldest'); setActiveDropdown(null); }}
                                        options={['newest', 'oldest']}
                                        placeholder="Sort By"
                                        isOpen={activeDropdown === 'sort'}
                                        onToggle={() => setActiveDropdown(activeDropdown === 'sort' ? null : 'sort')}
                                        customLabel={(val) => val === 'newest' ? 'Newest First' : 'Oldest First'}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="blog-grid-start" className="scroll-mt-32">
                        {/* FEATURED POST (Full Width - Only on Page 1) */}
                        {featuredPost && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => onBlogClick(featuredPost.id)}
                                className="bg-white rounded-3xl overflow-hidden shadow-2xl mb-12 group cursor-pointer border border-gray-100"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    <div className="relative h-64 md:h-auto overflow-hidden">
                                        <Image
                                            src={featuredPost.image}
                                            alt={featuredPost.title}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute top-6 left-6 bg-brand-navy text-white text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider shadow-lg">
                                            Featured
                                        </div>
                                    </div>
                                    <div className="p-8 md:p-12 flex flex-col justify-center">
                                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                                            <span className="text-brand-teal">{featuredPost.category}</span>
                                            <span>•</span>
                                            <span>{featuredPost.date}</span>
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4 leading-tight group-hover:text-brand-teal transition-colors">
                                            {featuredPost.title}
                                        </h2>
                                        <p className="text-gray-500 text-lg mb-6 leading-relaxed">
                                            {featuredPost.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                                    <User size={16} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-brand-navy">{featuredPost.author}</span>
                                                    <span className="text-[10px] text-gray-400">{featuredPost.readTime}</span>
                                                </div>
                                            </div>
                                            <span className="inline-flex items-center gap-2 text-brand-teal font-bold hover:translate-x-1 transition-transform">
                                                Read More <ArrowRight size={18} />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ARTICLE GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            <AnimatePresence mode='popLayout'>
                                {gridPosts.map((post) => (
                                    <motion.div
                                        key={post.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        onClick={() => onBlogClick(post.id)}
                                        className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer border border-gray-100 flex flex-col h-full"
                                    >
                                        <div className="h-56 overflow-hidden relative">
                                            <Image
                                                src={post.image}
                                                alt={post.title}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-brand-navy text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                                                {post.category}
                                            </div>
                                            {/* Location Tag Overlay */}
                                            {(post.country || post.city) && (
                                                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md">
                                                    {post.city ? `${post.city}, ` : ''}{post.country}
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6 flex flex-col grow">
                                            <div className="flex items-center gap-3 text-xs text-gray-400 font-medium mb-3">
                                                <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                                                <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-brand-navy mb-3 leading-snug group-hover:text-brand-teal transition-colors">
                                                {post.title}
                                            </h3>
                                            <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6 grow">
                                                {post.excerpt}
                                            </p>
                                            <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
                                                <span className="text-xs font-bold text-gray-500">By {post.author}</span>
                                                <span className="w-8 h-8 rounded-full bg-brand-green/20 text-brand-teal flex items-center justify-center group-hover:bg-brand-green group-hover:text-brand-navy transition-colors">
                                                    <ArrowRight size={16} />
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {gridPosts.length === 0 && !featuredPost && (
                            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
                                <p className="text-xl text-gray-400 font-medium">No stories found matching your criteria.</p>
                                <button
                                    onClick={handleClearFilters}
                                    className="text-brand-teal font-bold hover:underline mt-2"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>

                    {/* --- PAGINATION (Ported from Destinations) --- */}
                    {totalPages > 1 && (
                        <div className="mt-20 mb-20 flex flex-col items-center select-none w-full">

                            {/* DESKTOP PAGINATION */}
                            <div className="hidden md:flex items-center gap-6 md:gap-12 relative z-0">
                                <motion.button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`group flex items-center gap-3 px-8 py-3 rounded-full border-2 font-bold transition-all duration-300 text-lg ${currentPage === 1
                                            ? 'border-gray-200 bg-white text-gray-300 cursor-not-allowed'
                                            : 'border-brand-teal bg-white text-brand-teal hover:bg-brand-teal hover:text-white'
                                        }`}
                                    whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
                                    whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
                                >
                                    <SleekPlane className={`w-6 h-6 transform -rotate-90 transition-colors duration-300 ${currentPage === 1 ? 'text-gray-300' : 'text-brand-teal group-hover:text-white'
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
                                                            layoutId="activePagePlaneBlog"
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
                                                        className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-300 relative z-10 ${isActive
                                                                ? 'bg-brand-teal text-white border-brand-teal shadow-xl shadow-brand-teal/30 scale-110'
                                                                : 'bg-white text-brand-navy border-brand-teal/30 hover:border-brand-coral hover:text-brand-coral'
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
                                    className={`group flex items-center gap-3 px-8 py-3 rounded-full border-2 font-bold transition-all duration-300 text-lg ${currentPage === totalPages
                                            ? 'border-gray-200 bg-white text-gray-300 cursor-not-allowed'
                                            : 'border-brand-teal bg-white text-brand-teal hover:bg-brand-teal hover:text-white'
                                        }`}
                                    whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
                                    whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
                                >
                                    <span>Next</span>
                                    <SleekPlane className={`w-6 h-6 transform rotate-90 transition-colors duration-300 ${currentPage === totalPages ? 'text-gray-300' : 'text-brand-teal group-hover:text-white'
                                        }`} />
                                </motion.button>
                            </div>

                            {/* MOBILE PAGINATION */}
                            <div className="flex md:hidden items-center justify-between w-full max-w-sm gap-4">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${currentPage === 1 ? 'border-gray-100 text-gray-300 bg-white' : 'border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white'
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
                                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${currentPage === totalPages ? 'border-gray-100 text-gray-300 bg-white' : 'border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white'
                                        }`}
                                >
                                    <SleekPlane className="w-6 h-6 transform rotate-90" />
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Blogs;
