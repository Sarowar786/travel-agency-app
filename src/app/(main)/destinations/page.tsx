"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";

import TripCard from "../../../components/UI/TripCard";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, ArrowUpDown, Check } from "lucide-react";
import { useGetAllDestinationsQuery } from "@/redux/api/destinationApi";
import { destinationApi } from "./../../../redux/api/destinationApi";
import { FilterSection } from "@/components/Destinations/FilterSection";
import { CustomDropdown } from "@/components/common/CustomDropdown";
import { style } from "framer-motion/client";
import { fi } from "zod/locales";

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

// --- FILTER CONSTANTS ---
const DURATION_RANGES = [
  { label: "Weekend (1-3 Days)", value: "1-3", minNights: 0, maxNights: 2 },
  { label: "Short Trip (4-6 Days)", value: "4-6", minNights: 3, maxNights: 5 },
  { label: "Immersive (7-10 Days)", value: "7-10", minNights: 6, maxNights: 9 },
  {
    label: "Long Haul (11+ Days)",
    value: "11-0",
    minNights: 10,
    maxNights: 100,
  },
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
  "Fun",
];

const Destinations = () => {
  const router = useRouter();

  // --- STATE ---
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const itemsPerPage = 9;

  // Filters
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedDurations, setSelectedDurations] = useState<string>("");
  const [selectedStyles, setSelectedStyles] = useState<string>("");
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({
    min: "",
    max: "",
  }); // Active Filter

  const [localPriceRange, setLocalPriceRange] = useState<{
    min: string;
    max: string;
  }>({ min: "", max: "" }); // Input State

  console.log("dureations", selectedDurations);

  // Custom Dropdown State
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // handlePageChange is defined after totalPages calculation below
  const clearFilters = () => {
    // setSelectedRegion('');
    setSelectedCountry("");
    setSelectedCity("");
    setSelectedDurations("");
    setSelectedStyles("");
    setPriceRange({ min: "", max: "" });
    setLocalPriceRange({ min: "", max: "" });
  };

  const applyPriceFilter = () => {
    setPriceRange(localPriceRange);
  };

  const handlePriceKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      applyPriceFilter();
    }
  };
  // dureations formatting
  const formattedDurationsRange = selectedDurations.split("-");
  console.log("formatted durations ", formattedDurationsRange);

  // api calling
  const { data: destinationRes, isLoading } = useGetAllDestinationsQuery({
    country: selectedCountry,
    city: selectedCity,
    duration_from: formattedDurationsRange[0],
    ...(formattedDurationsRange[1] !== "0" && {
      duration_to: formattedDurationsRange[1],
    }),
    style: selectedStyles,
    min_price: priceRange.min,
    max_price: priceRange.max,
  });

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  const allDestinations =
    (Array.isArray(destinationRes?.data) && destinationRes?.data) || [];
  console.log(allDestinations, "destinationRes");

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

  const availableLocations = useMemo(() => {
    if (!allDestinations) {
      return { countries: [], cities: [] };
    }
    const countriesSet = new Set<string>();
    const allCitiesSet = new Set<string>();
    const citiesSetByCountry = new Map<string, Set<string>>();

    for (const d of allDestinations ?? []) {
      const country = (d.country ?? "").trim();
      const city = (d.city ?? "").trim();

      if (country) countriesSet.add(country);
      if (city) allCitiesSet.add(city);
      if (country && city) {
        if (!citiesSetByCountry.has(country))
          citiesSetByCountry.set(country, new Set());
        citiesSetByCountry.get(country)!.add(city);
      }
    }

    const countries = Array.from(countriesSet).sort();
    const cities = selectedCountry
      ? Array.from(citiesSetByCountry.get(selectedCountry) ?? new Set()).sort()
      : Array.from(allCitiesSet).sort();

    return { countries, cities };
  }, [allDestinations, selectedCountry]);

  const filteredDestinations = useMemo(() => {
    // Helper function to extract nights from tags

    return allDestinations.filter((d: any) => {
      if (selectedCountry && d.country !== selectedCountry) return false;
      if (selectedCity && d.city !== selectedCity) return false;

      // Filter by duration if selected
      // if (selectedDurations.length > 0) {
      //   const nights = getNightsFromTags(d.tags);
      //   if (nights === null) return false;

      //   const matchesDuration = selectedDurations.some((durationLabel) => {
      //     const range = DURATION_RANGES.find((r) => r.label === durationLabel);
      //     return (
      //       range && nights >= range.minNights && nights <= range.maxNights
      //     );
      //   });
      //   if (!matchesDuration) return false;
      // }

      return true;
    });
  }, [allDestinations, selectedCountry, selectedCity, selectedDurations]);

  // // Price Filter (Buffered)
  // const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({
  //   min: "",
  //   max: "",
  // }); // Active Filter
  // const [localPriceRange, setLocalPriceRange] = useState<{
  //   min: string;
  //   max: string;
  // }>({ min: "", max: "" }); // Input State

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(
    (filteredDestinations?.length || 0) / itemsPerPage,
  );

  const handlePageChange = (p: number) => {
    if (p >= 1 && p <= totalPages) {
      setDirection(p > currentPage ? "right" : "left");
      setCurrentPage(p);
      window.scrollTo({ top: 400, behavior: "smooth" });
    }
  };

  const currentData =
    filteredDestinations?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    ) || [];

  const sidebarContent = (
    <div className="space-y-1 h-full" ref={sidebarRef}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold text-brand-navy">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-brand-teal font-semibold hover:underline"
        >
          Reset All
        </button>
      </div>

      {/* 1. REGION */}
      {/* <FilterSection title="Region">
        <CustomDropdown
          label="Region"
          options={REGIONS}
          value={selectedRegion}
          placeholder="All Regions"
          isOpen={activeDropdown === "region"}
          onToggle={() =>
            setActiveDropdown(activeDropdown === "region" ? null : "region")
          }
          onChange={(val) => {
            setSelectedRegion(val);
            setSelectedCountry("");
            setSelectedCity("");
            setActiveDropdown(null);
          }}
        />
      </FilterSection> */}

      {/* 2. COUNTRY */}
      {/* <FilterSection title="Country">
        <CustomDropdown
          label="Country"
          options={availableLocations.countries}
          value={selectedCountry}
          placeholder="All Countries"
          isOpen={activeDropdown === "country"}
          onToggle={() =>
            setActiveDropdown(activeDropdown === "country" ? null : "country")
          }
          onChange={(val) => {
            setSelectedCountry(val);
            setSelectedCity("");
            setActiveDropdown(null);
          }}
          disabled={availableLocations.countries.length === 0}
        />
      </FilterSection> */}

      <FilterSection title="Country">
        <CustomDropdown
          label="Country"
          options={availableLocations.countries}
          value={selectedCountry}
          placeholder="All Countries"
          isOpen={activeDropdown === "country"}
          onToggle={() =>
            setActiveDropdown(activeDropdown === "country" ? null : "country")
          }
          onChange={(val) => {
            setSelectedCountry(val);
            setSelectedCity(""); // ✅ reset city when country changes
            setActiveDropdown(null);
          }}
          disabled={availableLocations.countries.length === 0}
        />
      </FilterSection>

      {/* 3. CITY */}
      <FilterSection title="City">
        <CustomDropdown
          label="City"
          options={availableLocations.cities as string[]}
          value={selectedCity}
          placeholder="All Cities"
          isOpen={activeDropdown === "city"}
          onToggle={() =>
            setActiveDropdown(activeDropdown === "city" ? null : "city")
          }
          onChange={(val) => {
            setSelectedCity(val);
            setActiveDropdown(null);
          }}
          // disabled={availableLocations.cities.length === 0}
        />
      </FilterSection>

      {/* 4. DURATION */}
      <FilterSection title="Duration">
        <div className="space-y-2">
          {DURATION_RANGES.map((range) => {
            const checked = selectedDurations === range.value;

            return (
              <label
                key={range.label}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div
                  className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-colors ${
                    checked
                      ? "bg-brand-teal border-brand-teal"
                      : "border-gray-300 bg-white group-hover:border-brand-teal"
                  }`}
                >
                  {checked && <Check size={14} className="text-white" />}
                </div>

                <input
                  type="radio"
                  name="duration"
                  value={range.value}
                  className="hidden"
                  checked={checked}
                  onChange={() => setSelectedDurations(range.value)}
                />

                <span className="text-sm text-gray-600 group-hover:text-brand-navy transition-colors">
                  {range.label}
                </span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* 5. TRAVEL STYLE */}
      <FilterSection title="Travel Style">
        <div className="grid grid-cols-2 gap-2">
          {TRAVEL_STYLES.map((style) => (
            <label
              key={style}
              className="flex items-center gap-2 cursor-pointer group"
            >
              {/* custom radio circle */}
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors
          ${
            selectedStyles === style
              ? "border-brand-teal"
              : "border-gray-300 bg-white group-hover:border-brand-teal"
          }`}
              >
                {selectedStyles === style && (
                  <div className="w-2 h-2 rounded-full bg-brand-teal" />
                )}
              </div>

              <input
                type="radio"
                name="travel-style"
                className="hidden"
                checked={selectedStyles === style}
                onChange={() => setSelectedStyles(style)}
              />

              <span className="text-sm text-gray-600 group-hover:text-brand-navy transition-colors">
                {style}
              </span>
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
            onChange={(e) =>
              setLocalPriceRange({ ...localPriceRange, min: e.target.value })
            }
            onBlur={applyPriceFilter}
            onKeyDown={handlePriceKeyDown}
            className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold text-brand-navy focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal placeholder:text-gray-400 placeholder:font-normal"
          />
          <span className="text-gray-400 font-bold">-</span>
          <input
            type="number"
            placeholder="Max"
            value={localPriceRange.max}
            onChange={(e) =>
              setLocalPriceRange({ ...localPriceRange, max: e.target.value })
            }
            onBlur={applyPriceFilter}
            onKeyDown={handlePriceKeyDown}
            className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold text-brand-navy focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal placeholder:text-gray-400 placeholder:font-normal"
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
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              Discover the World
            </h1>
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
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-full sm:w-100 bg-white z-60 lg:hidden shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
                <h2 className="text-lg font-bold text-brand-navy">Filters</h2>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">{sidebarContent}</div>
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
      {/* <AnimatePresence>
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
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white z-60 lg:hidden rounded-t-3xl shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-brand-navy">Sort By</h3>
                <button
                  onClick={() => setIsMobileSortOpen(false)}
                  className="p-2 bg-gray-100 rounded-full text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-2 mb-4">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSortBy(opt.value);
                      setIsMobileSortOpen(false);
                    }}
                    className={`w-full text-left p-4 rounded-xl font-medium flex justify-between items-center transition-colors ${sortBy === opt.value ? "bg-brand-teal/10 text-brand-teal" : "text-brand-navy hover:bg-gray-50"}`}
                  >
                    {opt.label}
                    {sortBy === opt.value && (
                      <Check size={18} className="text-brand-teal" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence> */}

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
            {/* Top Bar: Count */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <span className="font-bold text-gray-500 text-sm md:text-base">
                Showing{" "}
                <span className="text-brand-navy">
                  {filteredDestinations?.length || 0}
                </span>{" "}
                packages
              </span>
            </div>

            {/* RESULTS GRID */}

            {filteredDestinations?.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
                <p className="text-xl text-gray-500 font-medium mb-4">
                  No packages found matching your criteria.
                </p>
                <button
                  onClick={clearFilters}
                  className="text-brand-teal font-bold hover:underline px-6 py-2 rounded-full hover:bg-brand-teal/5 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                <AnimatePresence mode="popLayout">
                  {currentData?.map((pkg: any) => (
                    <motion.div
                      key={pkg.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TripCard trip={pkg} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* PAGINATION */}
            {totalPages > 0 && (
              <div className="mt-20 mb-10 flex flex-col items-center select-none w-full">
                {/* DESKTOP PAGINATION (Flight Path) */}
                <div className="hidden md:flex items-center gap-6 md:gap-12 relative z-0">
                  <motion.button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`group flex items-center gap-3 px-8 py-3 rounded-full border-2 font-bold transition-all duration-300 text-lg ${
                      currentPage === 1
                        ? "border-gray-200 bg-white text-gray-300 cursor-not-allowed"
                        : "border-brand-teal bg-white text-brand-teal hover:bg-brand-teal hover:text-white"
                    }`}
                    whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
                    whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
                  >
                    <SleekPlane
                      className={`w-6 h-6 transform -rotate-90 transition-colors duration-300 ${
                        currentPage === 1
                          ? "text-gray-300"
                          : "text-brand-teal group-hover:text-white"
                      }`}
                    />
                    <span>Previous</span>
                  </motion.button>

                  <div className="relative flex items-center">
                    <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 -z-10 h-2">
                      <svg width="100%" height="4" className="overflow-visible">
                        <line
                          x1="0"
                          y1="2"
                          x2="100%"
                          y2="2"
                          stroke="#0b4f4a"
                          strokeWidth="2"
                          strokeDasharray="4 8"
                          strokeLinecap="round"
                          opacity="0.2"
                        />
                      </svg>
                    </div>
                    <div className="flex items-center gap-12">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (pageNum) => {
                          const isActive = currentPage === pageNum;
                          return (
                            <div key={pageNum} className="relative">
                              {isActive && (
                                <motion.div
                                  layoutId="activePagePlane"
                                  className="absolute -top-10 left-1/2 -translate-x-1/2 text-[#2CD4BF] z-20 drop-shadow-sm"
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{
                                    opacity: 1,
                                    scale: 1,
                                    rotate: direction === "right" ? 90 : -90,
                                  }}
                                  transition={{
                                    duration: 0.4,
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 25,
                                  }}
                                >
                                  <SleekPlane className="w-8 h-8" />
                                </motion.div>
                              )}
                              <motion.button
                                onClick={() => handlePageChange(pageNum)}
                                className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-300 relative z-10 ${
                                  isActive
                                    ? "bg-brand-teal text-white border-brand-teal shadow-xl shadow-brand-teal/30 scale-110"
                                    : "bg-white text-brand-navy border-brand-teal/30 hover:border-brand-coral hover:text-brand-coral"
                                }`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {pageNum}
                              </motion.button>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </div>

                  <motion.button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`group flex items-center gap-3 px-8 py-3 rounded-full border-2 font-bold transition-all duration-300 text-lg ${
                      currentPage === totalPages
                        ? "border-gray-200 bg-white text-gray-300 cursor-not-allowed"
                        : "border-brand-teal bg-white text-brand-teal hover:bg-brand-teal hover:text-white"
                    }`}
                    whileHover={
                      currentPage !== totalPages ? { scale: 1.05 } : {}
                    }
                    whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
                  >
                    <span>Next</span>
                    <SleekPlane
                      className={`w-6 h-6 transform rotate-90 transition-colors duration-300 ${
                        currentPage === totalPages
                          ? "text-gray-300"
                          : "text-brand-teal group-hover:text-white"
                      }`}
                    />
                  </motion.button>
                </div>

                {/* MOBILE PAGINATION (Compact) */}
                <div className="flex md:hidden items-center justify-between w-full max-w-sm gap-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${
                      currentPage === 1
                        ? "border-gray-100 text-gray-300 bg-white"
                        : "border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white"
                    }`}
                  >
                    <SleekPlane className="w-6 h-6 transform -rotate-90" />
                  </button>

                  <div className="flex flex-col items-center">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                      Page
                    </span>
                    <span className="text-xl font-black text-brand-navy">
                      {currentPage}{" "}
                      <span className="text-gray-300 font-medium">
                        / {totalPages}
                      </span>
                    </span>
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${
                      currentPage === totalPages
                        ? "border-gray-100 text-gray-300 bg-white"
                        : "border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white"
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
