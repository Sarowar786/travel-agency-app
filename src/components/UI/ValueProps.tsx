import React from 'react';
import { BedDouble, Wallet, MessageCircle, CheckCircle2 } from 'lucide-react';

const ValueProps: React.FC = () => {
  const props = [
    {
      icon: BedDouble,
      title: "No 'Catfish' Hotels",
      highlight: "We sleep-test everything.",
      description: "We personally check water pressure, bed shiok-ness, and WiFi speed. If the hotel is CMI (Cannot Make It), it’s not on our list.",
    },
    {
      icon: Wallet,
      title: "Confirm Plus Chop Pricing",
      highlight: "Nett price. No shocks.",
      description: "What you see is what you pay. No hidden 'service charge', no forced shopping stops, and definitely no rude surprises.",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Concierge",
      highlight: "On the ball support.",
      description: "Lost? Hungry? Need a doctor? Text our local SG team. We reply faster than your BTO queue number.",
    }
  ];

  return (
    <section id="about" className="relative pt-32 md:pt-48 pb-20 px-4 md:px-8">
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
           <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
             Why Long Vacation?
           </h2>
           <p className="text-[#A3E635] text-lg md:text-xl font-medium max-w-2xl mx-auto">
             Not your grandmother's tour agency. We travel like you do—fuss-free, honest, and high quality.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {props.map((prop, idx) => (
            <div 
              key={idx} 
              className="group bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-3xl hover:-translate-y-2 hover:bg-white/15 transition-all duration-300 shadow-xl"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-brand-green to-teal-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <prop.icon size={32} className="text-brand-navy" strokeWidth={1.5} />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">{prop.title}</h3>
              <p className="text-brand-green font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <CheckCircle2 size={16} /> {prop.highlight}
              </p>
              
              <p className="text-gray-200 leading-relaxed text-sm md:text-base">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProps;