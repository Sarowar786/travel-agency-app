import React from 'react';
import { Award, ShieldCheck, Plane, CreditCard } from 'lucide-react';

const TrustBar: React.FC = () => {
  return (
    <section className="py-12 border-t border-white/10 bg-transparent">
      <div className="container mx-auto px-4 overflow-hidden">
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-12 opacity-60 text-white hover:opacity-100 transition-all duration-500">
           {/* Mock Logos created with Icons + Text for prototype */}
           <div className="flex items-center gap-2">
                <ShieldCheck size={32} />
                <span className="font-bold text-xl tracking-tighter">NATAS</span>
           </div>
           
           <div className="flex items-center gap-2">
                <Plane size={32} />
                <span className="font-bold text-xl tracking-tighter">Singapore Airlines</span>
           </div>

           <div className="flex items-center gap-2">
                <Award size={32} />
                <span className="font-bold text-xl tracking-tighter">Marriott Bonvoy</span>
           </div>

           <div className="flex items-center gap-2">
                <CreditCard size={32} />
                <span className="font-bold text-xl tracking-tighter">VISA</span>
           </div>

           <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border-2 border-current"></div>
                <span className="font-bold text-xl tracking-tighter">Mastercard</span>
           </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
