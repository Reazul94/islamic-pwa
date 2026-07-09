import React, { useState } from 'react';
import { getHadithOfTheDay, propheticHadiths } from '../utils/hadiths';
import { Quote, RefreshCw } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';

export default function DailyHadithCard() {
  const { language } = useSettingsStore();
  const [hadith, setHadith] = useState(() => getHadithOfTheDay());
  const [spin, setSpin] = useState(false);

  const handleNextHadith = () => {
    setSpin(true);
    setTimeout(() => setSpin(false), 600);

    const currentIndex = propheticHadiths.findIndex(h => h.id === hadith.id);
    const nextIndex = (currentIndex + 1) % propheticHadiths.length;
    setHadith(propheticHadiths[nextIndex]);
  };

  return (
    <div className="bg-theme-card rounded-3xl p-5 border border-theme-border shadow-sm relative overflow-hidden animate-fade-in">
      <div className="absolute -right-20 -top-20 w-48 h-48 bg-theme-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-theme-primary">
          <Quote className="w-5 h-5 shrink-0" />
          <h3 className="text-xs font-extrabold text-theme-text uppercase tracking-wider">
            {language === 'en' ? 'Prophetic Hadith Reflection (ﷺ)' : 'আজকের হাদিস প্রতিফলন (ﷺ)'}
          </h3>
        </div>

        <button
          type="button"
          onClick={handleNextHadith}
          className="p-1.5 rounded-lg text-theme-secondary hover:text-theme-primary hover:bg-theme-primary-light transition-all cursor-pointer bg-transparent border-0"
          title={language === 'en' ? 'Next Hadith' : 'পরবর্তী হাদিস'}
        >
          <RefreshCw className={`w-4 h-4 ${spin ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-4">
        <p 
          className="text-xl sm:text-2xl text-theme-primary font-medium text-center leading-loose my-2 antialiased select-none"
          style={{ 
            fontFamily: 'Amiri, Georgia, serif', 
            direction: 'rtl'
          }}
        >
          {hadith.arabic}
        </p>

        <div className="border-t border-theme-border pt-3.5 space-y-2">
          {language === 'en' ? (
            <>
              <p className="text-xs font-semibold text-theme-text leading-relaxed">
                {hadith.english}
              </p>
              <p className="text-[11px] text-theme-secondary font-medium italic leading-relaxed">
                {hadith.bangla}
              </p>
            </>
          ) : (
            <>
              <p className="text-xs font-semibold text-theme-text leading-relaxed">
                {hadith.bangla}
              </p>
              <p className="text-[11px] text-theme-secondary font-medium italic leading-relaxed">
                {hadith.english}
              </p>
            </>
          )}
        </div>

        <div className="flex justify-end pt-1">
          <span className="text-[10px] font-bold text-theme-primary bg-theme-primary-light px-2.5 py-0.5 rounded-full border border-theme-border tracking-wide">
            {hadith.reference}
          </span>
        </div>
      </div>
    </div>
  );
}
