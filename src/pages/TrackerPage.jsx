import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

const TrackerPage = () => {
  const navigate = useNavigate();
  const [trackerData, setTrackerData] = useState(
    JSON.parse(localStorage.getItem('salatTracker')) || {}
  );

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
    <div className="min-h-screen bg-theme-bg text-theme-text p-4 pb-20 max-w-2xl mx-auto shadow-xl transition-colors duration-300">
      <div className="flex items-center space-x-3 mb-6">
        <button 
          onClick={() => navigate('/')} 
          className="p-2 bg-theme-secondary hover:bg-theme-primary-light rounded-full transition-all"
        >
          <ArrowLeft size={18} className="text-theme-primary" />
        </button>
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Salat Tracker</h2>
          <p className="text-xs text-theme-secondary">Log your daily prayers and view consistency charts</p>
        </div>
      </div>

      <div className="bg-theme-card p-5 rounded-3xl border border-theme-border shadow-sm mb-6">
        <h3 className="font-bold text-sm text-theme-text mb-4">Salat Performance (Today)</h3>
        
        <div className="space-y-3">
          {salats.map((salat) => (
            <div 
              key={salat.id}
              onClick={() => toggleSalat(salat.id)}
              className="flex items-center justify-between p-3.5 bg-theme-secondary border border-theme-border rounded-2xl cursor-pointer hover:border-theme-primary"
            >
              <div>
                <h4 className="font-bold text-sm text-theme-text">{salat.label}</h4>
                <span className="text-[10px] text-theme-secondary font-medium">{salat.time}</span>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                todayData[salat.id] 
                  ? 'bg-theme-primary border-theme-primary text-white' 
                  : 'border-theme-border'
              }`}>
                {todayData[salat.id] && <CheckCircle2 size={16} fill="currentColor" className="text-white" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Consistency Chart */}
      <div className="bg-theme-card p-5 rounded-3xl border border-theme-border shadow-sm">
        <h3 className="font-bold text-sm text-theme-text mb-4">Weekly Salat consistency</h3>
        <div className="flex justify-between items-end h-28 px-2 pt-4">
          {weeklyStats.map((stat, idx) => {
            const heightPercent = (stat.count / 6) * 100;
            return (
              <div key={idx} className="flex flex-col items-center flex-1 group">
                <span className="text-[10px] text-theme-secondary opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-semibold">
                  {stat.count}/6
                </span>
                <div className="w-6 bg-theme-secondary rounded-full h-20 relative overflow-hidden">
                  <div 
                    style={{ height: `${heightPercent}%` }}
                    className="absolute bottom-0 left-0 w-full bg-theme-primary rounded-full transition-all duration-500"
                  ></div>
                </div>
                <span className="text-[10px] text-theme-secondary font-medium mt-2">{stat.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrackerPage;
