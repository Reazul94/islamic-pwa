import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { MapPin, Sun, Moon, Settings, Check, Navigation } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useSettingsStore } from '../store/settingsStore';
import { getPrayerTimesForDate } from '../utils/prayerCalculator';
import { getBengaliDate, getHijriDate } from '../utils/dateConverter';

const Header = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { madhhab, coordinates, locationName, setMadhhab, setCoordinates } = useSettingsStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showSettings, setShowSettings] = useState(false);
  const [locationInput, setLocationInput] = useState(locationName);
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [nextPrayerName, setNextPrayerName] = useState('');

  // Location suggestions database (offline lookup list)
  const locationsDb = [
    { name: 'Dhaka, Bangladesh', lat: 23.8103, lng: 90.4125 },
    { name: 'Chittagong, Bangladesh', lat: 22.3569, lng: 91.7832 },
    { name: 'Sylhet, Bangladesh', lat: 24.8949, lng: 91.8687 },
    { name: 'Rajshahi, Bangladesh', lat: 24.3636, lng: 88.6241 },
    { name: 'Makkah, Saudi Arabia', lat: 21.4225, lng: 39.8262 },
    { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
    { name: 'New York, USA', lat: 40.7128, lng: -74.0060 }
  ];

  useEffect(() => {
    // Tick current date/time
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Recalculate prayer times
    const times = getPrayerTimesForDate(currentDate, coordinates.latitude, coordinates.longitude, madhhab);
    setPrayerTimes(times);
    
    // Find next prayer and countdown
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
    
    // Fallback to next day's Fajr if all prayers for today passed
    if (!nextTime) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowTimes = getPrayerTimesForDate(tomorrow, coordinates.latitude, coordinates.longitude, madhhab);
      nextName = 'fajr';
      nextTime = tomorrowTimes.fajr;
    }
    
    setNextPrayerName(nextName.toUpperCase());
    
    const diffMs = nextTime - currentDate;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
    
    setTimeRemaining(`${hours}h ${mins}m ${secs}s`);
  }, [currentDate, coordinates, madhhab]);

  const requestGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Approximate location name based on coords (or just coordinate text)
          setCoordinates(latitude, longitude, `Current GPS Position (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`);
          setLocationInput(`GPS Position`);
        },
        (error) => {
          alert('Could not retrieve GPS coordinates. Please select manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const selectLocation = (loc) => {
    setCoordinates(loc.lat, loc.lng, loc.name);
    setLocationInput(loc.name);
    setShowSettings(false);
  };

  // Calculate sun position on the arc
  // Sun travels from Fajr (left) to Maghrib (right)
  const getSunPosition = () => {
    if (!prayerTimes) return { cx: 50, cy: 50 };
    const start = prayerTimes.fajr.getTime();
    const end = prayerTimes.maghrib.getTime();
    const current = currentDate.getTime();
    
    if (current < start || current > end) {
      return { cx: -10, cy: -10 }; // Sun is set, hide
    }
    
    const percent = (current - start) / (end - start);
    // Map percent [0, 1] to arc X [0, 100]
    const cx = percent * 100;
    // Map to semi-circle Y coordinate: (x - 50)^2 + y^2 = 50^2 => y = sqrt(2500 - (x - 50)^2)
    // Flip Y because svg 0,0 is top-left
    const cy = 50 - Math.sqrt(2500 - Math.pow(cx - 50, 2)) * 0.8;
    return { cx, cy };
  };

  const sunPos = getSunPosition();

  return (
    <div className="bg-gradient-to-br from-islamic-700 to-islamic-800 text-white rounded-b-[2.5rem] p-6 shadow-xl relative overflow-hidden">
      {/* Aesthetic geometric overlay background */}
      <div className="absolute inset-0 opacity-5 mix-blend-overlay pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      {/* Header bar */}
      <div className="flex justify-between items-start z-10 relative">
        <div>
          <h2 className="text-sm font-medium text-islamic-100 flex items-center gap-1">
            <span>{format(currentDate, 'dd MMMM yyyy')}</span>
            <span className="opacity-50">|</span>
            <span>{getBengaliDate(currentDate)}</span>
          </h2>
          <p className="text-xs text-islamic-200 mt-1 font-semibold letter tracking-wide">
            {getHijriDate(currentDate)}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowSettings(!showSettings)} 
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 active:scale-95"
          >
            <Settings size={18} />
          </button>
          <button 
            onClick={toggleTheme} 
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 active:scale-95"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      {/* Settings Panel Modal Dropdown */}
      {showSettings && (
        <div className="mt-4 p-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl animate-fade-in z-20 relative">
          <h3 className="text-xs uppercase tracking-wider font-bold text-islamic-100 mb-2">Configure Settings</h3>
          
          {/* Madhhab setting */}
          <div className="flex flex-col gap-1.5 mb-3 pb-2 border-b border-white/10">
            <span className="text-xs">Madhhab (Calculation School):</span>
            <div className="grid grid-cols-5 gap-1 bg-white/10 p-0.5 rounded-lg text-[10px]">
              {['shafi', 'hanafi', 'maliki', 'hanbali', 'jafari'].map((m) => (
                <button 
                  key={m}
                  onClick={() => setMadhhab(m)} 
                  className={`py-1.5 rounded transition-all capitalize font-bold ${madhhab === m ? 'bg-islamic-600 text-white shadow-sm' : 'text-islamic-100 hover:bg-white/5'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Location setup */}
          <div className="mb-2">
            <label className="text-[10px] text-islamic-200 block mb-1">Select / Auto-Detect Location</label>
            <button 
              onClick={requestGeolocation} 
              className="w-full flex items-center justify-center gap-1 py-1.5 bg-islamic-600 hover:bg-islamic-500 rounded-lg text-xs font-semibold mb-2 transition-all"
            >
              <Navigation size={12} /> Use Live GPS
            </button>
            
            <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
              {locationsDb.map((loc) => (
                <button
                  key={loc.name}
                  onClick={() => selectLocation(loc)}
                  className="w-full text-left text-xs p-1.5 hover:bg-white/10 rounded flex justify-between items-center"
                >
                  <span>{loc.name}</span>
                  {locationName === loc.name && <Check size={12} className="text-islamic-300" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Location Tracker & Weather widget */}
      <div className="mt-5 flex items-center justify-between z-10 relative">
        <div className="flex items-center space-x-1.5 bg-white/10 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/10">
          <MapPin size={14} className="text-islamic-300 animate-pulse" />
          <span className="text-xs font-semibold">{locationName}</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-xs font-bold bg-white/15 px-2.5 py-1 rounded-lg">32°C • Clear</span>
        </div>
      </div>

      {/* Dynamic Prayer Time Card */}
      <div className="mt-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-inner z-10 relative">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[10px] text-islamic-200 uppercase tracking-widest font-bold block">Next Prayer</span>
            <span className="text-lg font-bold tracking-tight">{nextPrayerName}</span>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-yellow-300 block">{timeRemaining}</span>
            <span className="text-[10px] text-islamic-200 block">Remaining</span>
          </div>
        </div>

        {/* Curved sun arc */}
        <div className="w-full h-14 relative mt-4 overflow-visible">
          <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
            {/* Sun path curve */}
            <path 
              d="M 0 50 Q 50 10 100 50" 
              fill="none" 
              stroke="rgba(255, 255, 255, 0.25)" 
              strokeWidth="2" 
              strokeDasharray="4 2"
            />
            {/* Filled progress arc */}
            {sunPos.cx >= 0 && (
              <path 
                d={`M 0 50 Q 50 10 ${sunPos.cx} ${sunPos.cy}`} 
                fill="none" 
                stroke="url(#sunGradient)" 
                strokeWidth="2.5" 
              />
            )}
            {/* Center tick for Dhuhr */}
            <line x1="50" y1="26" x2="50" y2="34" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" />
            {/* Glow / gradient definitions */}
            <defs>
              <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
            </defs>
            {/* Sun icon */}
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
  );
};

export default Header;
