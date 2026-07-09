import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Book, BookMarked, Video, ArrowLeft, Bookmark, Volume2, Search, Play, Pause, AlertTriangle } from 'lucide-react';
import { fetchSurahList, fetchSurahDetails } from '../utils/quranService';
import { fetchHadithList } from '../utils/hadithService';

const IlmTab = () => {
  const [activeView, setActiveView] = useState('grid'); // grid, quran, hadith, learn-quran, learn-salah
  
  // QURAN STATE
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [surahLoading, setSurahLoading] = useState(false);
  const [selectedReciter, setSelectedReciter] = useState('ar.alafasy');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState(JSON.parse(localStorage.getItem('bookmarks')) || []);
  
  // AUDIO PLAYER STATE
  const [playingAyahIdx, setPlayingAyahIdx] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());

  // HADITH STATE
  const [hadiths, setHadiths] = useState([]);
  const [selectedBook, setSelectedBook] = useState('bukhari');
  const [hadithSearch, setHadithSearch] = useState('');
  const [hadithLoading, setHadithLoading] = useState(false);

  // AUTO SCROLL REFS
  const readerRef = useRef(null);

  const menuItems = [
    { id: 'quran', title: 'Quran Explorer', icon: BookOpen, desc: 'Full 114 Surahs with Trilingual translations' },
    { id: 'hadith', title: 'Hadith Explorer', icon: Book, desc: 'Sihah Sittah database with Isnaad detail' },
    { id: 'learn-quran', title: 'Learn Quran', icon: BookMarked, desc: 'Tajweed and alphabet rules' },
    { id: 'learn-salah', title: 'Learn Salah', icon: Video, desc: 'Step-by-step prayer details' }
  ];

  const reciters = [
    { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy' },
    { id: 'ar.abdurrahmaansudais', name: 'Abdul Rahman Al-Sudais' },
    { id: 'ar.maheralmuaiqly', name: 'Maher Al-Muaiqly' },
    { id: 'ar.shaatree', name: 'Abu Bakr Al-Shatri' }
  ];

  // Fetch Surah list on mount
  useEffect(() => {
    fetchSurahList().then(list => setSurahs(list));
  }, []);

  // Fetch Hadiths when book changes or view opens
  useEffect(() => {
    if (activeView === 'hadith') {
      setHadithLoading(true);
      fetchHadithList(selectedBook)
        .then(list => setHadiths(list))
        .finally(() => setHadithLoading(false));
    }
  }, [activeView, selectedBook]);

  // Load detailed Surah verses
  const handleSelectSurah = async (surah) => {
    setSurahLoading(true);
    setSelectedSurah(surah);
    
    // Auto-scroll immediately to start loading view
    setTimeout(() => {
      if (readerRef.current) {
        readerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);

    try {
      const details = await fetchSurahDetails(surah.id, selectedReciter);
      setSelectedSurah(details);
    } catch (e) {
      alert("Surah details not found in cache. Please connect to internet to download first.");
      setSelectedSurah(null);
    } finally {
      setSurahLoading(false);
    }
  };

  const changeReciter = async (reciterId) => {
    setSelectedReciter(reciterId);
    if (selectedSurah && selectedSurah.verses) {
      setSurahLoading(true);
      try {
        const details = await fetchSurahDetails(selectedSurah.id, reciterId);
        setSelectedSurah(details);
      } catch (e) {
        alert("Failed to change reciter. Try again when online.");
      } finally {
        setSurahLoading(false);
      }
    }
  };

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

  // AUDIO LOGIC
  const handlePlayAyah = (index, audioUrl) => {
    if (playingAyahIdx === index && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (playingAyahIdx === index && !isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    // Play new audio
    setPlayingAyahIdx(index);
    audioRef.current.src = audioUrl;
    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        alert("Audio failed to load. Check your internet connection.");
        setPlayingAyahIdx(null);
        setIsPlaying(false);
      });

    // Auto play next verse
    audioRef.current.onended = () => {
      const nextIndex = index + 1;
      if (selectedSurah.verses && nextIndex < selectedSurah.verses.length) {
        handlePlayAyah(nextIndex, selectedSurah.verses[nextIndex].audio);
      } else {
        setIsPlaying(false);
        setPlayingAyahIdx(null);
      }
    };
  };

  useEffect(() => {
    return () => {
      audioRef.current.pause();
    };
  }, []);

  // RENDER QURAN EXPLORER
  const renderQuranExplorer = () => {
    if (selectedSurah && (selectedSurah.verses || surahLoading)) {
      return (
        <div ref={readerRef} className="p-4 animate-fade-in scroll-mt-2">
          <button 
            onClick={() => {
              setSelectedSurah(null);
              audioRef.current.pause();
              setIsPlaying(false);
              setPlayingAyahIdx(null);
            }} 
            className="flex items-center gap-1.5 text-xs font-semibold text-islamic-600 dark:text-islamic-400 mb-4 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full"
          >
            <ArrowLeft size={14} /> Back to Quran list
          </button>
          
          <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm mb-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-islamic-600 dark:text-islamic-400">{selectedSurah.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{selectedSurah.translation} • {selectedSurah.bengali}</p>
              </div>
              <button 
                onClick={() => toggleBookmark(selectedSurah.id)}
                className={`p-2 rounded-full ${bookmarks.includes(selectedSurah.id) ? 'bg-islamic-600 text-white' : 'bg-islamic-50 dark:bg-slate-700 text-islamic-600 dark:text-islamic-400'}`}
              >
                <Bookmark size={16} />
              </button>
            </div>
            
            {/* Reciter Dropdown */}
            <div className="mt-4 flex items-center justify-between gap-2 text-xs">
              <span className="text-slate-500">Choose Reciter:</span>
              <select
                value={selectedReciter}
                onChange={(e) => changeReciter(e.target.value)}
                className="bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 px-2 py-1.5 rounded-lg outline-none text-slate-800 dark:text-slate-100 font-semibold"
              >
                {reciters.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>

          {surahLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-islamic-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs text-slate-500">Downloading offline recitations and translation cache...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedSurah.verses.map((verse, idx) => (
                <div key={idx} className={`p-4 rounded-2xl border shadow-sm transition-all ${
                  playingAyahIdx === idx 
                    ? 'bg-islamic-50/50 dark:bg-islamic-950/20 border-islamic-300 dark:border-islamic-900/50' 
                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'
                }`}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="w-6 h-6 rounded-full bg-islamic-50 dark:bg-slate-700 text-islamic-600 dark:text-islamic-400 text-[10px] flex items-center justify-center font-bold">
                      {verse.number}
                    </span>
                    <button 
                      onClick={() => handlePlayAyah(idx, verse.audio)}
                      className={`p-2 rounded-xl transition-all active:scale-95 ${
                        playingAyahIdx === idx && isPlaying 
                          ? 'bg-red-500 text-white' 
                          : 'bg-islamic-100 dark:bg-slate-750 text-islamic-600 dark:text-islamic-400'
                      }`}
                    >
                      {playingAyahIdx === idx && isPlaying ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                  </div>
                  <p className="text-right text-2xl font-arabic leading-loose mb-3 text-slate-800 dark:text-slate-100 tracking-wide font-normal">
                    {verse.ar}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 leading-relaxed italic">
                    <strong>Bengali:</strong> {verse.bn}
                  </p>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong>English:</strong> {verse.en}
                  </p>
                </div>
              ))}
            </div>
          )}
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

        <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 mb-4 shadow-sm">
          <Search size={18} className="text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search Surah by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full text-slate-800 dark:text-slate-100 placeholder-slate-400"
          />
        </div>

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {surahs
            .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.translation.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((surah) => (
              <div 
                key={surah.id} 
                onClick={() => handleSelectSurah(surah)}
                className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex justify-between items-center shadow-sm cursor-pointer hover:border-islamic-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-islamic-50 dark:bg-slate-700 text-islamic-600 dark:text-islamic-400 flex items-center justify-center font-bold text-sm">
                    {surah.id}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{surah.name}</h4>
                    <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-0.5">{surah.translation} • {surah.verses_count} Ayahs</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-850 dark:text-slate-200 font-arabic">{surah.arabic}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">{surah.type}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  };

  // RENDER HADITH EXPLORER
  const renderHadithExplorer = () => {
    const books = [
      { id: 'bukhari', name: 'Bukhari' },
      { id: 'muslim', name: 'Muslim' },
      { id: 'abudawud', name: 'Abu Dawud' },
      { id: 'tirmidhi', name: 'Tirmidhi' },
      { id: 'nasai', name: 'Nasai' },
      { id: 'ibnmajah', name: 'Ibn Majah' }
    ];

    return (
      <div className="p-4 animate-fade-in">
        <button 
          onClick={() => setActiveView('grid')} 
          className="flex items-center gap-1.5 text-xs font-semibold text-islamic-600 dark:text-islamic-400 mb-4 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full"
        >
          <ArrowLeft size={14} /> Back to dashboard
        </button>

        {/* Book Selector tabs */}
        <div className="flex space-x-1.5 overflow-x-auto pb-3 mb-4 scrollbar-hide">
          {books.map((book) => (
            <button
              key={book.id}
              onClick={() => setSelectedBook(book.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                selectedBook === book.id 
                  ? 'bg-islamic-600 text-white shadow-sm' 
                  : 'bg-white dark:bg-slate-800 text-slate-650 dark:text-slate-400 border border-slate-100 dark:border-slate-700'
              }`}
            >
              {book.name}
            </button>
          ))}
        </div>

        <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 mb-4 shadow-sm">
          <Search size={18} className="text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search hadith details..."
            value={hadithSearch}
            onChange={(e) => setHadithSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full text-slate-800 dark:text-slate-100 placeholder-slate-400"
          />
        </div>

        {hadithLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-islamic-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-slate-500">Fetching hadiths from registry...</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {hadiths
              .filter(h => h.matn_en.toLowerCase().includes(hadithSearch.toLowerCase()) || h.matn_bn.toLowerCase().includes(hadithSearch.toLowerCase()))
              .map((hadith) => (
                <div key={hadith.id} className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm relative">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs bg-islamic-50 dark:bg-slate-700 text-islamic-600 dark:text-islamic-400 px-3 py-1 rounded-full font-bold">
                      {hadith.book}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Chapter: {hadith.chapter}</span>
                  </div>
                  
                  {/* Isnaad */}
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 mb-3 text-xs leading-relaxed">
                    <span className="text-[9px] text-islamic-600 dark:text-islamic-400 font-extrabold uppercase block mb-1">Isnaad</span>
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      {hadith.isnaad}
                    </p>
                    <p className="text-slate-400 text-[10px] mt-0.5">({hadith.bengali_isnaad})</p>
                  </div>

                  {/* Matn */}
                  <p className="text-right text-xl font-arabic leading-loose text-slate-850 dark:text-slate-100 tracking-wide mb-4">
                    {hadith.matn_ar}
                  </p>

                  <div className="space-y-2 border-t border-slate-100 dark:border-slate-700 pt-3 text-xs leading-relaxed">
                    <p className="text-slate-800 dark:text-slate-200">
                      <strong className="text-islamic-600 dark:text-islamic-400">Bengali:</strong> {hadith.matn_bn}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 italic">
                      <strong>English:</strong> {hadith.matn_en}
                    </p>
                  </div>
                </div>
              ))}
            {hadiths.length === 0 && (
              <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl">
                <AlertTriangle className="text-amber-500 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No hadiths found. Check your connection or search query.</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // GRID MENU
  const renderGrid = () => {
    return (
      <div className="p-4 animate-fade-in">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Ilm (Knowledge)</h2>
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.id} 
                onClick={() => {
                  setActiveView(item.id);
                  // Auto scroll detail view into place
                  setTimeout(() => {
                    if (readerRef.current) {
                      readerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 100);
                }}
                className="bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/80 flex flex-col items-center justify-center text-center hover:shadow-md cursor-pointer hover:border-islamic-200 dark:hover:border-slate-600 transition-all duration-300 group"
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
    <div ref={readerRef} className="p-4 animate-fade-in scroll-mt-2">
      <button onClick={() => setActiveView('grid')} className="flex items-center gap-1.5 text-xs font-semibold text-islamic-600 dark:text-islamic-400 mb-4 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full"><ArrowLeft size={14} /> Back</button>
      <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-100">Learn Quran (Tajweed Guide)</h3>
      <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
        <div>
          <h4 className="font-bold text-sm text-islamic-600 dark:text-islamic-400">1. Al-Makhraj (Pronunciation Points)</h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">There are 17 Makharij for pronouncing 29 Arabic letters correctly from Throat, Tongue, Lips, and Nose.</p>
        </div>
        <div>
          <h4 className="font-bold text-sm text-islamic-600 dark:text-islamic-400">2. Noon Sakinah & Tanween</h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">Rules on pronouncing standard 'N' sounds. Four distinct styles: Izhar (clear), Idgham (merge), Iqlab (change), and Ikhfa (hide).</p>
        </div>
      </div>
    </div>
  );

  const renderLearnSalah = () => (
    <div ref={readerRef} className="p-4 animate-fade-in scroll-mt-2">
      <button onClick={() => setActiveView('grid')} className="flex items-center gap-1.5 text-xs font-semibold text-islamic-600 dark:text-islamic-400 mb-4 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full"><ArrowLeft size={14} /> Back</button>
      <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-100">Learn Salah (Step-by-Step)</h3>
      <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
        <div>
          <h4 className="font-bold text-sm text-islamic-600 dark:text-islamic-400">Step 1: Niyyah & Takbeer</h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">Stand erect facing the Qiblah, raise hands to ears saying "Allahu Akbar".</p>
        </div>
        <div>
          <h4 className="font-bold text-sm text-islamic-600 dark:text-islamic-400">Step 2: Qiyam & Recitation</h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">Place right hand over left beneath the chest, recite Sana, Surah Al-Fatihah, and another Surah.</p>
        </div>
        <div>
          <h4 className="font-bold text-sm text-islamic-600 dark:text-islamic-400">Step 3: Ruku (Bowing)</h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">Bow down with back straight, saying "Subhana Rabbiyal Azeem" three times.</p>
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
