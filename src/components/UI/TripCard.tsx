'use client'
import React from 'react';
import { TripCardData } from '../../../types';
import { Check, MapPin, Compass, Utensils, Moon, Gift, Trees, Star } from 'lucide-react';
import { motion } from 'framer-motion';

// Helper to get icon for tag
const getTagIcon = (tag: string) => {
  const t = tag.toLowerCase();
  if (t.includes('adventure')) return <Compass size={12} />;
  if (t.includes('food')) return <Utensils size={12} />;
  if (t.includes('night') || t.includes('day')) return <Moon size={12} />;
  if (t.includes('luxury')) return <Star size={12} />;
  if (t.includes('nature')) return <Trees size={12} />;
  return null;
};

// Helper to get brand color style for tag
const getTagStyle = (tag: string) => {
  const t = tag.toLowerCase();
  
  // DURATION TAGS (Color B)
  if (t.includes('night') || t.includes('day')) {
    return 'bg-gray-100 text-gray-700 border border-gray-200';
  }

  // TRAVEL STYLE TAGS (Color A)
  // Changed to Lime Green theme (matching Search Button palette)
  return 'bg-brand-green/30 text-brand-navy border border-brand-green/50';
};

interface TripCardProps {
  trip: TripCardData;
  onClick?: () => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onClick }) => {
  return (
    <div 
        onClick={onClick}
        className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col relative h-full cursor-pointer"
    >
      
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={trip.image} 
          alt={trip.title}
          loading="lazy"
          decoding="async" 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        {/* Badge with Pop-up Tooltip */}
        {trip.badge && (
          <div className="absolute top-4 right-4 z-20 group/badge">
            <div className="bg-brand-coral text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md flex items-center gap-1 cursor-pointer transform transition-transform hover:scale-105">
              <Gift size={12} />
              {trip.badge}
            </div>

            {/* Tooltip Popup */}
            {trip.offers && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-4 opacity-0 translate-y-2 pointer-events-none group-hover/badge:opacity-100 group-hover/badge:translate-y-0 group-hover/badge:pointer-events-auto transition-all duration-300 ease-out z-30">
                    {/* Little triangle arrow */}
                    <div className="absolute -top-1.5 right-4 w-3 h-3 bg-white border-t border-l border-gray-100 transform rotate-45"></div>
                    
                    <p className="text-[10px] font-bold text-brand-teal uppercase tracking-wider mb-2 border-b border-gray-100 pb-1">Included Deals</p>
                    <ul className="space-y-2">
                        {trip.offers.map((offer, idx) => (
                            <li key={idx} className="text-xs text-brand-navy font-medium flex items-start gap-2">
                                <div className="mt-0.5 bg-brand-green/20 rounded-full p-0.5">
                                   <Check size={8} className="text-brand-navy" strokeWidth={4} />
                                </div>
                                <span className="leading-tight">{offer}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-3 font-semibold">
          <MapPin size={14} className="text-brand-teal" />
          {trip.location}
        </div>

        {/* Title - Changed to Teal */}
        <h3 className="text-2xl font-black text-brand-teal mb-4 uppercase tracking-tight leading-none transition-colors group-hover:text-brand-navy">
          {trip.title}
        </h3>

        {/* Static Tags (Top) - Grouped by colors */}
        <div className="flex flex-wrap gap-2 mb-6">
           {trip.tags.map((tag, idx) => (
             <span 
                key={idx} 
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap ${getTagStyle(tag)}`}
             >
               {getTagIcon(tag)}
               {tag}
             </span>
           ))}
        </div>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
          {trip.description}
        </p>
        
        {/* Highlights */}
        <div className="space-y-2 mb-6 bg-gray-50 p-4 rounded-xl">
          {trip.highlights.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-sm text-gray-700 font-medium">
              <Check className="w-4 h-4 text-brand-green mt-0.5 shrink-0" strokeWidth={3} />
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* Auto-Scrolling Hashtag Conveyor (Bottom) */}
        {trip.hashtags && (
            <div className="w-full overflow-hidden mb-6 relative">
                {/* Gradient masks for fade effect */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10"></div>
                
                <motion.div 
                    className="flex gap-3 w-max"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 15 }}
                >
                    {/* Repeat tags twice to create seamless loop */}
                    {[...trip.hashtags, ...trip.hashtags].map((tag, idx) => (
                        <span 
                            key={idx} 
                            className="text-sm font-bold text-gray-400 italic hover:text-brand-coral transition-colors"
                        >
                        {tag}
                        </span>
                    ))}
                </motion.div>
            </div>
        )}

        {/* Footer (Price + Button) */}
        <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Starting From</span>
            <div className="flex items-baseline gap-2">
               <span className="text-2xl font-black text-brand-navy">{trip.price}</span>
               {trip.originalPrice && (
                 <span className="text-sm text-gray-400 line-through font-medium">{trip.originalPrice}</span>
               )}
            </div>
            <span className="text-[10px] text-gray-400 font-bold">NET / PAX</span>
          </div>
          
          {/* Coral Sunset Outline Button */}
          <button 
            onClick={(e) => {
                e.stopPropagation();
                if(onClick) onClick();
            }}
            className="px-6 py-2.5 rounded-full bg-white border-2 border-brand-coral text-brand-coral font-bold text-sm shadow-sm hover:bg-brand-coral hover:text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TripCard);
