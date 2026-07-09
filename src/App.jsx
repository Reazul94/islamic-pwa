import React, { useEffect, useState, useRef } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import IlmTab from './tabs/IlmTab';
import AmalTab from './tabs/AmalTab';
import ServiceTab from './tabs/ServiceTab';
import OtherTab from './tabs/OtherTab';
import { useThemeStore } from './store/themeStore';

function App() {
  const [activeTab, setActiveTab] = useState('ilm');
  const { initTheme } = useThemeStore();
  
  const ilmRef = useRef(null);
  const amalRef = useRef(null);
  const serviceRef = useRef(null);
  const otherRef = useRef(null);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  // Scroll to section handler
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

  // Detect active tab on scroll using IntersectionObserver
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies the upper-middle part of screen
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
    <div className="min-h-screen w-full max-w-2xl mx-auto shadow-2xl bg-slate-50 dark:bg-slate-900 transition-colors duration-300 pb-20 relative">
      {/* Sticky/Fixed Header for Quick Info */}
      <Header />
      
      {/* Main Single Page Scroll Sections */}
      <main className="w-full space-y-8 mt-4 px-3 md:px-6">
        <section id="ilm" ref={ilmRef} className="scroll-mt-4">
          <IlmTab />
        </section>
        
        <hr className="border-slate-200 dark:border-slate-800 mx-4" />

        <section id="amal" ref={amalRef} className="scroll-mt-4">
          <AmalTab />
        </section>
        
        <hr className="border-slate-200 dark:border-slate-800 mx-4" />

        <section id="service" ref={serviceRef} className="scroll-mt-4">
          <ServiceTab />
        </section>
        
        <hr className="border-slate-200 dark:border-slate-800 mx-4" />

        <section id="other" ref={otherRef} className="scroll-mt-4">
          <OtherTab />
        </section>
      </main>

      {/* Floating Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={handleScrollToTab} />
    </div>
  );
}

export default App;
