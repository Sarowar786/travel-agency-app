
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { HERO_SLIDES } from './constants';
import SearchBar from './SearchBar';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Plane } from 'lucide-react';
import { SearchCriteria } from '../../../types';

interface HeroProps {
    onSearch?: (criteria: SearchCriteria) => void;
    onBannerClick?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onSearch, onBannerClick }) => {
  const [[page, direction], setPage] = useState([0, 0]);

  const imageIndex = Math.abs(page % HERO_SLIDES.length);
  const slide = HERO_SLIDES[imageIndex];

  const paginate = useCallback((newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  }, [page]);

  // Preload next image
  useEffect(() => {
    const nextIndex = Math.abs((page + 1) % HERO_SLIDES.length);
    const nextSlide = HERO_SLIDES[nextIndex];
    const img = new Image();
    img.src = nextSlide.image;
    if (nextSlide.backup) {
        const backupImg = new Image();
        backupImg.src = nextSlide.backup;
    }
  }, [page]);

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 6000);
    return () => clearInterval(timer);
  }, [paginate]);

  // Slide Variants for swipe animation
  const slideVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  // Swipe Power Calculation
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="relative w-full flex flex-col group z-40 bg-white">
      
      {/* CAROUSEL CONTAINER - STRICT 21:9 ASPECT RATIO */}
      {/* Used aspect-[21/9] to maintain the strip look on all devices */}
      <div className="relative w-full aspect-21/9 overflow-hidden bg-brand-navy">
          <AnimatePresence initial={false} custom={direction} mode='popLayout'>
            <motion.div
              key={page}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              className="absolute inset-0 w-full h-full cursor-pointer touch-pan-y"
              onClick={onBannerClick}
            >
              <SmartImage 
                primarySrc={slide.image}
                backupSrc={slide.backup}
                alt="Travel Banner"
                priority={true}
                // Using object-contain on mobile/tablet ensures full banner visibility within the 21:9 frame
                // On desktop (xl), object-cover fills it nicely
                className="w-full h-full object-contain xl:object-cover bg-brand-navy"
              />
              
              {/* Desktop Gradient Overlay - Subtle readability boost */}
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/10 pointer-events-none"></div>
            </motion.div>
          </AnimatePresence>

          {/* Controls (Hidden on mobile to encourage swipe, visible on desktop) */}
          <div className="hidden md:block container">
            <FlightControl  direction="left" onClick={() => paginate(-1)} />
            <FlightControl direction="right" onClick={() => paginate(1)} />
          </div>

          {/* Indicators */}
          <div className="absolute bottom-2 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 md:gap-3">
            {HERO_SLIDES.map((_, idx) => {
              const isActive = idx === imageIndex;
              return (
                <button
                    key={idx}
                    onClick={() => setPage([idx, idx > imageIndex ? 1 : -1])}
                    className={`h-1 md:h-1.5 rounded-full transition-all duration-500 ease-out shadow-sm ${
                      isActive ? 'w-6 md:w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                />
              );
            })}
          </div>
      </div>

      {/* SEARCH BAR SECTION */}
      {/* Mobile/Tablet: Distinct background (White) to separate from banner. Desktop (xl+): Absolute Overlay. */}
      {/* Changed breakpoint from lg to xl to ensure tablet landscape mode also keeps search bar outside carousel */}
      <div className="relative w-full z-40 bg-white xl:bg-transparent xl:absolute xl:bottom-8 xl:left-0 xl:pointer-events-none">
         <div className="w-full flex justify-center px-4 py-6 xl:py-0 xl:pointer-events-auto">
             <div className="w-full max-w-7xl">
                <SearchBar onSearch={onSearch} />
             </div>
         </div>
      </div>
    </div>
  );
};

// --- Smart Image Component ---
const SmartImage: React.FC<{ primarySrc: string; backupSrc?: string; alt: string; priority?: boolean; className?: string }> = ({ primarySrc, backupSrc, alt, priority = false, className }) => {
  const [src, setSrc] = useState(primarySrc);

  return (
    <img
      src={src}
      alt={alt}
      className={className || "w-full h-full object-cover"}
      // @ts-ignore
      fetchPriority={priority ? "high" : "auto"}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      onError={() => {
        if (backupSrc && src !== backupSrc) {
          console.warn(`Failed to load local image: ${primarySrc}. Switching to backup.`);
          setSrc(backupSrc);
        }
      }}
      draggable={false} // Prevent default drag behavior to allow swiping
    />
  );
}

// --- Flight Control Component ---
interface FlightControlProps {
  direction: 'left' | 'right';
  onClick: () => void;
}

const FlightControl: React.FC<FlightControlProps> = ({ direction, onClick }) => {
  const isLeft = direction === 'left';
  const [isFlying, setIsFlying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (isFlying) return; 

    setIsFlying(true);
    onClick();
    
    setTimeout(() => {
        setIsFlying(false);
    }, 400);
  };

  const baseRotate = isLeft ? -135 : 45;
  const hoverRotate = isLeft ? -125 : 35;

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`absolute top-1/2  -translate-y-1/2 z-30 p-2 md:p-4 rounded-full transition-colors group/control focus:outline-none ${
        isLeft ? 'left-2 md:left-6' : 'right-2 md:right-6'
      }`}
      aria-label={isLeft ? "Previous Slide" : "Next Slide"}
    >
      <div className="relative">
        <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            animate={isFlying ? { opacity: [0, 0.8, 0], scaleX: [0.5, 2, 0.5], x: isLeft ? 30 : -30 } : { opacity: 0, scaleX: 0 }}
            transition={{ duration: 0.3 }}
            className={`absolute top-1/2 w-16 -translate-y-1/2 h-1 bg-white/60 blur-[1px] rounded-full origin-${isLeft ? 'left' : 'right'} ${isLeft ? 'left-full' : 'right-full'}`}
        />

        <motion.div
            initial="idle"
            animate={isFlying ? "flying" : isHovered ? "hover" : "idle"}
            variants={{
                idle: { 
                    x: 0, 
                    opacity: 0.5, 
                    scale: 1, 
                    rotate: baseRotate,
                    color: '#FFFFFF'
                },
                hover: { 
                    x: 0, 
                    opacity: 1, 
                    scale: 1.1, 
                    rotate: hoverRotate, 
                    color: '#A3E635',
                    transition: { duration: 0.2 }
                },
                flying: { 
                    x: isLeft ? -300 : 300, 
                    opacity: 0, 
                    scale: 0.8,
                    rotate: hoverRotate, 
                    color: '#A3E635',
                    transition: { duration: 0.25, ease: "easeIn" } 
                }
            }}
        >
            <Plane 
                size={40}
                strokeWidth={0} 
                fill="currentColor" 
                className="drop-shadow-md"
            />
        </motion.div>
      </div>
    </button>
  );
};

export default Hero;
