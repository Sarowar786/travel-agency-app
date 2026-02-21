"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Globe,
  Briefcase,
  GraduationCap,
  Clock,
  ChevronDown,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

declare global {
  interface Window {
    L: any;
  }
}

// Utility to load script dynamically
const loadScript = (src: string) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

// Utility to load stylesheet dynamically
const loadStylesheet = (href: string) => {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
};

const Contact: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [subject, setSubject] = useState("General Enquiry");
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Correct Coordinates for Nordcom Two (Postal Code 757044)
  const lat = 1.448;
  const lng = 103.8136;

  // Initialize Map with Dynamic Loading
  useEffect(() => {
    const initMap = async () => {
      try {
        // Load Leaflet resources on demand
        loadStylesheet("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css");
        await loadScript("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js");

        setIsMapLoaded(true);

        if (mapContainerRef.current && !mapInstanceRef.current && window.L) {
          const map = window.L.map(mapContainerRef.current, {
            center: [lat + 0.001, lng], // Offset slightly so popup is centered initially
            zoom: 17,
            zoomControl: false,
            scrollWheelZoom: false,
          });

          mapInstanceRef.current = map;

          // 1. Google Maps Tile Layer
          window.L.tileLayer(
            "https://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
            {
              attribution: "&copy; Google Maps",
              maxZoom: 20,
            },
          ).addTo(map);

          // 2. Custom Image Pin Icon
          const iconHtml = `
            <div class="relative w-16 h-16 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer group">
                <div class="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center relative z-10 border-2 border-brand-navy overflow-hidden">
                   <img src="/images/company-logo.png" alt="HQ" class="w-full h-full object-cover" />
                </div>
                <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-black/20 rounded-[100%] blur-sm"></div>
            </div>
          `;

          const customIcon = window.L.divIcon({
            className: "custom-pin",
            html: iconHtml,
            iconSize: [64, 64],
            iconAnchor: [32, 64],
            popupAnchor: [0, -36],
          });

          const marker = window.L.marker([lat, lng], {
            icon: customIcon,
          }).addTo(map);

          // 3. Native Leaflet Popup (Attached to Pin)
          const popupContent = `
            <div class="font-sans text-left">
    <div class="flex items-center gap-4 mb-6">
        <div class="w-16 h-16 rounded-xl bg-brand-navy flex items-center justify-center shadow-lg overflow-hidden border-4 border-gray-100 shrink-0">
            <img src="/images/company-logo.png" alt="Logo" class="w-full h-full object-cover" />
        </div>
        <div class="flex flex-col min-w-0">
            <h3 class="text-xl font-semibold text-brand-navy leading-tight m-0 mt-2">Our Headquarters</h3>
            <p class="text-brand-teal font-medium text-sm m-0">Long Vacation (S) Pte Ltd</p>
        </div>
    </div>

    <div class="flex items-start gap-4 text-gray-600 bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200 shadow-md">
        <p class="leading-snug font-medium text-lg m-0 -mt-1">
            2 Gambas Crescent, #07-24,<br/>
            Nordcom Two, Singapore 757044
        </p>
    </div>

    <a 
        href="https://www.google.com/maps/search/?api=1&query=Nordcom+Two+Singapore+757044"
        target="_blank"
        class="flex items-center justify-center gap-3 w-full bg-brand-green text-white font-semibold py-3 px-6 rounded-xl hover:bg-brand-green-dark transition-all ease-in-out duration-300 shadow-lg transform hover:scale-105"
    >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
        <span>Get Directions</span>
    </a>
</div>
          `;

          const popup = window.L.popup({
            className: "hq-popup",
            closeButton: true,
            autoClose: false,
            closeOnClick: false,
            offset: [0, -10],
            minWidth: 300,
          }).setContent(popupContent);

          marker.bindPopup(popup);

          setTimeout(() => {
            marker.openPopup();
          }, 500);

          window.L.control.zoom({ position: "bottomright" }).addTo(map);
        }
      } catch (error) {
        console.error("Failed to load Leaflet:", error);
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const departments = [
    {
      name: "Inbound Tours",
      email: "inbound@longvacationtravel.com",
      phone: "+65 6776 0491",
      icon: Globe,
    },
    {
      name: "Outbound Tours",
      email: "outbound@longvacationtravel.com",
      phone: "+65 6776 0492",
      icon: Send,
    },
    {
      name: "General Enquiry",
      email: "enquiry@longvacationtravel.com",
      phone: "+65 6776 0496",
      icon: MapPin,
    },
    {
      name: "Partnerships",
      email: "partners@longvacationtravel.com",
      phone: "+65 6776 0493",
      icon: Briefcase,
    },
    {
      name: "Corporate MICE",
      email: "mice@longvacationtravel.com",
      phone: "+65 6776 0494",
      icon: Briefcase,
    },
    {
      name: "Educational",
      email: "edu@longvacationtravel.com",
      phone: "+65 6776 0495",
      icon: GraduationCap,
    },
  ];

  const subjects = [
    "General Enquiry",
    "Plan a Trip",
    "Feedback",
    "Business Partnership",
  ];

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Global Style Override for Leaflet Popup to match Card UI */}
      <style>{`
        .hq-popup .leaflet-popup-content-wrapper {
            background: white;
            border-radius: 1.5rem;
            box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
            padding: 0;
            overflow: hidden;
        }
        .hq-popup .leaflet-popup-content {
            margin: 1.5rem;
            line-height: 1.5;
            min-width: 280px !important;
            width: max-content !important;
        }
        .hq-popup .leaflet-popup-tip-container {
            visibility: visible;
        }
        .hq-popup .leaflet-popup-close-button {
            color: #9ca3af !important;
            font-size: 18px !important;
            padding: 8px !important;
        }
        .custom-pin {
            background: transparent;
            border: none;
        }
      `}</style>

      {/* Header */}
      <div className="bg-brand-navy text-white pt-32 pb-16 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>
        <div className="container mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Get in Touch</h1>
          <p className="text-brand-green text-lg md:text-xl font-medium max-w-2xl mx-auto">
            We'd love to hear from you. Drop us a message or visit our HQ.
          </p>
        </div>
      </div>

      {/* Dynamic Map Section */}
      <div className="w-full h-125 md:h-150 bg-[#e5e3df] relative shadow-inner z-0">
        {!isMapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 font-bold">
            Loading Map...
          </div>
        )}
        <div
          ref={mapContainerRef}
          className="w-full h-full z-0"
          style={{ isolation: "isolate" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 mt-12 md:mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100">
              <h2 className="text-3xl font-bold text-brand-navy mb-2">
                Send us a Message
              </h2>
              <p className="text-gray-500 mb-8">
                We usually reply within 24 hours.
              </p>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-brand-navy uppercase tracking-wider">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all font-bold text-brand-navy placeholder:font-normal placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-brand-navy uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all font-bold text-brand-navy placeholder:font-normal placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-brand-navy uppercase tracking-wider">
                    Subject
                  </label>

                  {/* CUSTOM DROPDOWN */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`w-full text-left px-4 py-3 rounded-xl bg-gray-50 border flex items-center justify-between transition-all font-bold text-brand-navy cursor-pointer ${
                        isDropdownOpen
                          ? "border-brand-teal ring-1 ring-brand-teal"
                          : "border-gray-200"
                      }`}
                    >
                      <span>{subject}</span>
                      <ChevronDown
                        size={18}
                        className={`text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-20"
                        >
                          <ul className="py-2">
                            {subjects.map((item) => (
                              <li key={item}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSubject(item);
                                    setIsDropdownOpen(false);
                                  }}
                                  className="w-full text-left px-4 py-3 hover:bg-brand-sand/30 flex items-center justify-between group transition-colors"
                                >
                                  <span
                                    className={`font-medium text-sm ${subject === item ? "text-brand-navy" : "text-gray-600"}`}
                                  >
                                    {item}
                                  </span>
                                  {subject === item && (
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
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-brand-navy uppercase tracking-wider">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tell us more about your travel plans..."
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all font-bold text-brand-navy placeholder:font-normal placeholder:text-gray-400"
                  ></textarea>
                </div>

                <button className="w-full md:w-auto bg-brand-green hover:bg-[#8cc72b] text-brand-navy font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
                  <Send size={18} />
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: Sidebar */}
          <div className="lg:col-span-5 space-y-8">
            {/* Department Directory */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <h3 className="font-bold text-xl text-brand-navy mb-6">
                Department Directory
              </h3>
              <div className="space-y-6">
                {departments.map((dept, idx) => (
                  <div key={idx} className="grid grid-cols-[auto_1fr] gap-4">
                    <div className="p-2 bg-brand-teal/10 text-brand-teal rounded-lg h-fit w-fit">
                      <dept.icon size={18} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-brand-navy">{dept.name}</h4>
                      <a
                        href={`tel:${dept.phone}`}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-coral transition-colors hover:underline"
                      >
                        <Phone size={14} className="shrink-0" /> {dept.phone}
                      </a>
                      <a
                        href={`mailto:${dept.email}`}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-coral transition-colors hover:underline decoration-brand-coral/50 cursor-pointer"
                      >
                        <Mail size={14} className="shrink-0" /> {dept.email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Operating Hours - Re-styled to match Directory */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-brand-green/20 text-brand-navy rounded-lg">
                  <Clock size={18} />
                </div>
                <h3 className="font-bold text-xl text-brand-navy">
                  Operating Hours
                </h3>
              </div>

              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="font-medium">Monday - Friday</span>
                  <span className="font-bold text-brand-navy">
                    10:00 AM - 7:00 PM
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="font-medium">Saturday</span>
                  <span className="font-bold text-brand-navy">
                    10:00 AM - 2:00 PM
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Sunday & PH</span>
                  <span className="font-bold text-brand-coral bg-brand-coral/10 px-3 py-1 rounded-full text-xs uppercase tracking-wider">
                    Closed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
