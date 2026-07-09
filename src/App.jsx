import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import IlmTab from './tabs/IlmTab';
import AmalTab from './tabs/AmalTab';
import ServiceTab from './tabs/ServiceTab';
import OtherTab from './tabs/OtherTab';
import { useThemeStore } from './store/themeStore';
import { useSettingsStore } from './store/settingsStore';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

// Standalone Routed Pages
import QuranPage from './pages/QuranPage';
import QuranReaderPage from './pages/QuranReaderPage';
import HadithPage from './pages/HadithPage';
import DuaPage from './pages/DuaPage';
import TrackerPage from './pages/TrackerPage';
import TasbihPage from './pages/TasbihPage';
import ZakatPage from './pages/ZakatPage';
import CompassPage from './pages/CompassPage';
import NamesPage from './pages/NamesPage';
import MushafPage from './pages/MushafPage';
import MasayelPage from './pages/MasayelPage';

// Daily Reflections Components
import DailyVerseCard from './components/DailyVerseCard';
import DailyHadithCard from './components/DailyHadithCard';
import DailyDuaCard from './components/DailyDuaCard';

// Main Scrolling Dashboard
const Dashboard = () => {
  const { language } = useSettingsStore();
  const [activeTab, setActiveTab] = useState('ilm');
  
  // SECTION COLLAPSE STATES
  const [reflectionsCollapsed, setReflectionsCollapsed] = useState(() => {
    const saved = localStorage.getItem('islamic_pwa_reflections_collapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [ilmCollapsed, setIlmCollapsed] = useState(() => {
    const saved = localStorage.getItem('islamic_pwa_ilm_collapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [amalCollapsed, setAmalCollapsed] = useState(() => {
    const saved = localStorage.getItem('islamic_pwa_amal_collapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [serviceCollapsed, setServiceCollapsed] = useState(() => {
    const saved = localStorage.getItem('islamic_pwa_service_collapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [otherCollapsed, setOtherCollapsed] = useState(() => {
    const saved = localStorage.getItem('islamic_pwa_other_collapsed');
    return saved ? JSON.parse(saved) : false;
  });

  const ilmRef = useRef(null);
  const amalRef = useRef(null);
  const serviceRef = useRef(null);
  const otherRef = useRef(null);

  // Sync Collapse States
  useEffect(() => {
    localStorage.setItem('islamic_pwa_reflections_collapsed', JSON.stringify(reflectionsCollapsed));
  }, [reflectionsCollapsed]);
  useEffect(() => {
    localStorage.setItem('islamic_pwa_ilm_collapsed', JSON.stringify(ilmCollapsed));
  }, [ilmCollapsed]);
  useEffect(() => {
    localStorage.setItem('islamic_pwa_amal_collapsed', JSON.stringify(amalCollapsed));
  }, [amalCollapsed]);
  useEffect(() => {
    localStorage.setItem('islamic_pwa_service_collapsed', JSON.stringify(serviceCollapsed));
  }, [serviceCollapsed]);
  useEffect(() => {
    localStorage.setItem('islamic_pwa_other_collapsed', JSON.stringify(otherCollapsed));
  }, [otherCollapsed]);

  const handleScrollToTab = (tabId) => {
    setActiveTab(tabId);
    const refs = {
      ilm: ilmRef,
      amal: amalRef,
      service: serviceRef,
      other: otherRef
    };
    const targetRef = refs[tabId];
    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const handleIntersection = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    if (ilmRef.current) observer.observe(ilmRef.current);
    if (amalRef.current) observer.observe(amalRef.current);
    if (serviceRef.current) observer.observe(serviceRef.current);
    if (otherRef.current) observer.observe(otherRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-theme-bg min-h-screen text-theme-text pb-24 transition-colors duration-300">
      <Header />
      
      <main className="w-full space-y-8 mt-6 px-3 md:px-6">
        
        {/* DAILY ISLAMIC REFLECTIONS (COLLAPSIBLE ACCORDION) */}
        <div className="bg-theme-card border border-theme-border rounded-3xl overflow-hidden shadow-sm transition-all duration-300">
          <div 
            onClick={() => setReflectionsCollapsed(!reflectionsCollapsed)}
            className="flex items-center justify-between p-5 cursor-pointer hover:bg-theme-secondary/20 transition-all select-none group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-theme-primary-light text-theme-primary shrink-0">
                <Sparkles className="w-5 h-5 shrink-0" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-black uppercase tracking-wider text-theme-text">
                  {language === 'en' ? 'Daily Islamic Reflections' : 'আজকের ইসলামী অনুধাবন'}
                </h3>
                <p className="text-[10px] text-theme-secondary font-medium">
                  {language === 'en' 
                    ? 'Curated Quranic verse, prophetic Hadith, and Duas for daily barakah'
                    : 'দৈনিক বরকতের জন্য নির্বাচিত কুরআনের আয়াত, হাদিস ও দোয়া'}
                </p>
              </div>
            </div>
            <button type="button" className="p-1 rounded-lg text-theme-secondary hover:text-theme-primary bg-transparent border-0">
              {reflectionsCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </button>
          </div>

          <div className={`${reflectionsCollapsed ? 'hidden' : 'block p-5 pt-0 border-t border-theme-border/50 bg-theme-bg/10 animate-fade-in'}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
              <DailyVerseCard />
              <DailyHadithCard />
              <DailyDuaCard />
            </div>
          </div>
        </div>

        <hr className="border-theme-border mx-4" />

        {/* ILM SECTION */}
        <section id="ilm" ref={ilmRef} className="scroll-mt-4">
          <div className="flex items-center justify-between px-1 mb-3">
            <h2 className="text-lg font-extrabold text-theme-text uppercase tracking-wider">Ilm (Knowledge)</h2>
            <button 
              onClick={() => setIlmCollapsed(!ilmCollapsed)}
              className="p-1.5 hover:bg-theme-secondary rounded-xl text-theme-secondary hover:text-theme-primary transition-all"
            >
              {ilmCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </button>
          </div>
          <div className={ilmCollapsed ? 'hidden' : 'block'}>
            <IlmTab />
          </div>
        </section>
        
        <hr className="border-theme-border mx-4" />

        {/* AMAL SECTION */}
        <section id="amal" ref={amalRef} className="scroll-mt-4">
          <div className="flex items-center justify-between px-1 mb-3">
            <h2 className="text-lg font-extrabold text-theme-text uppercase tracking-wider">Amal (Actions)</h2>
            <button 
              onClick={() => setAmalCollapsed(!amalCollapsed)}
              className="p-1.5 hover:bg-theme-secondary rounded-xl text-theme-secondary hover:text-theme-primary transition-all"
            >
              {amalCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </button>
          </div>
          <div className={amalCollapsed ? 'hidden' : 'block'}>
            <AmalTab />
          </div>
        </section>
        
        <hr className="border-theme-border mx-4" />

        {/* SERVICE SECTION */}
        <section id="service" ref={serviceRef} className="scroll-mt-4">
          <div className="flex items-center justify-between px-1 mb-3">
            <h2 className="text-lg font-extrabold text-theme-text uppercase tracking-wider">Service</h2>
            <button 
              onClick={() => setServiceCollapsed(!serviceCollapsed)}
              className="p-1.5 hover:bg-theme-secondary rounded-xl text-theme-secondary hover:text-theme-primary transition-all"
            >
              {serviceCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </button>
          </div>
          <div className={serviceCollapsed ? 'hidden' : 'block'}>
            <ServiceTab />
          </div>
        </section>
        
        <hr className="border-theme-border mx-4" />

        {/* OTHER SECTION */}
        <section id="other" ref={otherRef} className="scroll-mt-4">
          <div className="flex items-center justify-between px-1 mb-3">
            <h2 className="text-lg font-extrabold text-theme-text uppercase tracking-wider">Other Tools & Config</h2>
            <button 
              onClick={() => setOtherCollapsed(!otherCollapsed)}
              className="p-1.5 hover:bg-theme-secondary rounded-xl text-theme-secondary hover:text-theme-primary transition-all"
            >
              {otherCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </button>
          </div>
          <div className={otherCollapsed ? 'hidden' : 'block'}>
            <OtherTab />
          </div>
        </section>
      </main>

      {/* FOOTER WIDGET */}
      <footer className="mt-12 mb-6 border-t border-theme-border pt-8 px-6 text-center space-y-4 text-theme-secondary text-[11px]">
        <div className="space-y-1">
          <p className="font-semibold text-theme-text">
            License & Copyright © 2026 Reazul. All Rights Reserved.
          </p>
          <p className="text-[10px]">Licensed under the MIT License.</p>
        </div>

        <div className="flex justify-center items-center space-x-3 text-theme-primary font-bold">
          <a href="#" onClick={(e) => { e.preventDefault(); alert("Storage limits: offline database cache holds up to 50MB of local Quran & Hadith assets."); }} className="hover:underline">শর্তাবলী ও নীতিমালা</a>
          <span className="opacity-30">|</span>
          <a href="#" onClick={(e) => { e.preventDefault(); alert("Privacy: 100% client side. We do not track or store your logs on external servers."); }} className="hover:underline">গোপনীয়তা নীতি</a>
          <span className="opacity-30">|</span>
          <a href="#" onClick={(e) => { e.preventDefault(); alert("PWA caches assets locally inside IndexedDB via Dexie.js."); }} className="hover:underline">স্টোরেজ গাইড</a>
        </div>

        <p className="text-[10px] opacity-75 font-semibold">
          ১০০% অফলাইন ও নিরাপদ ব্যক্তিগত দ্বীনি জীবন ব্যবস্থা
        </p>

        <div className="flex justify-center pt-2">
          <a 
            href="https://wa.me/8801700000000" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-2xl shadow-sm text-xs transition-transform active:scale-95 w-fit"
          >
            <span>💬 হোয়াটসঅ্যাপ সাহায্য</span>
          </a>
        </div>
      </footer>

      <BottomNav activeTab={activeTab} setActiveTab={handleScrollToTab} />
    </div>
  );
};

function App() {
  const { initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <div className="min-h-screen w-full max-w-2xl mx-auto shadow-2xl bg-theme-bg text-theme-text transition-colors duration-300 relative">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/quran" element={<QuranPage />} />
        <Route path="/quran/:id" element={<QuranReaderPage />} />
        <Route path="/hadith" element={<HadithPage />} />
        <Route path="/duas" element={<DuaPage />} />
        <Route path="/tracker" element={<TrackerPage />} />
        <Route path="/tasbih" element={<TasbihPage />} />
        <Route path="/zakat" element={<ZakatPage />} />
        <Route path="/compass" element={<CompassPage />} />
        <Route path="/names" element={<NamesPage />} />
        <Route path="/mushaf" element={<MushafPage />} />
        <Route path="/masayel" element={<MasayelPage />} />
      </Routes>
    </div>
  );
}

export default App;
