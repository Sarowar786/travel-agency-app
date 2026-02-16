import {motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface FilterSectionProps {
  title: string;
  children?: React.ReactNode;
  isOpenDefault?: boolean;
}

export const FilterSection = ({
  title,
  children,
  isOpenDefault = true,
}: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <div className="border-b border-gray-100 py-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full mb-3 group"
      >
        <h4 className="font-bold text-brand-navy group-hover:text-brand-teal transition-colors">
          {title}
        </h4>
        {isOpen ? (
          <ChevronUp size={16} className="text-gray-400" />
        ) : (
          <ChevronDown size={16} className="text-gray-400" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onAnimationStart={() => setIsAnimating(true)}
            onAnimationComplete={() => setIsAnimating(false)}
            style={{ overflow: isAnimating ? "hidden" : "visible" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};