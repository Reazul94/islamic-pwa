import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { MapPin, Sun, Moon, Settings, Check, Navigation, Languages, Palette } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useSettingsStore } from '../store/settingsStore';
import { getPrayerTimesForDate } from '../utils/prayerCalculator';
import { getBengaliDate, getHijriDate } from '../utils/dateConverter';

const Header = () => {
  const { theme, mode, setTheme, toggleTheme } = useThemeStore();
  const { madhhab, language, coordinates, locationName, setMadhhab, setLanguage, setCoordinates } = useSettingsStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showSettings, setShowSettings] = useState(false);
  const [locationInput, setLocationInput] = useState(locationName);
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [nextPrayerName, setNextPrayerName] = useState('');

  // Running marquee daily auto-update advice
  const advices = [
    "রাসূলুল্লাহ (সা.) বলেছেন: 'নিশ্চয়ই দ্বীন সহজ।' (সহীহ বুখারী)",
    "পবিত্র কুরআনে বলা হয়েছে: 'নিশ্চয়ই আল্লাহর সাহায্য অতি নিকটে।' (সূরা আল-বাকারাহ: ২১৪)",
    "রাসূলুল্লাহ (সা.) বলেছেন: 'তোমাদের মধ্যে সর্বোত্তম সে, যে কুরআন শেখে এবং শেখায়।' (সহীহ বুখারী)",
    "রাসূলুল্লাহ (সা.) বলেছেন: 'দোয়া হলো মুমিনের অন্যতম ঢাল।' (তিরমিযী)",
    "রাসূলুল্লাহ (সা.) বলেছেন: 'পবিত্রতা ঈমানের অর্ধেক।' (সহীহ মুসলিম)",
    "রাসূলুল্লাহ (সা.) বলেছেন: 'যে ব্যক্তি দ্বীনি জ্ঞান অর্জনের পথে বের হয়, সে ফিরে আসা পর্যন্ত আল্লাহর রাস্তায় থাকে।' (তিরমিযী)",
    "পবিত্র কুরআনে বলা হয়েছে: 'নিশ্চয়ই কষ্টের সাথে স্বস্তি রয়েছে।' (সূরা আল-ইনশিরাহ: ৬)"
  ];

  const getDailyAdvice = () => {
    const day = currentDate.getDate();
    return advices[day % advices.length];
  };

  // Location suggestions database
  const locationsDb = [
    { name: 'Dhaka, Bangladesh', lat: 23.8103, lng: 90.4125 },
    { name: 'Chittagong, Bangladesh', lat: 22.3569, lng: 91.7832 },
    { name: 'Sylhet, Bangladesh', lat: 24.8949, lng: 91.8687 },
    { name: 'Rajshahi, Bangladesh', lat: 24.3636, lng: 88.6241 },
    { name: 'Makkah, Saudi Arabia', lat: 21.4225, lng: 39.8262 },
    { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
    { name: 'New York, USA', lat: 40.7128, lng: -74.0060 }
  ];

  // 25+ Tailwind Color Palettes Theme Options
  const themesList = [
    { id: 'emerald', name: 'Emerald (Green)' },
    { id: 'sapphire', name: 'Sapphire (Blue)' },
    { id: 'rose', name: 'Rose (Red)' },
    { id: 'amber', name: 'Amber (Gold)' },
    { id: 'violet', name: 'Violet (Purple)' },
    { id: 'cyan', name: 'Cyan' },
    { id: 'fuchsia', name: 'Fuchsia' },
    { id: 'lime', name: 'Lime' },
    { id: 'orange', name: 'Orange' },
    { id: 'teal', name: 'Teal' },
    { id: 'sky', name: 'Sky' },
    { id: 'indigo', name: 'Indigo' },
    { id: 'purple', name: 'Purple' },
    { id: 'pink', name: 'Pink' },
    { id: 'slate', name: 'Slate' },
    { id: 'zinc', name: 'Zinc' },
    { id: 'yellow', name: 'Yellow' },
    { id: 'red', name: 'Red' },
    { id: 'green', name: 'Green' },
    { id: 'blue', name: 'Blue' },
    { id: 'crimson', name: 'Crimson' },
    { id: 'gold', name: 'Gold' },
    { id: 'olive', name: 'Olive' },
    { id: 'lavender', name: 'Lavender' },
    { id: 'sky-teal', name: 'Sky Teal' },
    { id: 'dracula-purple', name: 'Dracula Purple' }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const times = getPrayerTimesForDate(currentDate, coordinates.latitude, coordinates.longitude, madhhab);
    setPrayerTimes(times);
    
    const prayerNames = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
    let nextName = '';
    let nextTime = null;
    
    for (const name of prayerNames) {
      const pTime = times[name];
      if (pTime > currentDate) {
        nextName = name;
        nextTime = pTime;
        break;
      }
    }
    
    if (!nextTime) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowTimes = getPrayerTimesForDate(tomorrow, coordinates.latitude, coordinates.longitude, madhhab);
      nextName = 'fajr';
      nextTime = tomorrowTimes.fajr;
    }
    
    setNextPrayerName(nextName.toUpperCase());
    
    const diffMs = nextTime - currentDate;
    const hrs = Math.floor(diffMs / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
    
    setTimeRemaining(`${hrs}h ${mins}m ${secs}s`);
  }, [currentDate, coordinates, madhhab]);

  const requestGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates(latitude, longitude, `GPS Position (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`);
          setLocationInput(`GPS Position`);
        },
        () => alert('Could not retrieve GPS coordinates.')
      );
    }
  };

  const selectLocation = (loc) => {
    setCoordinates(loc.lat, loc.lng, loc.name);
    setLocationInput(loc.name);
    setShowSettings(false);
  };

  const getSunPosition = () => {
    if (!prayerTimes) return { cx: 50, cy: 50 };
    const start = prayerTimes.fajr.getTime();
    const end = prayerTimes.maghrib.getTime();
    const current = currentDate.getTime();
    
    if (current < start || current > end) {
      return { cx: -10, cy: -10 }; 
    }
    
    const percent = (current - start) / (end - start);
    const cx = percent * 100;
    const cy = 50 - Math.sqrt(2500 - Math.pow(cx - 50, 2)) * 0.8;
    return { cx, cy };
  };

  const sunPos = getSunPosition();

  return (
    <div className="flex flex-col w-full">
      {/* RUNNING MARQUEE AT TOP OF HEADER */}
      <div className="bg-black/35 py-1 px-4 text-xs font-semibold text-white block w-full overflow-hidden select-none">
        <marquee scrollamount="4" className="block w-full outline-none">
          {getDailyAdvice()}
        </marquee>
      </div>

      <div className="bg-gradient-to-br from-theme-primary to-theme-primary-hover text-white rounded-b-[2.5rem] p-6 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 mix-blend-overlay pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        {/* Header bar */}
        <div className="flex justify-between items-start z-10 relative">
          <div>
            <h2 className="text-sm font-medium text-white/90 flex items-center gap-1">
              <span>{format(currentDate, 'dd MMMM yyyy')}</span>
              <span className="opacity-50">|</span>
              <span>{getBengaliDate(currentDate)}</span>
            </h2>
            <p className="text-xs text-white/80 mt-1 font-semibold tracking-wide">
              {getHijriDate(currentDate)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowSettings(!showSettings)} 
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all active:scale-95"
            >
              <Settings size={18} />
            </button>
            <button 
              onClick={toggleTheme} 
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all active:scale-95"
            >
              {mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        {/* Configuration settings dropdown panel */}
        {showSettings && (
          <div className="mt-4 p-4 bg-black/20 border border-white/10 rounded-3xl animate-fade-in z-20 relative space-y-4 text-xs">
            <h3 className="font-extrabold text-white/90 uppercase tracking-widest text-[10px]">Configure Application</h3>
            
            {/* Language & Theme Selectors */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-white/70 block mb-1 font-bold flex items-center gap-1">
                  <Languages size={10} /> LANGUAGE
                </span>
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl p-2 font-bold outline-none"
                >
                  <option value="bn" className="text-slate-800 font-bold">Bengali (বাংলা)</option>
                  <option value="en" className="text-slate-800 font-bold">English</option>
                </select>
              </div>

              <div>
                <span className="text-[10px] text-white/70 block mb-1 font-bold flex items-center gap-1">
                  <Palette size={10} /> APPEARANCE (25+ Colors)
                </span>
                <select 
                  value={theme} 
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl p-2 font-bold outline-none"
                >
                  {themesList.map(t => (
                    <option key={t.id} value={t.id} className="text-slate-800 font-bold">{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Madhhab setting */}
            <div>
              <span className="text-[10px] text-white/70 block mb-1 font-bold">CALCULATION METHOD</span>
              <div className="grid grid-cols-5 gap-1 bg-white/10 p-0.5 rounded-xl text-[10px]">
                {['shafi', 'hanafi', 'maliki', 'hanbali', 'jafari'].map((m) => (
                  <button 
                    key={m}
                    onClick={() => setMadhhab(m)} 
                    className={`py-1.5 rounded-lg transition-all capitalize font-bold ${madhhab === m ? 'bg-white text-theme-primary shadow' : 'text-white hover:bg-white/5'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Geolocation */}
            <div>
              <span className="text-[10px] text-white/70 block mb-1 font-bold">COORDINATES & LOCATION</span>
              <button 
                onClick={requestGeolocation} 
                className="w-full flex items-center justify-center gap-1 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold mb-2 transition-all"
              >
                <Navigation size={12} /> Use Live GPS Position
              </button>
              
              <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                {locationsDb.map((loc) => (
                  <button
                    key={loc.name}
                    onClick={() => selectLocation(loc)}
                    className="w-full text-left p-1.5 hover:bg-white/10 rounded-lg flex justify-between items-center text-[11px]"
                  >
                    <span>{loc.name}</span>
                    {locationName === loc.name && <Check size={12} className="text-yellow-300" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Location & GPS badge */}
        <div className="mt-5 flex items-center justify-between z-10 relative">
          <div className="flex items-center space-x-1.5 bg-white/10 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/10">
            <MapPin size={14} className="text-yellow-300 animate-pulse" />
            <span className="text-xs font-semibold">{locationName}</span>
          </div>
          <span className="text-xs font-bold bg-white/15 px-3 py-1.5 rounded-full">32°C • Clear</span>
        </div>

        {/* Prayer Time card */}
        <div className="mt-4 bg-white/10 backdrop-blur-md rounded-3xl p-4 border border-white/20 shadow-inner z-10 relative">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[10px] text-white/80 uppercase tracking-widest font-bold block">Next Prayer</span>
              <span className="text-lg font-bold tracking-tight">{nextPrayerName}</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-yellow-300 block">{timeRemaining}</span>
              <span className="text-[10px] text-white/85 block">Remaining</span>
            </div>
          </div>

          {/* Curving sun arc */}
          <div className="w-full h-14 relative mt-4 overflow-visible">
            <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
              <path 
                d="M 0 50 Q 50 10 100 50" 
                fill="none" 
                stroke="rgba(255, 255, 255, 0.2)" 
                strokeWidth="2" 
                strokeDasharray="4 2"
              />
              {sunPos.cx >= 0 && (
                <path 
                  d={`M 0 50 Q 50 10 ${sunPos.cx} ${sunPos.cy}`} 
                  fill="none" 
                  stroke="url(#sunGrad)" 
                  strokeWidth="2.5" 
                />
              )}
              <line x1="50" y1="26" x2="50" y2="34" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" />
              <defs>
                <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
              </defs>
              {sunPos.cx >= 0 && (
                <g transform={`translate(${sunPos.cx - 3.5}, ${sunPos.cy - 3.5})`}>
                  <circle cx="3.5" cy="3.5" r="3.5" fill="#fbbf24" className="animate-ping opacity-75" />
                  <circle cx="3.5" cy="3.5" r="3" fill="#fbbf24" />
                </g>
              )}
            </svg>
            
            <div className="flex justify-between items-center text-[10px] opacity-75 font-semibold mt-1">
              <span>Fajr {prayerTimes ? format(prayerTimes.fajr, 'hh:mm a') : '04:10 AM'}</span>
              <span className="text-yellow-300">Dhuhr {prayerTimes ? format(prayerTimes.dhuhr, 'hh:mm a') : '12:05 PM'}</span>
              <span>Maghrib {prayerTimes ? format(prayerTimes.maghrib, 'hh:mm a') : '06:45 PM'}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Header;
