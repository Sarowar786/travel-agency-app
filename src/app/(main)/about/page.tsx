'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Heart, Coffee, Map, Zap, Users, Globe, Award } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      
      {/* 1. HERO SECTION: The "Why" */}
      <div className="relative h-[60vh] md:h-[70vh] bg-brand-navy overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2070&auto=format&fit=crop" 
          alt="Team collaboration" 
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-linear-to-t from-brand-navy via-brand-navy/60 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 md:px-8 pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <span className="text-brand-green font-bold uppercase tracking-widest text-sm mb-4 block">Since 2016</span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              We started this because we hate <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-coral to-pink-500">boring holidays</span>.
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Travel shouldn't be about waking up at 6am to sit on a bus for 4 hours. 
              We are the anti-tour agency for the modern traveler.
            </p>
          </motion.div>
        </div>
      </div>

      {/* 2. THE MANIFESTO: Us vs Them (Psychology: Differentiation) */}
      <section className="py-20 px-4 md:px-8 container mx-auto hidden">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">The Long Vacation Difference</h2>
          <p className="text-gray-500">Why 50,000+ travelers chose us over the big guys.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
           {/* The Old Way */}
           <div className="bg-gray-50 rounded-3xl p-8 md:p-10 border border-gray-100 opacity-70 hover:opacity-100 transition-opacity">
              <h3 className="text-xl font-bold text-gray-400 mb-6 flex items-center gap-2">
                <span className="text-2xl">🥱</span> The "Old School" Way
              </h3>
              <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-gray-500">
                    <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold shrink-0">X</span>
                    <span>Wake up at 6am for "mandatory" breakfast.</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-500">
                    <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold shrink-0">X</span>
                    <span>Forced shopping stops at "Gem Factories".</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-500">
                    <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold shrink-0">X</span>
                    <span>Generic buffet food that tastes like cardboard.</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-500">
                    <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold shrink-0">X</span>
                    <span>Guide reading from a script.</span>
                  </li>
              </ul>
           </div>

           {/* The Long Vacation Way */}
           <div className="bg-brand-navy rounded-3xl p-8 md:p-10 text-white relative overflow-hidden shadow-2xl transform md:-translate-y-4">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-2xl">🚀</span> The Long Vacation Way
              </h3>
              <ul className="space-y-5 relative z-10">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-green text-brand-navy flex items-center justify-center text-xs font-bold shrink-0">
                        <Zap size={14} />
                    </span>
                    <span className="font-medium text-lg">Sleep in. It's a holiday, not boot camp.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-green text-brand-navy flex items-center justify-center text-xs font-bold shrink-0">
                        <Zap size={14} />
                    </span>
                    <span className="font-medium text-lg">Zero shopping traps. 100% Culture.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-green text-brand-navy flex items-center justify-center text-xs font-bold shrink-0">
                        <Zap size={14} />
                    </span>
                    <span className="font-medium text-lg">Michelin Bib Gourmand & Local Hidden Gems.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-green text-brand-navy flex items-center justify-center text-xs font-bold shrink-0">
                        <Zap size={14} />
                    </span>
                    <span className="font-medium text-lg">Guides who are actually cool locals.</span>
                  </li>
              </ul>
           </div>
        </div>
      </section>

      {/* 3. TRUST & AUTHORITY (Psychology: Social Proof) */}
      <section className="bg-gray-50 py-20 border-y border-gray-200">
          <div className="container mx-auto px-4 md:px-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                  <div className="md:w-1/2">
                      <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm mb-6">
                          <ShieldCheck className="text-brand-teal" size={20} />
                          <span className="text-sm font-bold text-brand-navy">STB License TA02957</span>
                      </div>
                      <h2 className="text-3xl md:text-5xl font-bold text-brand-navy mb-6">
                          Licensed, Regulated,<br/>and <span className="text-brand-coral">Obsessive</span> about Safety.
                      </h2>
                      <p className="text-gray-600 text-lg leading-relaxed mb-8">
                          Founded in 2016, we are a Singapore Tourism Board licensed specialist. 
                          Whether it's a corporate MICE event for 500 pax or a private family honeymoon, 
                          we handle the logistics so you can handle the fun.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-6">
                          <div>
                              <p className="text-4xl font-black text-brand-teal">20k+</p>
                              <p className="text-sm font-bold text-gray-400 uppercase">Happy Travelers</p>
                          </div>
                          <div>
                              <p className="text-4xl font-black text-brand-teal">10+</p>
                              <p className="text-sm font-bold text-gray-400 uppercase">Years Experience</p>
                          </div>
                          {/* <div>
                              <p className="text-4xl font-black text-brand-teal">24/7</p>
                              <p className="text-sm font-bold text-gray-400 uppercase">Support Team</p>
                          </div>
                          <div>
                              <p className="text-4xl font-black text-brand-teal">4.9</p>
                              <p className="text-sm font-bold text-gray-400 uppercase">Google Rating</p>
                          </div> */}
                      </div>
                  </div>

                  <div className="md:w-1/2 relative">
                      <div className="grid grid-cols-2 gap-4">
                          <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000" className="rounded-2xl shadow-lg mt-12" alt="Office" />
                          <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000" className="rounded-2xl shadow-lg" alt="Meeting" />
                      </div>
                      {/* Floating Badge */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow-2xl animate-bounce">
                          <Award size={40} className="text-brand-coral" />
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* 4. THE TEAM (Psychology: Human Connection) */}
      {/* <section className="py-20 px-4 md:px-8 container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">Meet the Fixers</h2>
            <p className="text-gray-500">Real humans. No chatbots. We reply faster than your ex.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: "Sarah L.", role: "Founder", desc: "Knows every hidden cafe in Seoul.", icon: Map },
                { name: "David T.", role: "Operations Lead", desc: "Can solve any crisis in 5 mins.", icon: Zap },
                { name: "Jessica W.", role: "MICE Specialist", desc: "Organized events for Fortune 500s.", icon: Users },
                { name: "Kenji S.", role: "Product Curator", desc: "Eats 6 meals a day for 'research'.", icon: Coffee },
              ].map((member, idx) => (
                  <div key={idx} className="group bg-white border border-gray-100 p-8 rounded-3xl hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center">
                      <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full mb-6 overflow-hidden relative">
                         <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} alt={member.name} />
                      </div>
                      <h3 className="text-xl font-bold text-brand-navy mb-1">{member.name}</h3>
                      <p className="text-xs font-bold text-brand-teal uppercase tracking-wider mb-4">{member.role}</p>
                      <p className="text-gray-500 text-sm leading-relaxed">{member.desc}</p>
                  </div>
              ))}
          </div>
      </section> */}

      {/* 5. AREAS OF EXPERTISE */}
      {/* <section className="py-20 bg-brand-navy text-white relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-8 relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">What We Do Best</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                      <Globe size={40} className="text-brand-green mb-6" />
                      <h3 className="text-2xl font-bold mb-4">Inbound & Outbound</h3>
                      <p className="text-gray-300 leading-relaxed">
                          Whether you're visiting Singapore or jetting off to Japan, our network of local partners ensures VIP treatment everywhere.
                      </p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                      <Users size={40} className="text-brand-coral mb-6" />
                      <h3 className="text-2xl font-bold mb-4">Corporate MICE</h3>
                      <p className="text-gray-300 leading-relaxed">
                          Meetings, Incentives, Conferences, Exhibitions. We handle the logistics, tech, and gala dinners with military precision.
                      </p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                      <Heart size={40} className="text-pink-400 mb-6" />
                      <h3 className="text-2xl font-bold mb-4">Tailor-Made Leisure</h3>
                      <p className="text-gray-300 leading-relaxed">
                          Honeymoons, family reunions, or solo soul-searching. We craft itineraries that fit your personality, not a template.
                      </p>
                  </div>
              </div>
          </div>
      </section> */}

    </div>
  );
};

export default AboutUs;
