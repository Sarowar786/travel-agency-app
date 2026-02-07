import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Phone, Mail, MapPin } from 'lucide-react';
import Newsletter from './Newsletter';
import TrustBar from './TrustBar';

// Custom TikTok icon
const TikTokIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-brand-navy text-white">
      <TrustBar />
      <Newsletter variant="navy" />

      <div className="pt-6 pb-6">
        <div className="container mx-auto px-4 md:px-8">
          {/* Upper Footer */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 border-b border-white/10 pb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center">
                <Link href="/">
                  <img
                    className="w-37.5 cursor-pointer"
                    src="../../images/logofooter.png"
                    alt="Long Vacation Logo"
                  />
                </Link>
              </div>

              <p className="text-gray-400 mb-6">
                Your next escape starts here. Curated experiences for the modern traveler.
              </p>

              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-coral transition-colors"
                >
                  <Instagram size={20} />
                </a>

                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-coral transition-colors"
                >
                  <TikTokIcon size={20} />
                </a>

                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-coral transition-colors"
                >
                  <Facebook size={20} />
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold text-lg mb-6">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-brand-green transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/destinations" className="hover:text-brand-green transition-colors">
                    Destinations
                  </Link>
                </li>
                <li>
                  {/* <Link href="/cruises" className="hover:text-brand-green transition-colors">
                    Cruises
                  </Link> */}
                </li>

                <li>
                  <Link href="/careers" className="hover:text-brand-green transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-brand-green transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-brand-green transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-lg mb-6">Contact</h4>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-start gap-3">
                  <MapPin size={20} className="text-brand-teal mt-1" />
                  <span>
                    2 Gambas Crescent, #07-24
                    <br />
                    Nordcom Two, Singapore 757044
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={20} className="text-brand-teal" />
                  <a href="tel:+6567760496" className="hover:text-brand-green transition-colors">
                    +65 6776 0496
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={20} className="text-brand-teal" />
                  <a
                    href="mailto:business@longvacationtravel.com"
                    className="hover:text-brand-green transition-colors"
                  >
                    business@longvacationtravel.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Mini Gallery */}
            <div>
              <h4 className="font-bold text-lg mb-6">From Instagram</h4>
              <div className="grid grid-cols-3 gap-2">
                {[101, 102, 103, 104, 106, 107].map((id) => (
                  <img
                    key={id}
                    src={`https://picsum.photos/id/${id}/150/150`}
                    alt="Gallery"
                    className="w-full aspect-square object-cover rounded-md hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Lower Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
            <p>© 2025 Long Vacation (S) Pte. Ltd. TA02957. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <span>Operating Hours: Mon - Fri, 10am - 7pm</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
