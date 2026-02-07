
import React from 'react';
import { motion } from 'framer-motion';

const DottedMapBackground: React.FC = () => {
  // Abstract representation of continents using dot clusters
  // This is a simplified artistic interpretation for the "sleek, modern" look
  const dots = [
    // North America
    { cx: "15%", cy: "25%" }, { cx: "18%", cy: "22%" }, { cx: "20%", cy: "26%" }, { cx: "22%", cy: "24%" },
    { cx: "16%", cy: "28%" }, { cx: "19%", cy: "30%" }, { cx: "23%", cy: "29%" }, { cx: "25%", cy: "25%" },
    { cx: "20%", cy: "35%" }, { cx: "22%", cy: "38%" }, { cx: "15%", cy: "20%" }, { cx: "28%", cy: "22%" },
    
    // South America
    { cx: "28%", cy: "55%" }, { cx: "30%", cy: "50%" }, { cx: "32%", cy: "58%" }, { cx: "30%", cy: "65%" },
    { cx: "33%", cy: "48%" }, { cx: "29%", cy: "70%" }, { cx: "31%", cy: "75%" },
    
    // Europe
    { cx: "48%", cy: "25%" }, { cx: "50%", cy: "22%" }, { cx: "52%", cy: "26%" }, { cx: "51%", cy: "20%" },
    { cx: "47%", cy: "28%" }, { cx: "53%", cy: "24%" }, { cx: "55%", cy: "22%" },

    // Africa
    { cx: "50%", cy: "45%" }, { cx: "52%", cy: "40%" }, { cx: "55%", cy: "42%" }, { cx: "48%", cy: "48%" },
    { cx: "53%", cy: "50%" }, { cx: "56%", cy: "55%" }, { cx: "54%", cy: "60%" }, { cx: "51%", cy: "55%" },
    { cx: "57%", cy: "65%" },

    // Asia
    { cx: "65%", cy: "25%" }, { cx: "68%", cy: "22%" }, { cx: "70%", cy: "28%" }, { cx: "75%", cy: "25%" },
    { cx: "62%", cy: "30%" }, { cx: "66%", cy: "35%" }, { cx: "72%", cy: "32%" }, { cx: "78%", cy: "28%" },
    { cx: "80%", cy: "22%" }, { cx: "70%", cy: "40%" }, { cx: "75%", cy: "38%" }, { cx: "82%", cy: "35%" },
    { cx: "68%", cy: "45%" }, { cx: "73%", cy: "48%" }, // SE Asia

    // Australia
    { cx: "85%", cy: "65%" }, { cx: "88%", cy: "62%" }, { cx: "90%", cy: "68%" }, { cx: "82%", cy: "66%" },
    { cx: "87%", cy: "70%" },
  ];

  // "Active" hubs for psychological "fun/connection" effect
  const hubs = [
    { cx: "73%", cy: "48%", label: "SG" }, // Singapore
    { cx: "22%", cy: "24%", label: "US" }, // USA
    { cx: "50%", cy: "22%", label: "EU" }, // Europe
    { cx: "82%", cy: "35%", label: "JP" }, // Japan
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      <svg className="w-full h-full opacity-20" preserveAspectRatio="xMidYMid slice">
        
        {/* Connection Lines (Arcs) - Subtle Network Effect */}
        <motion.path
          d="M 73 48 Q 50 20 22 24" // SG to US (Curved)
          fill="none"
          stroke="url(#gradLine)"
          strokeWidth="0.2"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 2, delay: 0.5 }}
        />
        <motion.path
          d="M 73 48 Q 60 30 50 22" // SG to EU
          fill="none"
          stroke="url(#gradLine)"
          strokeWidth="0.2"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 2, delay: 0.8 }}
        />
        <motion.path
          d="M 73 48 Q 78 40 82 35" // SG to JP
          fill="none"
          stroke="url(#gradLine)"
          strokeWidth="0.2"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 2, delay: 1.1 }}
        />

        {/* Definitions for Gradients */}
        <defs>
          <linearGradient id="gradLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0b4f4a" stopOpacity="0" />
            <stop offset="50%" stopColor="#0b4f4a" stopOpacity="1" />
            <stop offset="100%" stopColor="#0b4f4a" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Render Dots */}
        {dots.map((dot, i) => (
          <circle
            key={i}
            cx={dot.cx}
            cy={dot.cy}
            r="0.8%" // Responsive size
            fill="#0b4f4a" // Brand Teal
            className="opacity-20"
          />
        ))}

        {/* Render Hubs (Pulsing) */}
        {hubs.map((hub, i) => (
          <g key={`hub-${i}`}>
            <motion.circle
              cx={hub.cx}
              cy={hub.cy}
              r="1.2%"
              fill="#A3E635" // Brand Green
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0.4, 0.8] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
            />
            <circle cx={hub.cx} cy={hub.cy} r="0.6%" fill="#0A1A2F" />
          </g>
        ))}
      </svg>
      
      {/* Soft Vignette to blend edges into white */}
      <div className="absolute inset-0 bg-linear-to-b from-white via-transparent to-white opacity-80" />
      <div className="absolute inset-0 bg-linear-to-r from-white via-transparent to-white opacity-60" />
    </div>
  );
};

export default DottedMapBackground;
