"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import TripCard from "./TripCard";
import Link from "next/link";
import { useGetAllDestinationsQuery } from "@/redux/api/destinationApi"; // ✅ path ঠিক করো

interface FeaturedTripsProps {
  onTripClick?: () => void;
}

const FeaturedTrips: React.FC<FeaturedTripsProps> = ({ onTripClick }) => {
  // ✅ API Call (params optional)
  const { data, isLoading, isError } = useGetAllDestinationsQuery({
    page: 1,
    limit: 3, 
  });


  const trips = (data?.data ?? data?.results ?? data ?? []).slice(0, 3);

  return (
    <section
      id="destinations"
      className="pt-24 pb-4 px-4 md:px-8 bg-white relative z-10"
    >
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
            Feeling burnt out? A <span className="text-brand-green">SHIOK</span>{" "}
            holiday might be just what you need.
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            We curated these short, sweet, and fuss-free trips just for you.
            Maximum shiok, minimum planning.
          </p>
        </div>

        {/* ✅ Loading / Error UI */}
        {isLoading && <p className="text-center text-gray-500">Loading trips...</p>}
        {isError && <p className="text-center text-red-500">Failed to load trips.</p>}

        {!isLoading && !isError && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {trips.map((trip: any) => (
              <TripCard key={trip.id ?? trip._id} trip={trip} onClick={onTripClick} />
            ))}
          </div>
        )}

        <div className="flex justify-center mt-20 mb-20">
          <Link
            href={"/destinations"}
            className="group flex items-center gap-2 px-10 py-4 text-lg bg-brand-green text-brand-navy font-bold rounded-full shadow-lg hover:bg-[#8cc72b] hover:scale-105 transition-all duration-300"
          >
            View More Packages
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTrips;
