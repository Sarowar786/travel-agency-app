
import React from 'react';
import { CRUISES } from './constants';
import { ArrowRight, Ship, Calendar } from 'lucide-react';
import Link from 'next/link';

// interface FeaturedCruisesProps {
//   onCruiseClick: (id: string) => void;
//   onViewAll: () => void;
// }

const FeaturedCruises: React.FC<any> = () => {
  // Show top 3 cruises
  const displayCruises = CRUISES.slice(0, 3);

  return (
    // Changed bg to white to blend with previous section
    <section className="pt-8 pb-24 px-4 md:px-8 bg-white relative z-10">
      <div className="container mx-auto">
        
        {/* Storyline Connector */}
        <div className="flex flex-col items-center text-center mb-16">
            {/* Removed Vertical Line */}
            
            <h2 className="text-3xl md:text-5xl font-bold text-brand-navy mb-4">
                Or maybe... swap the road for the <span className="text-[#0b4f4a]">Sea</span>?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl">
                If land travel feels too hectic, unpack once and wake up to a new horizon every morning.
                All-inclusive luxury on the waves.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {displayCruises.map((cruise) => (
                <div 
                    key={cruise.id}
                    // onClick={() => onCruiseClick(cruise.id)}
                    className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer border border-gray-100 flex flex-col h-full"
                >
                    <div className="h-64 overflow-hidden relative">
                        <img 
                            src={cruise.image} 
                            alt={cruise.title} 
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-brand-navy text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                            <Ship size={12} className="text-[#0b4f4a]" /> {cruise.ship}
                        </div>
                    </div>
                    
                    <div className="p-6 flex flex-col grow">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-2">
                             <Calendar size={12} /> {cruise.departure} • {cruise.nights} Nights
                        </div>
                        <h3 className="text-xl font-bold text-brand-navy mb-3 group-hover:text-[#0b4f4a] transition-colors leading-tight">
                            {cruise.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-6 grow">{cruise.route}</p>
                        
                        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase block">From</span>
                                <span className="text-xl font-black text-brand-navy">{cruise.price}</span>
                            </div>
                            <span className="w-10 h-10 rounded-full bg-[#0b4f4a]/10 flex items-center justify-center text-[#0b4f4a] group-hover:bg-[#0b4f4a] group-hover:text-white transition-colors">
                                <ArrowRight size={20} />
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Standardized Button (Matching FeaturedTrips) - Centered Spacing */}
        <div className="flex justify-center mt-20 mb-8">
            <Link href={'/cruises'} 
             
             className="group flex items-center gap-2 px-10 py-4 text-lg bg-brand-green text-brand-navy font-bold rounded-full shadow-lg hover:bg-[#8cc72b] hover:scale-105 transition-all duration-300"
            >
                View All Voyages 
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCruises;
