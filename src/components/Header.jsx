import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { MapPin, Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

const Header = () => {
  const { theme, toggleTheme } = useThemeStore();
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000 * 60);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-islamic-600 dark:bg-slate-800 text-white rounded-b-3xl p-5 shadow-lg relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
      
      {/* Top Bar: Calendar & Theme Toggle */}
      <div className="flex justify-between items-start relative z-10">
        <div>
          <h2 className="text-sm font-medium opacity-90">
            {format(currentDate, 'dd MMMM yyyy')} | ৯ আষাঢ়
          </h2>
          <p className="text-xs opacity-75 mt-0.5">23 Muharram 1448 H • Yaumul Khamis</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={toggleTheme} className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      {/* Location & Weather */}
      <div className="mt-6 flex items-center space-x-2 relative z-10">
        <MapPin size={16} className="text-islamic-200" />
        <span className="text-sm font-medium">Dhaka, Bangladesh</span>
        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full ml-2">32°C</span>
      </div>

      {/* Prayer Time Card / Arc */}
      <div className="mt-4 bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/20 relative z-10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold">Next: Asr</span>
          <span className="text-sm font-bold text-islamic-200">- 2h 15m</span>
        </div>
        
        {/* Simple visual arc representation placeholder */}
        <div className="w-full h-12 relative overflow-hidden mt-2">
           <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
             <path d="M 0 50 Q 50 -10 100 50" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
             {/* Sun position indicator */}
             <circle cx="70" cy="22" r="4" fill="#fcd34d" />
           </svg>
           <div className="flex justify-between text-[10px] opacity-80 mt-1">
             <span>Fajr 4:10</span>
             <span>Maghrib 6:45</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
