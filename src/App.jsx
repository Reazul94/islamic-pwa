import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import IlmTab from './tabs/IlmTab';
import AmalTab from './tabs/AmalTab';
import ServiceTab from './tabs/ServiceTab';
import OtherTab from './tabs/OtherTab';
import { useThemeStore } from './store/themeStore';

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

// Main Scrolling Dashboard
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('ilm');
  const ilmRef = useRef(null);
  const amalRef = useRef(null);
  const serviceRef = useRef(null);
  const otherRef = useRef(null);

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
      
      <main className="w-full space-y-8 mt-4 px-3 md:px-6">
        <section id="ilm" ref={ilmRef} className="scroll-mt-4">
          <IlmTab />
        </section>
        
        <hr className="border-theme-border mx-4" />

        <section id="amal" ref={amalRef} className="scroll-mt-4">
          <AmalTab />
        </section>
        
        <hr className="border-theme-border mx-4" />

        <section id="service" ref={serviceRef} className="scroll-mt-4">
          <ServiceTab />
        </section>
        
        <hr className="border-theme-border mx-4" />

        <section id="other" ref={otherRef} className="scroll-mt-4">
          <OtherTab />
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
