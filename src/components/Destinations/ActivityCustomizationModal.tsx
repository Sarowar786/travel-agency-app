import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronUp, Check, Info, Zap, Clock, ArrowRight } from 'lucide-react';
import { ActivitySlot } from '../../../types';

interface ActivityCustomizationModalProps {
    isOpen: boolean;
    onClose: () => void;
    slot: ActivitySlot;
    dayNumber: number;
    currentSelectionId: string;
    onConfirm: (slotId: string, optionId: string) => void;
}

const ActivityCustomizationModal: React.FC<ActivityCustomizationModalProps> = ({
    isOpen, onClose, slot, dayNumber, currentSelectionId, onConfirm
}) => {
    const [selectedId, setSelectedId] = useState(currentSelectionId);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setSelectedId(currentSelectionId);
            setIsMobileDrawerOpen(false);
        }
    }, [isOpen, currentSelectionId]);

    if (!isOpen || !slot.options) return null;

    const selectedOption = slot.options.find(o => o.id === selectedId) || slot.options[0];

    const handleConfirm = () => {
        onConfirm(slot.id, selectedId);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* --- MOBILE UI (Visible ONLY on Mobile) --- */}
            <div className="lg:hidden absolute inset-0 w-full h-full flex flex-col z-10 pointer-events-none">
                {/* Full Screen Image Layer */}
                <div className="absolute inset-0 z-0 pointer-events-auto">
                    <AnimatePresence mode='wait'>
                        <motion.img
                            key={selectedOption.id}
                            src={selectedOption.image}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full object-cover"
                        />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
                </div>

                {/* Top Close Button */}
                <div className="absolute top-4 right-4 z-20 pointer-events-auto">
                    <button onClick={onClose} className="p-2 bg-black/40 backdrop-blur-md text-white rounded-full">
                        <X size={24} />
                    </button>
                </div>

                {/* Content Overlay (When Drawer Closed) */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 p-6 z-10 text-white flex flex-col pointer-events-auto"
                    animate={isMobileDrawerOpen ? { opacity: 0, y: 50 } : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="mb-2 flex items-center gap-2">
                        {selectedOption.priceChange > 0 && (
                            <span className="bg-brand-coral text-white text-xs font-bold px-2 py-1 rounded">
                                + S${selectedOption.priceChange}
                            </span>
                        )}
                        <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded backdrop-blur-md">
                            Day {dayNumber}
                        </span>
                    </div>
                    <h2 className="text-3xl font-bold leading-tight mb-1">{selectedOption.title}</h2>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-1">{selectedOption.tagline}</p>

                    {/* Thumbnail Selector */}
                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar mb-4">
                        {slot.options.map(opt => (
                            <button
                                key={opt.id}
                                onClick={() => setSelectedId(opt.id)}
                                className={`relative w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${selectedId === opt.id ? 'border-brand-green scale-105' : 'border-white/30 opacity-60 grayscale'}`}
                            >
                                <img src={opt.image} className="w-full h-full object-cover" alt="" />
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setIsMobileDrawerOpen(true)}
                        className="w-full flex flex-col items-center justify-center pt-2 text-white/80 animate-pulse"
                    >
                        <ChevronUp size={28} />
                        <span className="text-xs font-bold uppercase tracking-widest">View Details</span>
                    </button>
                </motion.div>

                {/* Pull-Up Drawer (Details & Confirm) */}
                <motion.div
                    initial={{ y: '100%' }}
                    animate={isMobileDrawerOpen ? { y: 0 } : { y: '100%' }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl z-30 flex flex-col h-[85vh] pointer-events-auto shadow-2xl"
                >
                    <div className="w-full flex justify-center pt-3 pb-1" onClick={() => setIsMobileDrawerOpen(false)}>
                        <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                    </div>

                    <div className="p-6 overflow-y-auto flex-1">
                        <h2 className="text-2xl font-bold text-brand-navy mb-2">{selectedOption.title}</h2>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {selectedOption.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-gray-100 text-brand-navy rounded-full text-xs font-bold">{tag}</span>
                            ))}
                        </div>

                        <h4 className="font-bold text-brand-navy mb-3 flex items-center gap-2">
                            <Info size={18} className="text-brand-teal" /> Activity Details
                        </h4>
                        <ul className="space-y-4 mb-8">
                            {selectedOption.description.map((desc, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-teal mt-2 shrink-0" />
                                    <span className="leading-relaxed">{desc}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="p-6 border-t border-gray-100 bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-bold text-gray-500 text-sm">Price Impact</span>
                            <span className="text-xl font-bold text-brand-coral">
                                {selectedOption.priceChange > 0 ? `+ S$${selectedOption.priceChange}` : 'Included'}
                            </span>
                        </div>
                        <button
                            onClick={handleConfirm}
                            className="w-full bg-brand-green text-brand-navy font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-[#8cc72b]"
                        >
                            Confirm Selection <ArrowRight size={18} />
                        </button>
                    </div>
                </motion.div>
            </div>


            {/* --- DESKTOP UI (Visible ONLY on Desktop) --- */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="hidden lg:flex w-full max-w-6xl h-[80vh] bg-white rounded-3xl shadow-2xl overflow-hidden z-20"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Left: Image */}
                <div className="w-3/5 h-full relative bg-gray-900">
                    <AnimatePresence mode='wait'>
                        <motion.img
                            key={selectedOption.id}
                            src={selectedOption.image}
                            initial={{ opacity: 0.5 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0.5 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-10 left-10 text-white max-w-lg">
                        <h2 className="text-5xl font-bold mb-3 leading-tight">{selectedOption.title}</h2>
                        <p className="text-xl text-brand-green font-medium">{selectedOption.tagline}</p>
                    </div>
                </div>

                {/* Right: Content */}
                <div className="w-2/5 h-full flex flex-col bg-white">
                    {/* Header */}
                    <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Customize Activity</h3>
                            <div className="flex items-center gap-2 font-bold text-brand-navy">
                                <Clock size={16} className="text-brand-teal" />
                                Day {dayNumber} • {slot.time}
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Scrollable List */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-6">
                        <div>
                            <h4 className="font-bold text-brand-navy mb-4">Select Option</h4>
                            <div className="space-y-3">
                                {slot.options.map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setSelectedId(opt.id)}
                                        className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-center gap-4 ${selectedId === opt.id ? 'border-brand-teal bg-brand-teal/5' : 'border-gray-100 hover:border-gray-300'}`}
                                    >
                                        <img src={opt.image} className="w-12 h-12 rounded-lg object-cover bg-gray-200" alt="" />
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <span className={`font-bold text-sm ${selectedId === opt.id ? 'text-brand-navy' : 'text-gray-600'}`}>{opt.title}</span>
                                                {selectedId === opt.id && <Check size={16} className="text-brand-teal" />}
                                            </div>
                                            <span className="text-xs text-gray-400">{opt.priceChange > 0 ? `+ S$${opt.priceChange}` : 'Included'}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Details Area */}
                        <div className="bg-gray-50 rounded-2xl p-6">
                            <h4 className="font-bold text-brand-navy flex items-center gap-2 mb-4">
                                <Info size={18} className="text-brand-teal" /> Details
                            </h4>
                            <ul className="space-y-3">
                                {selectedOption.description.map((desc, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-teal mt-2 shrink-0" />
                                        <span className="leading-relaxed">{desc}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex flex-wrap gap-2 mt-4">
                                <span className="px-3 py-1 bg-white border border-gray-200 text-brand-navy rounded-full text-xs font-bold flex items-center gap-1">
                                    <Zap size={12} /> Energy: {selectedOption.energy}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-8 border-t border-gray-100 bg-white">
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-bold text-gray-500 text-sm">Price Impact</span>
                            <span className="text-xl font-bold text-brand-coral">
                                {selectedOption.priceChange > 0 ? `+ S$${selectedOption.priceChange}` : 'Included'}
                            </span>
                        </div>
                        <button
                            onClick={handleConfirm}
                            className="w-full bg-brand-green text-brand-navy font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                        >
                            Confirm Selection <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ActivityCustomizationModal;