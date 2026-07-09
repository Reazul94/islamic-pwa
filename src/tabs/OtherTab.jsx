import React, { useState, useEffect } from 'react';
import { ArrowLeft, Compass, Map, Heart, Calendar, Play, Pause } from 'lucide-react';
import namesData from '../data/namesOfAllah.json';
import { useSettingsStore } from '../store/settingsStore';

const OtherTab = () => {
  const [activeView, setActiveView] = useState('grid'); // grid, qibla, mosque, names, calendar
  const { coordinates } = useSettingsStore();

  // COMPASS STATE
  const [heading, setHeading] = useState(0);
  const [qiblaDir, setQiblaDir] = useState(0);

  const menuItems = [
    { id: 'qibla', title: 'Qibla Compass', icon: Compass, desc: 'Live compass using orientation sensors' },
    { id: 'mosque', title: 'Mosque Locator', icon: Map, desc: 'Find nearest mosque using maps' },
    { id: 'names', title: 'Names of Allah', icon: Heart, desc: '99 names with meanings and benefits' },
    { id: 'calendar', title: 'Islamic Calendar', icon: Calendar, desc: 'Countdown to Ramadan, Eid, and Ashura' }
  ];

  // 1. QIBLA COMPASS LOGIC
  // Kaaba Coordinates: Lat 21.4225° N, Lng 39.8262° E
  const calculateQiblaDirection = (lat, lng) => {
    const kLat = 21.4225 * Math.PI / 180;
    const kLng = 39.8262 * Math.PI / 180;
    const uLat = lat * Math.PI / 180;
    const uLng = lng * Math.PI / 180;

    const y = Math.sin(kLng - uLng);
    const x = Math.cos(uLat) * Math.tan(kLat) - Math.sin(uLat) * Math.cos(kLng - uLng);
    
    let qiblaRad = Math.atan2(y, x);
    let qiblaDeg = qiblaRad * 180 / Math.PI;
    if (qiblaDeg < 0) qiblaDeg += 360;
    
    return qiblaDeg;
  };

  useEffect(() => {
    if (activeView === 'qibla') {
      const qDir = calculateQiblaDirection(coordinates.latitude, coordinates.longitude);
      setQiblaDir(qDir);

      const handleOrientation = (e) => {
        // alpha corresponds to rotation around z-axis
        if (e.alpha !== null) {
          setHeading(360 - e.alpha);
        }
      };

      window.addEventListener('deviceorientation', handleOrientation, true);
      return () => window.removeEventListener('deviceorientation', handleOrientation);
    }
  }, [activeView, coordinates]);

  const renderQiblaCompass = () => {
    // Rotation of Kaaba pointer relative to device heading
    const kaabaRotation = qiblaDir - heading;

    return (
      <div className="p-4 pb-24 animate-fade-in text-center">
        <button 
          onClick={() => setActiveView('grid')} 
          className="flex items-center gap-1.5 text-xs font-semibold text-islamic-600 dark:text-islamic-400 mb-6 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm flex flex-col items-center">
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 mb-2">Qibla Compass</h3>
          <p className="text-xs text-slate-400 max-w-xs mb-8">
            Qibla is at <span className="font-bold text-islamic-600">{qiblaDir.toFixed(1)}°</span> from North. Align your device until the Kaaba needle points straight up.
          </p>

          {/* Compass Dial UI */}
          <div className="w-56 h-56 rounded-full border-4 border-slate-200 dark:border-slate-700 relative flex items-center justify-center shadow-lg bg-slate-50 dark:bg-slate-900 select-none">
            {/* Compass Card Rotating */}
            <div 
              style={{ transform: `rotate(${-heading}deg)` }}
              className="absolute inset-2 rounded-full border border-dashed border-slate-350 dark:border-slate-800 flex items-center justify-center transition-transform duration-200"
            >
              <span className="absolute top-1 text-xs font-bold text-red-500">N</span>
              <span className="absolute right-1 text-xs font-bold text-slate-400">E</span>
              <span className="absolute bottom-1 text-xs font-bold text-slate-400">S</span>
              <span className="absolute left-1 text-xs font-bold text-slate-400">W</span>
            </div>

            {/* Kaaba Needle Rotating */}
            <div 
              style={{ transform: `rotate(${kaabaRotation}deg)` }}
              className="absolute w-2 h-44 flex flex-col justify-between items-center transition-transform duration-100"
            >
              {/* Pointer to Kaaba */}
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[20px] border-b-islamic-600 filter drop-shadow"></div>
              {/* Counter balance */}
              <div className="w-2 h-8 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
            </div>
            
            {/* Center Pin */}
            <div className="w-5 h-5 bg-white dark:bg-slate-850 rounded-full border-2 border-slate-400 z-10 flex items-center justify-center font-bold text-[8px]">
              🕋
            </div>
          </div>
          
          <div className="mt-8 text-xs text-slate-400 font-medium">
            Device Heading: {heading.toFixed(0)}°
          </div>
        </div>
      </div>
    );
  };

  // 2. MOSQUE LOCATOR
  const renderMosqueLocator = () => {
    return (
      <div className="p-4 pb-24 animate-fade-in text-center">
        <button 
          onClick={() => setActiveView('grid')} 
          className="flex items-center gap-1.5 text-xs font-semibold text-islamic-600 dark:text-islamic-400 mb-4 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm flex flex-col items-center">
          <Map size={32} className="text-islamic-600 mb-3" />
          <h3 className="font-bold text-base mb-2">Find Nearby Mosques</h3>
          <p className="text-xs text-slate-400 max-w-xs mb-6">
            Search for local mosques using offline mapping or deep-link direction maps.
          </p>

          <a 
            href={`https://www.google.com/maps/search/mosque+near+me/@${coordinates.latitude},${coordinates.longitude},15z`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-islamic-600 hover:bg-islamic-500 text-white rounded-2xl text-xs font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            Open in Google Maps
          </a>
        </div>
      </div>
    );
  };

  // 3. NAMES OF ALLAH
  const [playingNameId, setPlayingNameId] = useState(null);

  const togglePlayName = (nameId) => {
    if (playingNameId === nameId) {
      setPlayingNameId(null);
    } else {
      setPlayingNameId(nameId);
      // Mock playing pronunciation audio
      alert(`Playing pronunciation audio for name (cached offline audio asset).`);
      setTimeout(() => setPlayingNameId(null), 2000);
    }
  };

  const renderNamesOfAllah = () => {
    return (
      <div className="p-4 pb-24 animate-fade-in">
        <button 
          onClick={() => setActiveView('grid')} 
          className="flex items-center gap-1.5 text-xs font-semibold text-islamic-600 dark:text-islamic-400 mb-4 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3">Asma-ul-Husna (99 Names of Allah)</h3>

        <div className="grid grid-cols-2 gap-3.5">
          {namesData.map((name) => (
            <div 
              key={name.id} 
              className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center justify-between text-center relative group"
            >
              <div className="absolute top-2 right-2">
                <button 
                  onClick={() => togglePlayName(name.id)}
                  className="p-1.5 bg-islamic-50 dark:bg-slate-700 text-islamic-600 dark:text-islamic-400 rounded-full"
                >
                  {playingNameId === name.id ? <Pause size={10} /> : <Play size={10} />}
                </button>
              </div>
              
              <div className="w-9 h-9 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-700 text-[10px] text-slate-400 flex items-center justify-center font-bold mb-2">
                {name.id}
              </div>

              <h4 className="text-2xl font-arabic text-slate-800 dark:text-slate-100 leading-normal mb-1">{name.ar}</h4>
              <p className="text-xs font-bold text-islamic-600 dark:text-islamic-400">{name.bn_trans}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-semibold leading-tight">{name.en}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{name.bn}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 4. ISLAMIC CALENDAR & IMPORTANT DAYS
  const renderCalendar = () => {
    // Mock countdown days
    const events = [
      { name: 'Ramadan 1448 H', date: 'Feb 8, 2027', daysLeft: 213 },
      { name: 'Eid-ul-Fitr', date: 'Mar 10, 2027', daysLeft: 243 },
      { name: 'Arafah & Eid-ul-Adha', date: 'May 17, 2027', daysLeft: 311 },
      { name: 'Ashura (10 Muharram)', date: 'July 24, 2026', daysLeft: 15 }
    ];

    return (
      <div className="p-4 pb-24 animate-fade-in">
        <button 
          onClick={() => setActiveView('grid')} 
          className="flex items-center gap-1.5 text-xs font-semibold text-islamic-600 dark:text-islamic-400 mb-4 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Important Days</h3>

        <div className="space-y-3.5">
          {events.map((evt, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex justify-between items-center">
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{evt.name}</h4>
                <span className="text-[10px] text-slate-400 font-medium">{evt.date}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-islamic-600 dark:text-islamic-400 bg-islamic-50 dark:bg-slate-700 px-3 py-1.5 rounded-xl">
                  {evt.daysLeft} days left
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // MAIN GRID VIEW
  const renderGrid = () => {
    return (
      <div className="p-4 pb-24 animate-fade-in">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Other Tools</h2>
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.id} 
                onClick={() => setActiveView(item.id)}
                className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/80 flex flex-col items-center justify-center text-center hover:shadow-md cursor-pointer hover:border-islamic-200 dark:hover:border-slate-600 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-islamic-50 dark:bg-slate-700 text-islamic-600 dark:text-islamic-400 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">{item.title}</h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 leading-snug">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Sadaqah Jariyah Banner */}
        <div className="mt-8 bg-gradient-to-br from-islamic-600 to-islamic-800 text-white rounded-3xl p-5 shadow-lg flex items-center justify-between relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-white opacity-5 rounded-full blur-xl pointer-events-none"></div>
          <div>
            <h3 className="font-bold text-base">Support Muslim Bangla</h3>
            <p className="text-xs opacity-90 mt-1">Sadaqah Jariyah for app maintenance.</p>
          </div>
          <button className="bg-white text-islamic-700 px-4 py-2 rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-transform shrink-0">
            Donate
          </button>
        </div>
      </div>
    );
  };

  switch (activeView) {
    case 'qibla': return renderQiblaCompass();
    case 'mosque': return renderMosqueLocator();
    case 'names': return renderNamesOfAllah();
    case 'calendar': return renderCalendar();
    default: return renderGrid();
  }
};

export default OtherTab;
