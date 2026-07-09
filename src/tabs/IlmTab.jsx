import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Book, BookMarked, Video, ArrowLeft } from 'lucide-react';

const IlmTab = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('grid'); // grid, learn-quran, learn-salah
  const readerRef = useRef(null);

  const menuItems = [
    { id: 'quran', title: 'Quran Explorer', icon: BookOpen, desc: 'Full 114 Surahs with Trilingual translations', action: () => navigate('/quran') },
    { id: 'hadith', title: 'Hadith Explorer', icon: Book, desc: 'Sihah Sittah database with Isnaad detail', action: () => navigate('/hadith') },
    { id: 'learn-quran', title: 'Learn Quran', icon: BookMarked, desc: 'Tajweed and alphabet rules', action: () => { setActiveView('learn-quran'); scrollDetail(); } },
    { id: 'learn-salah', title: 'Learn Salah', icon: Video, desc: 'Step-by-step prayer details', action: () => { setActiveView('learn-salah'); scrollDetail(); } }
  ];

  const scrollDetail = () => {
    setTimeout(() => {
      if (readerRef.current) {
        readerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const renderGrid = () => (
    <div className="p-4 animate-fade-in">
      <h2 className="text-xl font-bold text-theme-text mb-4">Ilm (Knowledge)</h2>
      <div className="grid grid-cols-2 gap-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.id} 
              onClick={item.action}
              className="bg-theme-card p-5 rounded-3xl shadow-sm border border-theme-border flex flex-col items-center justify-center text-center hover:shadow-md cursor-pointer hover:border-theme-primary transition-all duration-300 group"
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
  );

  const renderLearnQuran = () => (
    <div ref={readerRef} className="p-4 animate-fade-in scroll-mt-2">
      <button onClick={() => setActiveView('grid')} className="flex items-center gap-1.5 text-xs font-semibold text-theme-primary mb-4 bg-theme-secondary px-3 py-1.5 rounded-full"><ArrowLeft size={14} /> Back</button>
      <h3 className="text-lg font-bold mb-4 text-theme-text">Learn Quran (Tajweed Guide)</h3>
      <div className="bg-theme-card p-5 rounded-3xl shadow-sm border border-theme-border space-y-4">
        <div>
          <h4 className="font-bold text-sm text-theme-primary">1. Al-Makhraj (Pronunciation Points)</h4>
          <p className="text-xs text-theme-secondary mt-1 leading-relaxed">There are 17 Makharij for pronouncing 29 Arabic letters correctly from Throat, Tongue, Lips, and Nose.</p>
        </div>
        <div>
          <h4 className="font-bold text-sm text-theme-primary">2. Noon Sakinah & Tanween</h4>
          <p className="text-xs text-theme-secondary mt-1 leading-relaxed">Rules on pronouncing standard 'N' sounds. Four distinct styles: Izhar (clear), Idgham (merge), Iqlab (change), and Ikhfa (hide).</p>
        </div>
      </div>
    </div>
  );

  const renderLearnSalah = () => (
    <div ref={readerRef} className="p-4 animate-fade-in scroll-mt-2">
      <button onClick={() => setActiveView('grid')} className="flex items-center gap-1.5 text-xs font-semibold text-theme-primary mb-4 bg-theme-secondary px-3 py-1.5 rounded-full"><ArrowLeft size={14} /> Back</button>
      <h3 className="text-lg font-bold mb-4 text-theme-text">Learn Salah (Step-by-Step)</h3>
      <div className="bg-theme-card p-5 rounded-3xl shadow-sm border border-theme-border space-y-4">
        <div>
          <h4 className="font-bold text-sm text-theme-primary">Step 1: Niyyah & Takbeer</h4>
          <p className="text-xs text-theme-secondary mt-1 leading-relaxed">Stand erect facing the Qiblah, raise hands to ears saying "Allahu Akbar".</p>
        </div>
        <div>
          <h4 className="font-bold text-sm text-theme-primary">Step 2: Qiyam & Recitation</h4>
          <p className="text-xs text-theme-secondary mt-1 leading-relaxed">Place right hand over left beneath the chest, recite Sana, Surah Al-Fatihah, and another Surah.</p>
        </div>
        <div>
          <h4 className="font-bold text-sm text-theme-primary">Step 3: Ruku (Bowing)</h4>
          <p className="text-xs text-theme-secondary mt-1 leading-relaxed">Bow down with back straight, saying "Subhana Rabbiyal Azeem" three times.</p>
        </div>
      </div>
    </div>
  );

  switch (activeView) {
    case 'learn-quran': return renderLearnQuran();
    case 'learn-salah': return renderLearnSalah();
    default: return renderGrid();
  }
};

export default IlmTab;
