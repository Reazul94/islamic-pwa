import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Map, Heart, Calendar, ArrowLeft, Download, Database, RefreshCw, BookOpen } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';

const OtherTab = () => {
  const navigate = useNavigate();
  const { coordinates } = useSettingsStore();
  const [activeView, setActiveView] = useState('grid'); // grid, calendar, mosque
  const readerRef = useRef(null);
  
  // PWA Install state
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
      setDeferredPrompt(null);
    }
  };

  // Database Backup/Restore Actions
  const handleExportData = () => {
    const data = {
      salatTracker: localStorage.getItem('salatTracker') || '{}',
      settings: localStorage.getItem('islamic-settings') || '{}',
      bookmarks: localStorage.getItem('bookmarks') || '[]',
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `islamic-pwa-backup-${new Date().toLocaleDateString()}.json`;
    link.click();
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.salatTracker) localStorage.setItem('salatTracker', imported.salatTracker);
        if (imported.settings) localStorage.setItem('islamic-settings', imported.settings);
        if (imported.bookmarks) localStorage.setItem('bookmarks', imported.bookmarks);
        alert("Data imported successfully! Reloading page...");
        window.location.reload();
      } catch (err) {
        alert("Invalid backup file format.");
      }
    };
    reader.readAsText(file);
  };

  const handleResetCache = () => {
    if (confirm("Are you sure you want to clear all prayer logs, settings, and cached Quran recitations?")) {
      localStorage.clear();
      alert("Local cache cleared successfully! Re-initializing...");
      window.location.reload();
    }
  };

  const menuItems = [
    { id: 'qibla', title: 'Qibla Compass', icon: Compass, desc: 'Live compass using orientation sensors', action: () => navigate('/compass') },
    { id: 'names', title: 'Names of Allah', icon: Heart, desc: '99 names with meanings and benefits', action: () => navigate('/names') },
    { id: 'calendar', title: 'Islamic Calendar', icon: Calendar, desc: 'Countdown to Ramadan, Eid, and Ashura', action: () => { setActiveView('calendar'); scrollDetail(); } },
    { id: 'mosque', title: 'Mosque Locator', icon: Map, desc: 'Find nearest mosque using maps', action: () => { setActiveView('mosque'); scrollDetail(); } }
  ];

  const scrollDetail = () => {
    setTimeout(() => {
      if (readerRef.current) {
        readerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const renderGrid = () => (
    <div className="p-4 space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-theme-text mb-4">Other Tools & Settings</h2>
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.id} 
                onClick={item.action}
                className="bg-theme-card p-4 rounded-3xl shadow-sm border border-theme-border flex flex-col items-center justify-center text-center hover:shadow-md cursor-pointer hover:border-theme-primary transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-theme-primary-light text-theme-primary rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-sm text-theme-text">{item.title}</h3>
                <p className="text-[10px] text-theme-secondary mt-1 leading-snug">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* PWA INSTALL CARD */}
      {isInstallable && (
        <div className="bg-gradient-to-r from-theme-primary to-theme-primary-hover text-white p-5 rounded-3xl shadow-md flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm">Download App</h3>
            <p className="text-[10px] opacity-90 mt-0.5">Install Islamic PWA directly onto your home screen.</p>
          </div>
          <button 
            onClick={handleInstallApp}
            className="flex items-center gap-1 bg-white text-theme-primary font-bold px-4 py-2.5 rounded-xl text-xs active:scale-95 transition-transform"
          >
            <Download size={14} /> Install PWA
          </button>
        </div>
      )}

      {/* DATABASE MANAGEMENT UTILITIES */}
      <div className="bg-theme-card p-5 rounded-3xl border border-theme-border shadow-sm space-y-4">
        <h3 className="font-extrabold text-sm text-theme-text flex items-center gap-2">
          <Database size={18} className="text-theme-primary" />
          ডাটাবেজ ব্যবস্থাপনা ও ক্যাশ ইউটিলিটি
        </h3>

        <div className="space-y-2">
          <button 
            onClick={handleExportData}
            className="w-full flex items-center justify-center gap-2 py-3 bg-theme-secondary hover:bg-theme-primary-light rounded-2xl text-xs font-bold text-theme-primary transition-all active:scale-95"
          >
            সব ডাটা ডাউনলোড (JSON)
          </button>

          <label className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-theme-border hover:border-theme-primary rounded-2xl text-xs font-bold text-theme-secondary cursor-pointer transition-all active:scale-95">
            <span>ডাটা ইম্পোর্ট করুন (JSON)</span>
            <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
          </label>

          <button 
            onClick={handleResetCache}
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl text-xs font-bold transition-all active:scale-95"
          >
            <RefreshCw size={14} /> ডাটাবেজ ক্যাশ রিসেট
          </button>
        </div>
      </div>

      {/* APP INSTRUCTIONS */}
      <div className="bg-theme-card p-5 rounded-3xl border border-theme-border shadow-sm space-y-3 text-xs leading-relaxed text-theme-secondary">
        <h3 className="font-bold text-sm text-theme-text flex items-center gap-2">
          <BookOpen size={16} className="text-theme-primary" /> app instructions / ব্যবহার নির্দেশিকা
        </h3>
        <p>1. <strong>Offline First:</strong> This application calculates all prayer times completely locally. Once loaded, it needs no active network connection.</p>
        <p>2. <strong>Audio Caching:</strong> Quran translations and recitations are automatically stored in IndexedDB when loaded, letting you replay them while offline.</p>
        <p>3. <strong>Homescreen Install:</strong> Tap the "Install PWA" button to run this app natively without web browser frames.</p>
      </div>

    </div>
  );

  const renderCalendar = () => {
    const events = [
      { name: 'Ramadan 1448 H', date: 'Feb 8, 2027', daysLeft: 213 },
      { name: 'Eid-ul-Fitr', date: 'Mar 10, 2027', daysLeft: 243 },
      { name: 'Arafah & Eid-ul-Adha', date: 'May 17, 2027', daysLeft: 311 },
      { name: 'Ashura (10 Muharram)', date: 'July 24, 2026', daysLeft: 15 }
    ];

    return (
      <div ref={readerRef} className="p-4 pb-24 animate-fade-in scroll-mt-2">
        <button 
          onClick={() => setActiveView('grid')} 
          className="flex items-center gap-1.5 text-xs font-semibold text-theme-primary mb-4 bg-theme-secondary px-3 py-1.5 rounded-full"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <h3 className="text-lg font-bold text-theme-text mb-4">Important Days</h3>

        <div className="space-y-3.5">
          {events.map((evt, idx) => (
            <div key={idx} className="bg-theme-card p-4.5 rounded-2xl border border-theme-border shadow-sm flex justify-between items-center">
              <div>
                <h4 className="font-bold text-sm text-theme-text">{evt.name}</h4>
                <span className="text-[10px] text-theme-secondary font-medium">{evt.date}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-theme-primary bg-theme-primary-light px-3 py-1.5 rounded-xl">
                  {evt.daysLeft} days left
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMosqueLocator = () => (
    <div ref={readerRef} className="p-4 pb-24 animate-fade-in text-center scroll-mt-2">
      <button 
        onClick={() => setActiveView('grid')} 
        className="flex items-center gap-1.5 text-xs font-semibold text-theme-primary mb-4 bg-theme-secondary px-3 py-1.5 rounded-full"
      >
        <ArrowLeft size={14} /> Back
      </button>

      <div className="bg-theme-card rounded-3xl border border-theme-border p-6 shadow-sm flex flex-col items-center">
        <Map size={32} className="text-theme-primary mb-3" />
        <h3 className="font-bold text-base mb-2">Find Nearby Mosques</h3>
        <p className="text-xs text-theme-secondary max-w-xs mb-6">
          Search for local mosques using offline mapping or deep-link direction maps.
        </p>

        <a 
          href={`https://www.google.com/maps/search/mosque+near+me/@${coordinates.latitude},${coordinates.longitude},15z`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 bg-theme-primary hover:bg-theme-primary-hover text-white rounded-2xl text-xs font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
        >
          Open in Google Maps
        </a>
      </div>
    </div>
  );

  switch (activeView) {
    case 'calendar': return renderCalendar();
    case 'mosque': return renderMosqueLocator();
    default: return renderGrid();
  }
};

export default OtherTab;
