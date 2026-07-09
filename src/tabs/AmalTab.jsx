import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, HandMetal, Moon, Navigation, Plus, RotateCcw, Search } from 'lucide-react';
import duasData from '../data/duas.json';

const AmalTab = () => {
  const [activeView, setActiveView] = useState('grid'); // grid, tracker, tasbih, duas, mushaf
  
  // TASBIH STATE
  const [tasbihCount, setTasbihCount] = useState(0);
  const [tasbihTarget, setTasbihTarget] = useState(33);
  
  // SALAT TRACKER STATE
  const [trackerData, setTrackerData] = useState(
    JSON.parse(localStorage.getItem('salatTracker')) || {}
  );
  
  // HISNUL MUSLIM STATE
  const [duaSearch, setDuaSearch] = useState('');

  const menuItems = [
    { id: 'tracker', title: 'Daily Salat Tracker', icon: CheckCircle2, desc: 'Log prayers & view consistency charts' },
    { id: 'tasbih', title: 'Digital Tasbih', icon: HandMetal, desc: 'Offline count clicker with target vibration' },
    { id: 'duas', title: 'Hisnul Muslim', icon: Moon, desc: 'Dua & Azkar explorer with references' },
    { id: 'mushaf', title: 'Mushaf', icon: Navigation, desc: 'Physical Quran page reading layout' }
  ];

  // 1. SALAT TRACKER LOGIC
  const getTodayKey = () => {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  };

  const toggleSalat = (salatName) => {
    const todayKey = getTodayKey();
    const currentDayData = trackerData[todayKey] || {
      fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false, tahajjud: false
    };
    
    const updatedDay = {
      ...currentDayData,
      [salatName]: !currentDayData[salatName]
    };

    const newTrackerData = {
      ...trackerData,
      [todayKey]: updatedDay
    };

    setTrackerData(newTrackerData);
    localStorage.setItem('salatTracker', JSON.stringify(newTrackerData));
  };

  // Get last 7 days calculations for analytics
  const getWeeklyStats = () => {
    const stats = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      const dayData = trackerData[key] || {};
      const count = Object.keys(dayData).filter(k => dayData[k] === true).length;
      stats.push({
        label: d.toLocaleDateString('en-US', { weekday: 'short' }),
        count: count
      });
    }
    return stats;
  };

  const weeklyStats = getWeeklyStats();

  const renderSalatTracker = () => {
    const todayKey = getTodayKey();
    const todayData = trackerData[todayKey] || {
      fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false, tahajjud: false
    };

    const salats = [
      { id: 'fajr', label: 'Fajr', time: '4:10 AM' },
      { id: 'dhuhr', label: 'Dhuhr', time: '12:05 PM' },
      { id: 'asr', label: 'Asr', time: '4:35 PM' },
      { id: 'maghrib', label: 'Maghrib', time: '6:45 PM' },
      { id: 'isha', label: 'Isha', time: '8:05 PM' },
      { id: 'tahajjud', label: 'Tahajjud (Sunnah)', time: '3:00 AM' }
    ];

    return (
      <div className="p-4 pb-24 animate-fade-in">
        <button 
          onClick={() => setActiveView('grid')} 
          className="flex items-center gap-1.5 text-xs font-semibold text-islamic-600 dark:text-islamic-400 mb-4 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm mb-6">
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 mb-4">Salat Performance (Today)</h3>
          
          <div className="space-y-3">
            {salats.map((salat) => (
              <div 
                key={salat.id}
                onClick={() => toggleSalat(salat.id)}
                className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl cursor-pointer hover:border-islamic-200"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{salat.label}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">{salat.time}</span>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  todayData[salat.id] 
                    ? 'bg-islamic-600 border-islamic-600 text-white' 
                    : 'border-slate-300 dark:border-slate-600'
                }`}>
                  {todayData[salat.id] && <CheckCircle2 size={16} fill="currentColor" className="text-white" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Consistency Analytics */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-4">Weekly Salat consistency</h3>
          <div className="flex justify-between items-end h-28 px-2 pt-4">
            {weeklyStats.map((stat, idx) => {
              // max 6 prayers
              const heightPercent = (stat.count / 6) * 100;
              return (
                <div key={idx} className="flex flex-col items-center flex-1 group">
                  <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-semibold">
                    {stat.count}/6
                  </span>
                  <div className="w-6 bg-slate-100 dark:bg-slate-700 rounded-full h-20 relative overflow-hidden">
                    <div 
                      style={{ height: `${heightPercent}%` }}
                      className="absolute bottom-0 left-0 w-full bg-islamic-600 rounded-full transition-all duration-500"
                    ></div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium mt-2">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // 2. DIGITAL TASBIH LOGIC
  const incrementTasbih = () => {
    const newCount = tasbihCount + 1;
    setTasbihCount(newCount);
    
    // Haptic feedback
    if (navigator.vibrate) {
      if (newCount === tasbihTarget) {
        navigator.vibrate([100, 50, 100]); // Long buzz when target met
      } else {
        navigator.vibrate(30); // Short click vibration
      }
    }
  };

  const resetTasbih = () => {
    setTasbihCount(0);
  };

  const renderTasbih = () => {
    return (
      <div className="p-4 pb-24 animate-fade-in">
        <button 
          onClick={() => setActiveView('grid')} 
          className="flex items-center gap-1.5 text-xs font-semibold text-islamic-600 dark:text-islamic-400 mb-4 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm flex flex-col items-center text-center">
          <span className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Dhikr Counter</span>
          <h3 className="font-bold text-lg mb-8">Subhanallah / Alhamdulillah / Allahu Akbar</h3>

          {/* Circle Clicker */}
          <div 
            onClick={incrementTasbih}
            className="w-48 h-48 rounded-full bg-gradient-to-br from-islamic-500 to-islamic-600 text-white flex flex-col items-center justify-center shadow-xl border-8 border-white dark:border-slate-800 cursor-pointer active:scale-95 transition-transform select-none relative"
          >
            <span className="text-5xl font-extrabold tracking-tight">{tasbihCount}</span>
            <span className="text-[10px] text-islamic-100 uppercase tracking-wider font-bold mt-2">Target: {tasbihTarget}</span>
          </div>

          {/* Configuration */}
          <div className="flex items-center justify-between w-full mt-10">
            <button 
              onClick={resetTasbih}
              className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/20 px-4 py-2.5 rounded-xl active:scale-95 transition-all"
            >
              <RotateCcw size={14} /> Reset
            </button>

            <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-700 p-0.5 rounded-xl">
              {[33, 99, 100].map((tVal) => (
                <button
                  key={tVal}
                  onClick={() => setTasbihTarget(tVal)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${tasbihTarget === tVal ? 'bg-white dark:bg-slate-800 shadow-sm text-islamic-600 dark:text-islamic-400' : 'text-slate-500'}`}
                >
                  {tVal}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 3. HISNUL MUSLIM LOGIC
  const renderHisnulMuslim = () => {
    return (
      <div className="p-4 pb-24 animate-fade-in">
        <button 
          onClick={() => setActiveView('grid')} 
          className="flex items-center gap-1.5 text-xs font-semibold text-islamic-600 dark:text-islamic-400 mb-4 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3">Hisnul Muslim (Dua Explorer)</h3>
        
        <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 mb-4 shadow-sm">
          <Search size={18} className="text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search dua by keywords..."
            value={duaSearch}
            onChange={(e) => setDuaSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full text-slate-800 dark:text-slate-100 placeholder-slate-400"
          />
        </div>

        <div className="space-y-4">
          {duasData
            .filter(d => d.title.toLowerCase().includes(duaSearch.toLowerCase()) || d.bn_title.toLowerCase().includes(duaSearch.toLowerCase()))
            .map((dua) => (
              <div key={dua.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] bg-islamic-50 dark:bg-slate-700 text-islamic-600 dark:text-islamic-400 px-2 py-0.5 rounded-md font-bold">
                    {dua.category}
                  </span>
                  <span className="text-[10px] text-slate-400">{dua.ref}</span>
                </div>
                
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-3">{dua.title} ({dua.bn_title})</h4>
                
                <p className="text-right text-lg font-arabic leading-loose tracking-wide mb-3 text-slate-800 dark:text-slate-100">
                  {dua.ar}
                </p>

                <div className="space-y-2 border-t border-slate-100 dark:border-slate-700 pt-3 text-xs leading-relaxed">
                  <p className="text-slate-500 italic"><strong className="text-islamic-600 dark:text-islamic-400 not-italic">Pronunciation:</strong> {dua.bn_trans}</p>
                  <p className="text-slate-800 dark:text-slate-200"><strong>Bengali:</strong> {dua.bn_mean}</p>
                  <p className="text-slate-600 dark:text-slate-400 italic"><strong>English:</strong> {dua.en_mean}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  };

  // 4. MUSHAF QURAN PAGE SIMULATOR
  const renderMushaf = () => {
    return (
      <div className="p-4 pb-24 animate-fade-in">
        <button 
          onClick={() => setActiveView('grid')} 
          className="flex items-center gap-1.5 text-xs font-semibold text-islamic-600 dark:text-islamic-400 mb-4 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <div className="bg-[#fcf8f2] dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-3xl p-6 border-2 border-[#e6d5bf] dark:border-slate-700 shadow-md max-w-md mx-auto relative font-serif">
          {/* Page frame borders */}
          <div className="absolute top-2 bottom-2 left-2 right-2 border border-[#f0e3d0] dark:border-slate-700 pointer-events-none rounded-2xl"></div>
          
          <div className="flex justify-between items-center text-[10px] text-[#8c7456] dark:text-slate-400 mb-4 px-2">
            <span>Surah Al-Fatihah</span>
            <span>Juz' 1</span>
          </div>

          <div className="text-center font-arabic text-2xl leading-[3.5rem] tracking-wide py-4 select-text">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝
            الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝
            الرَّحْمَٰنِ الرَّحِيمِ ۝
            مَالِكِ يَوْمِ الدِّينِ ۝
            إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝
            اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝
            صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ۝
          </div>

          <div className="flex justify-center text-xs text-[#8c7456] dark:text-slate-400 mt-6 border-t border-[#f0e3d0] dark:border-slate-700 pt-3">
            <span>Page 1</span>
          </div>
        </div>
      </div>
    );
  };

  // MAIN GRID NAVIGATION
  const renderGrid = () => {
    return (
      <div className="p-4 pb-24 animate-fade-in">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Amal (Actions)</h2>
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
      </div>
    );
  };

  switch (activeView) {
    case 'tracker': return renderSalatTracker();
    case 'tasbih': return renderTasbih();
    case 'duas': return renderHisnulMuslim();
    case 'mushaf': return renderMushaf();
    default: return renderGrid();
  }
};

export default AmalTab;
