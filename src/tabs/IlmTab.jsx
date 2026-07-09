import React, { useState } from 'react';
import { BookOpen, Book, BookMarked, Video, ArrowLeft, Bookmark, Volume2, Search } from 'lucide-react';
import quranData from '../data/quran.json';
import hadithData from '../data/hadith.json';

const IlmTab = () => {
  const [activeView, setActiveView] = useState('grid'); // grid, quran, hadith, learn-quran, learn-salah
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState(JSON.parse(localStorage.getItem('bookmarks')) || []);

  const menuItems = [
    { id: 'quran', title: 'Quran Explorer', icon: BookOpen, desc: 'Full 114 Surahs with Trilingual translations' },
    { id: 'hadith', title: 'Hadith Explorer', icon: Book, desc: 'Sihah Sittah database with Isnaad detail' },
    { id: 'learn-quran', title: 'Learn Quran', icon: BookMarked, desc: 'Tajweed and alphabet rules' },
    { id: 'learn-salah', title: 'Learn Salah', icon: Video, desc: 'Step-by-step prayer details' }
  ];

  // Bookmark toggler
  const toggleBookmark = (surahId) => {
    let newBookmarks = [...bookmarks];
    if (newBookmarks.includes(surahId)) {
      newBookmarks = newBookmarks.filter(id => id !== surahId);
    } else {
      newBookmarks.push(surahId);
    }
    setBookmarks(newBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
  };

  // Mock audio player
  const playAudio = (surahName) => {
    alert(`Playing offline recitation for Surah ${surahName} (Simulated audio asset loaded from cache).`);
  };

  // RENDER QURAN EXPLORER
  const renderQuranExplorer = () => {
    if (selectedSurah) {
      return (
        <div className="p-4 animate-fade-in">
          <button 
            onClick={() => setSelectedSurah(null)} 
            className="flex items-center gap-1.5 text-xs font-semibold text-islamic-600 dark:text-islamic-400 mb-4 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full"
          >
            <ArrowLeft size={14} /> Back to Quran list
          </button>
          
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm mb-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-islamic-600 dark:text-islamic-400">{selectedSurah.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{selectedSurah.translation} • {selectedSurah.bengali}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => playAudio(selectedSurah.name)}
                  className="p-2 bg-islamic-50 dark:bg-slate-700 text-islamic-600 dark:text-islamic-400 rounded-full"
                >
                  <Volume2 size={16} />
                </button>
                <button 
                  onClick={() => toggleBookmark(selectedSurah.id)}
                  className={`p-2 rounded-full ${bookmarks.includes(selectedSurah.id) ? 'bg-islamic-600 text-white' : 'bg-islamic-50 dark:bg-slate-700 text-islamic-600 dark:text-islamic-400'}`}
                >
                  <Bookmark size={16} />
                </button>
              </div>
            </div>
            <div className="mt-2 text-right">
              <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full font-medium">{selectedSurah.type}</span>
            </div>
          </div>

          <div className="space-y-4">
            {selectedSurah.verses ? selectedSurah.verses.map((verse) => (
              <div key={verse.number} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm relative">
                <div className="flex justify-between items-start mb-2">
                  <span className="w-6 h-6 rounded-full bg-islamic-50 dark:bg-slate-700 text-islamic-600 dark:text-islamic-400 text-xs flex items-center justify-center font-bold">
                    {verse.number}
                  </span>
                </div>
                {/* Uthmani Font rendering */}
                <p className="text-right text-2xl font-arabic leading-loose mb-3 text-slate-800 dark:text-slate-100 tracking-wide font-normal">
                  {verse.ar}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 leading-relaxed italic">
                  <strong>Pronunciation/Trans:</strong> {verse.bn}
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>En:</strong> {verse.en}
                </p>
              </div>
            )) : (
              <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl">
                <p className="text-sm text-slate-500">Verses for this Surah are currently downloading/updating for offline reading.</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="p-4 animate-fade-in">
        <button 
          onClick={() => setActiveView('grid')} 
          className="flex items-center gap-1.5 text-xs font-semibold text-islamic-600 dark:text-islamic-400 mb-4 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full"
        >
          <ArrowLeft size={14} /> Back to dashboard
        </button>

        <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 mb-4 shadow-sm">
          <Search size={18} className="text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search Surah by name or translation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full text-slate-800 dark:text-slate-100 placeholder-slate-400"
          />
        </div>

        <div className="space-y-3">
          {quranData
            .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.translation.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((surah) => (
              <div 
                key={surah.id} 
                onClick={() => setSelectedSurah(surah)}
                className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex justify-between items-center shadow-sm cursor-pointer hover:border-islamic-200 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-islamic-50 dark:bg-slate-700 text-islamic-600 dark:text-islamic-400 flex items-center justify-center font-bold text-sm">
                    {surah.id}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{surah.name}</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{surah.translation} • {surah.verses_count} Verses</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{surah.arabic}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{surah.type}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  };

  // RENDER HADITH EXPLORER
  const renderHadithExplorer = () => {
    return (
      <div className="p-4 animate-fade-in">
        <button 
          onClick={() => setActiveView('grid')} 
          className="flex items-center gap-1.5 text-xs font-semibold text-islamic-600 dark:text-islamic-400 mb-4 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full"
        >
          <ArrowLeft size={14} /> Back to dashboard
        </button>

        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3">Hadith Database</h3>
        
        <div className="space-y-4">
          {hadithData.map((hadith) => (
            <div key={hadith.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm relative">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs bg-islamic-50 dark:bg-slate-700 text-islamic-600 dark:text-islamic-400 px-3 py-1 rounded-full font-bold">
                  {hadith.book}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Chapter: {hadith.chapter}</span>
              </div>
              
              {/* Narration Chain - Isnaad */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 mb-3">
                <span className="text-[10px] text-islamic-600 dark:text-islamic-400 font-bold uppercase block mb-1">Isnaad (Chain of Narrators)</span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {hadith.isnaad} <span className="text-slate-400 font-normal">({hadith.bengali_isnaad})</span>
                </p>
              </div>

              {/* Matn - Arabic Text */}
              <p className="text-right text-xl font-arabic leading-loose text-slate-800 dark:text-slate-100 tracking-wide mb-4">
                {hadith.matn_ar}
              </p>

              {/* Translations */}
              <div className="space-y-2 border-t border-slate-100 dark:border-slate-700 pt-3">
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                  <strong className="text-islamic-600 dark:text-islamic-400">Bengali:</strong> {hadith.matn_bn}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                  <strong className="text-slate-400">English:</strong> {hadith.matn_en}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // RENDER GRID NAVIGATION
  const renderGrid = () => {
    return (
      <div className="p-4 pb-24 animate-fade-in">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Ilm (Knowledge)</h2>
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

  const renderLearnQuran = () => (
    <div className="p-4 animate-fade-in">
      <button onClick={() => setActiveView('grid')} className="flex items-center gap-1.5 text-xs font-semibold text-islamic-600 mb-4 bg-slate-100 px-3 py-1.5 rounded-full"><ArrowLeft size={14} /> Back</button>
      <h3 className="text-lg font-bold mb-4">Learn Quran (Tajweed Guide)</h3>
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
        <div>
          <h4 className="font-bold text-sm text-islamic-600">1. Al-Makhraj (Pronunciation Points)</h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">There are 17 Makharij for pronouncing 29 Arabic letters correctly from Throat, Tongue, Lips, and Nose.</p>
        </div>
        <div>
          <h4 className="font-bold text-sm text-islamic-600">2. Noon Sakinah & Tanween</h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Rules on pronouncing standard 'N' sounds. Four distinct styles: Izhar (clear), Idgham (merge), Iqlab (change), and Ikhfa (hide).</p>
        </div>
      </div>
    </div>
  );

  const renderLearnSalah = () => (
    <div className="p-4 animate-fade-in">
      <button onClick={() => setActiveView('grid')} className="flex items-center gap-1.5 text-xs font-semibold text-islamic-600 mb-4 bg-slate-100 px-3 py-1.5 rounded-full"><ArrowLeft size={14} /> Back</button>
      <h3 className="text-lg font-bold mb-4">Learn Salah (Step-by-Step)</h3>
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
        <div>
          <h4 className="font-bold text-sm text-islamic-600">Step 1: Niyyah & Takbeer</h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Stand erect facing the Qiblah, raise hands to ears saying "Allahu Akbar".</p>
        </div>
        <div>
          <h4 className="font-bold text-sm text-islamic-600">Step 2: Qiyam & Recitation</h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Place right hand over left beneath the chest, recite Sana, Surah Al-Fatihah, and another Surah.</p>
        </div>
        <div>
          <h4 className="font-bold text-sm text-islamic-600">Step 3: Ruku (Bowing)</h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Bow down with back straight, saying "Subhana Rabbiyal Azeem" three times.</p>
        </div>
      </div>
    </div>
  );

  switch (activeView) {
    case 'quran': return renderQuranExplorer();
    case 'hadith': return renderHadithExplorer();
    case 'learn-quran': return renderLearnQuran();
    case 'learn-salah': return renderLearnSalah();
    default: return renderGrid();
  }
};

export default IlmTab;
