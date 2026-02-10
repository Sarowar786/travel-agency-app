"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Globe, ChevronDown, Check } from "lucide-react";
import logo from "../../../public/images/logonav.png"
import Image from "next/image";

const Navbar = () => {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentLang, setCurrentLang] = useState<"EN" | "CN">("EN");
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  /* Scroll background */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Outside click for language dropdown */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Google translate cookie sync */
  useEffect(() => {
    const value = "; " + document.cookie;
    const parts = value.split("; googtrans=");
    if (parts.length === 2) {
      const cookieVal = parts.pop()?.split(";").shift();
      setCurrentLang(cookieVal?.includes("/zh-CN") ? "CN" : "EN");
    }
  }, []);

  const handleLanguageChange = (langCode: string) => {
    const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (combo) {
      combo.value = langCode;
      combo.dispatchEvent(new Event("change"));
    }
    setCurrentLang(langCode === "zh-CN" ? "CN" : "EN");
    setIsLangMenuOpen(false);
    setIsOpen(false);
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Destinations", href: "/destinations" },
    // { label: "Cruises", href: "/cruises" },
    { label: "Blog", href: "/blogs" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Signin", href: "/login" },
  ];

  const languages = [
    { code: "en", label: "English", short: "EN" },
    { code: "zh-CN", label: "中文 (Chinese)", short: "CN" },
  ];

  const isDarkText = scrolled;

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <nav
      className={`fixed w-full z-60 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="flex items-center">
          {/* <img src={logo} alt="Long Vacation Logo" /> */}
          <Image src={logo} alt="long vacation logo" width={150} height={50} />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex space-x-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`font-medium transition-colors hover:text-brand-coral ${
                    isActive(link.href)
                      ? "text-brand-green font-bold"
                      : isDarkText
                      ? "text-brand-navy"
                      : "text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Language Dropdown */}
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className={`flex items-center gap-2 font-semibold border rounded-full px-3 py-1.5 ${
                isDarkText
                  ? "border-brand-navy text-brand-navy"
                  : "border-white text-white"
              }`}
            >
              <Globe size={14} />
              {currentLang}
              <ChevronDown size={14} />
            </button>

            {isLangMenuOpen && (
              <div className="absolute top-full right-0 mt-3 w-40 bg-white rounded-xl shadow-xl py-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full px-4 py-2 flex justify-between text-sm hover:bg-gray-50 ${
                      currentLang === lang.short ? "text-brand-teal" : "text-gray-600"
                    }`}
                  >
                    {lang.label}
                    {currentLang === lang.short && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex gap-4">
          <button
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className={isDarkText ? "text-brand-navy" : "text-white"}
          >
            <Globe size={18} />
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={isDarkText ? "text-brand-navy" : "text-white"}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl h-screen p-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block py-4 text-xl border-b ${
                isActive(link.href)
                  ? "text-brand-teal font-bold"
                  : "text-brand-navy"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
