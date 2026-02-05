
import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Calendar as CalendarIcon, Compass, Search, Building2, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { SearchCriteria } from '../../../types';

// --- Types ---
type DropdownType = 'destination' | 'city' | 'triptype' | 'checkin' | 'checkout' | null;

interface SearchBarProps {
  onSearch?: (criteria: SearchCriteria) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  // State
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  const [destination, setDestination] = useState('');
  const [city, setCity] = useState('');
  const [tripType, setTripType] = useState('');
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset city when destination changes
  const handleDestinationSelect = (val: string) => {
    setDestination(val);
    setCity(''); // Reset city
    setActiveDropdown(null); // Close dropdown
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch({
        destination,
        city,
        tripType,
        checkIn,
        checkOut
      });
    }
  };

  // Data
  const destinations = [
    { label: 'Indonesia', value: 'indonesia' },
    { label: 'China', value: 'china' },
    { label: 'Japan', value: 'japan' },
    { label: 'Thailand', value: 'thailand' },
  ];

  const citiesByCountry: Record<string, string[]> = {
    indonesia: ['Bali', 'Bintan', 'Jakarta', 'Lombok', 'Yogyakarta'],
    china: ['Chongqing', 'Changsha', 'Shanghai', 'Beijing', 'Chengdu'],
    japan: ['Tokyo', 'Osaka', 'Kyoto', 'Hokkaido', 'Fukuoka'],
    thailand: ['Bangkok', 'Phuket', 'Chiang Mai', 'Krabi']
  };

  const tripTypes = [
    { label: 'Weekend Getaway', value: 'weekend' },
    { label: 'Immersive Cultural', value: 'culture' },
    { label: 'Relaxing Cruise', value: 'cruise' },
    { label: 'Family Adventure', value: 'family' },
  ];

  // Helper to format date for display
  const formatDateDisplay = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div 
      ref={containerRef}
      className="bg-white rounded-3xl xl:rounded-full shadow-2xl p-4 xl:p-2 max-w-7xl w-full flex flex-col xl:flex-row items-center gap-2 animate-slideUp relative z-50"
    >
      
      {/* --- DESTINATION DROPDOWN --- */}
      <div className="flex-1 w-full relative group">
        <button 
          onClick={() => setActiveDropdown(activeDropdown === 'destination' ? null : 'destination')}
          className={`w-full text-left px-6 py-3 rounded-full hover:bg-[#0b4f4a]/5 transition-colors flex items-center gap-3 ${activeDropdown === 'destination' ? 'bg-[#0b4f4a]/5' : ''}`}
        >
          <MapPin className="text-[#0b4f4a] w-5 h-5 flex-shrink-0" />
          <div className="flex flex-col w-full overflow-hidden">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Where to?</span>
            <div className="flex items-center justify-between">
              <span className={`font-bold truncate ${destination ? 'text-brand-navy' : 'text-gray-300'}`}>
                {destinations.find(d => d.value === destination)?.label || 'Select Destination'}
              </span>
              <ChevronDown size={14} className="text-gray-400 ml-2" />
            </div>
          </div>
        </button>

        {/* Dropdown Menu */}
        {activeDropdown === 'destination' && (
          <div className="absolute top-full left-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[100] animate-fadeIn">
            <ul className="py-2">
              {destinations.map((item) => (
                <li key={item.value}>
                  <button
                    onClick={() => handleDestinationSelect(item.value)}
                    className="w-full text-left px-5 py-3 hover:bg-brand-sand/30 flex items-center justify-between group transition-colors"
                  >
                    <span className={`font-medium ${destination === item.value ? 'text-brand-navy' : 'text-gray-600'}`}>
                      {item.label}
                    </span>
                    {destination === item.value && (
                      <span className="w-2 h-2 rounded-full bg-brand-green shadow-[0_0_8px_rgba(163,230,53,0.8)]"></span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="hidden xl:block w-px h-10 bg-gray-100"></div>

      {/* --- CITY DROPDOWN --- */}
      <div className={`flex-1 w-full relative group transition-opacity duration-300 ${!destination ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}>
        <button 
          onClick={() => destination && setActiveDropdown(activeDropdown === 'city' ? null : 'city')}
          disabled={!destination}
          className={`w-full text-left px-6 py-3 rounded-full hover:bg-[#0b4f4a]/5 transition-colors flex items-center gap-3 ${activeDropdown === 'city' ? 'bg-[#0b4f4a]/5' : ''}`}
        >
          <Building2 className="text-[#0b4f4a] w-5 h-5 flex-shrink-0" />
          <div className="flex flex-col w-full overflow-hidden">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">City</span>
             <div className="flex items-center justify-between">
              <span className={`font-bold truncate ${city ? 'text-brand-navy' : 'text-gray-300'}`}>
                {city 
                  ? citiesByCountry[destination]?.find(c => c.toLowerCase() === city.toLowerCase()) || city 
                  : 'Select City'
                }
              </span>
              <ChevronDown size={14} className="text-gray-400 ml-2" />
            </div>
          </div>
        </button>

        {/* Dropdown Menu */}
        {activeDropdown === 'city' && (
          <div className="absolute top-full left-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[100] animate-fadeIn">
            <ul className="py-2 max-h-60 overflow-y-auto custom-scrollbar">
              {citiesByCountry[destination]?.map((cityName) => (
                <li key={cityName}>
                  <button
                    onClick={() => {
                      setCity(cityName.toLowerCase());
                      setActiveDropdown(null);
                    }}
                    className="w-full text-left px-5 py-3 hover:bg-brand-sand/30 flex items-center justify-between group transition-colors"
                  >
                    <span className={`font-medium ${city === cityName.toLowerCase() ? 'text-brand-navy' : 'text-gray-600'}`}>
                      {cityName}
                    </span>
                    {city === cityName.toLowerCase() && (
                      <span className="w-2 h-2 rounded-full bg-brand-green shadow-[0_0_8px_rgba(163,230,53,0.8)]"></span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="hidden xl:block w-px h-10 bg-gray-100"></div>

      {/* --- CHECK-IN (Custom Calendar) --- */}
      <div className="flex-1 w-full relative group">
        <button 
          onClick={() => setActiveDropdown(activeDropdown === 'checkin' ? null : 'checkin')}
          className={`w-full text-left px-6 py-3 rounded-full hover:bg-[#0b4f4a]/5 transition-colors flex items-center gap-3 ${activeDropdown === 'checkin' ? 'bg-[#0b4f4a]/5' : ''}`}
        >
          <CalendarIcon className="text-[#0b4f4a] w-5 h-5 flex-shrink-0" />
          <div className="flex flex-col w-full">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Check-in</span>
            <span className={`font-bold truncate text-sm md:text-base ${checkIn ? 'text-brand-navy' : 'text-gray-300'}`}>
              {formatDateDisplay(checkIn) || 'Add Date'}
            </span>
          </div>
        </button>

        {/* Calendar Widget */}
        {activeDropdown === 'checkin' && (
          <CalendarWidget 
            selectedDate={checkIn} 
            onSelect={(date) => {
              setCheckIn(date);
              setActiveDropdown(null);
            }} 
            minDate={new Date()}
          />
        )}
      </div>

      <div className="hidden xl:block w-px h-10 bg-gray-100"></div>

      {/* --- CHECK-OUT (Custom Calendar) --- */}
      <div className="flex-1 w-full relative group">
        <button 
          onClick={() => setActiveDropdown(activeDropdown === 'checkout' ? null : 'checkout')}
          className={`w-full text-left px-6 py-3 rounded-full hover:bg-[#0b4f4a]/5 transition-colors flex items-center gap-3 ${activeDropdown === 'checkout' ? 'bg-[#0b4f4a]/5' : ''}`}
        >
          <CalendarIcon className="text-[#0b4f4a] w-5 h-5 flex-shrink-0" />
          <div className="flex flex-col w-full">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Check-out</span>
             <span className={`font-bold truncate text-sm md:text-base ${checkOut ? 'text-brand-navy' : 'text-gray-300'}`}>
              {formatDateDisplay(checkOut) || 'Add Date'}
            </span>
          </div>
        </button>

         {/* Calendar Widget */}
         {activeDropdown === 'checkout' && (
          <CalendarWidget 
            selectedDate={checkOut} 
            onSelect={(date) => {
              setCheckOut(date);
              setActiveDropdown(null);
            }} 
            minDate={checkIn || new Date()}
          />
        )}
      </div>

      <div className="hidden xl:block w-px h-10 bg-gray-100"></div>

      {/* --- TRIP TYPE DROPDOWN --- */}
      <div className="flex-1 w-full relative group">
        <button 
          onClick={() => setActiveDropdown(activeDropdown === 'triptype' ? null : 'triptype')}
          className={`w-full text-left px-6 py-3 rounded-full hover:bg-[#0b4f4a]/5 transition-colors flex items-center gap-3 ${activeDropdown === 'triptype' ? 'bg-[#0b4f4a]/5' : ''}`}
        >
          <Compass className="text-[#0b4f4a] w-5 h-5 flex-shrink-0" />
          <div className="flex flex-col w-full overflow-hidden">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Trip Type</span>
            <div className="flex items-center justify-between">
              <span className={`font-bold truncate ${tripType ? 'text-brand-navy' : 'text-gray-300'}`}>
                {tripTypes.find(t => t.value === tripType)?.label || 'Select Type'}
              </span>
              <ChevronDown size={14} className="text-gray-400 ml-2" />
            </div>
          </div>
        </button>

        {/* Dropdown Menu */}
        {activeDropdown === 'triptype' && (
          <div className="absolute top-full left-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[100] animate-fadeIn">
            <ul className="py-2">
              {tripTypes.map((item) => (
                <li key={item.value}>
                  <button
                    onClick={() => {
                      setTripType(item.value);
                      setActiveDropdown(null);
                    }}
                    className="w-full text-left px-5 py-3 hover:bg-brand-sand/30 flex items-center justify-between group transition-colors"
                  >
                    <span className={`font-medium ${tripType === item.value ? 'text-brand-navy' : 'text-gray-600'}`}>
                      {item.label}
                    </span>
                    {tripType === item.value && (
                       <span className="w-2 h-2 rounded-full bg-brand-green shadow-[0_0_8px_rgba(163,230,53,0.8)]"></span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* --- SEARCH BUTTON --- */}
      <div className="px-2 w-full xl:w-auto mt-2 xl:mt-0">
        <button 
            onClick={handleSearchClick}
            className="bg-brand-green hover:bg-[#8cc72b] text-brand-navy font-bold rounded-full w-full xl:w-auto px-8 py-4 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 whitespace-nowrap"
        >
          <Search className="w-5 h-5" />
          <span>Search</span>
        </button>
      </div>

    </div>
  );
};

// --- Custom Calendar Widget ---
interface CalendarWidgetProps {
  selectedDate: Date | null;
  onSelect: (date: Date) => void;
  minDate: Date;
}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({ selectedDate, onSelect, minDate }) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const renderCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }

    // Days
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      const isDisabled = date < new Date(minDate.setHours(0,0,0,0));
      
      days.push(
        <button
          key={d}
          onClick={(e) => {
             e.stopPropagation();
             if (!isDisabled) onSelect(date);
          }}
          disabled={isDisabled}
          className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
            isSelected 
              ? 'bg-brand-green text-brand-navy font-bold shadow-md' 
              : isDisabled 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="absolute top-full left-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-[100] animate-fadeIn" onClick={(e) => e.stopPropagation()}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-full text-gray-500">
          <ChevronLeft size={16} />
        </button>
        <span className="font-bold text-brand-navy">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-full text-gray-500">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 mb-2 text-center">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <span key={day} className="text-xs font-bold text-gray-400">{day}</span>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1 place-items-center">
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default React.memo(SearchBar);
