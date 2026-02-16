import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";


interface CustomDropdownProps {
  label: string;
  options: string[] ;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  isOpen: boolean;
  onToggle: () => void;
  disabled?: boolean;
}
export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder,
  isOpen,
  onToggle,
  disabled,
}) => {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`w-full text-left p-3 pr-10 rounded-xl border bg-gray-50 text-sm font-bold flex items-center justify-between transition-all ${
          isOpen
            ? "border-brand-teal ring-1 ring-brand-teal"
            : "border-gray-200 hover:border-brand-teal/50"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer text-brand-navy"}`}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown
          size={16}
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-60 max-h-60 overflow-y-auto custom-scrollbar"
          >
            <ul className="py-2">
              <li key="all">
                <button
                  onClick={() => onChange("")}
                  className="w-full text-left px-4 py-3 hover:bg-brand-sand/30 flex items-center justify-between group transition-colors"
                >
                  <span
                    className={`font-medium text-sm ${value === "" ? "text-brand-navy" : "text-gray-600"}`}
                  >
                    {placeholder}
                  </span>
                  {value === "" && (
                    <span className="w-2 h-2 rounded-full bg-brand-green shadow-[0_0_8px_rgba(163,230,53,0.8)]"></span>
                  )}
                </button>
              </li>
              {options.map((option: any) => (
                <li key={option}>
                  <button
                    onClick={() => onChange(option)}
                    className="w-full text-left px-4 py-3 hover:bg-brand-sand/30 flex items-center justify-between group transition-colors"
                  >
                    <span
                      className={`font-medium text-sm ${value === option ? "text-brand-navy" : "text-gray-600"}`}
                    >
                      {option}
                    </span>
                    {value === option && (
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
  );
};