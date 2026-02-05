
import React from 'react';
import { Send } from 'lucide-react';

interface NewsletterProps {
    variant?: 'transparent' | 'navy';
}

const Newsletter: React.FC<NewsletterProps> = ({ variant = 'transparent' }) => {
  const isNavy = variant === 'navy';

  return (
    <div className="pb-20 pt-10 px-4 md:px-8 bg-transparent relative z-20">
      <div className="container mx-auto">
        <div 
            className={`backdrop-blur-md border rounded-3xl p-8 md:p-12 text-center md:text-left relative overflow-hidden shadow-2xl transition-all duration-300
            ${isNavy 
                ? 'bg-brand-navy border-brand-navy/50 text-white' 
                : 'bg-white/10 border-white/20 text-white'
            }`}
        >
          
          {/* Decorative Circles - Adjusted opacity for Navy variant */}
          <div className={`absolute top-0 right-0 w-64 h-64 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl ${isNavy ? 'bg-brand-green/20' : 'bg-brand-green/10'}`}></div>
          <div className={`absolute bottom-0 left-0 w-48 h-48 rounded-full translate-y-1/3 -translate-x-1/3 blur-2xl ${isNavy ? 'bg-[#0b4f4a]/30' : 'bg-[#0b4f4a]/20'}`}></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Get travel deals and weekend ideas
              </h2>
              <p className={isNavy ? 'text-gray-300' : 'text-gray-200'}>
                Subscribe to get a <span className="text-brand-green font-bold">10% discount</span> for your first trip!
              </p>
            </div>

            <div className="w-full max-w-md">
              <form className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className={`flex-1 px-6 py-4 rounded-full border focus:outline-none transition-all
                  ${isNavy 
                    ? 'bg-white/10 border-white/10 text-white placeholder-white/50 focus:bg-white focus:text-brand-navy' 
                    : 'bg-black/20 border-white/10 text-white placeholder-white/50 focus:bg-white focus:text-brand-navy'
                  }`}
                />
                <button className="px-8 py-4 rounded-full bg-brand-green hover:bg-[#8cc72b] text-brand-navy font-bold shadow-lg hover:shadow-brand-green/20 transition-all flex items-center justify-center gap-2">
                  Subscribe
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
