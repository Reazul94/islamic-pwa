import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Bookmark, ChevronRight } from 'lucide-react';
import { fetchHadithList } from '../utils/hadithService';

const HadithPage = () => {
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState('bukhari');
  const [hadiths, setHadiths] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const books = [
    { id: 'bukhari', name: 'Bukhari' },
    { id: 'muslim', name: 'Muslim' },
    { id: 'abudawud', name: 'Abu Dawud' },
    { id: 'tirmidhi', name: 'Tirmidhi' },
    { id: 'nasai', name: 'Nasai' },
    { id: 'ibnmajah', name: 'Ibn Majah' }
  ];

  useEffect(() => {
    setLoading(true);
    fetchHadithList(selectedBook)
      .then(list => setHadiths(list))
      .finally(() => setLoading(false));
  }, [selectedBook]);

  // Group hadiths by chapter
  const getGroupedHadiths = () => {
    const filtered = hadiths.filter(
      h => h.matn_en.toLowerCase().includes(searchQuery.toLowerCase()) || 
           h.matn_bn.toLowerCase().includes(searchQuery.toLowerCase()) ||
           h.chapter.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return filtered.reduce((acc, h) => {
      const ch = h.chapter || "General / Book Introduction";
      if (!acc[ch]) acc[ch] = [];
      acc[ch].push(h);
      return acc;
    }, {});
  };

  const grouped = getGroupedHadiths();
  const chapters = Object.keys(grouped);

  const handleScrollToChapter = (chapterName) => {
    const id = `chapter-${chapterName.replace(/\s+/g, '-').toLowerCase()}`;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text p-4 pb-20 max-w-4xl mx-auto shadow-xl transition-colors duration-300 flex flex-col md:flex-row gap-6">
      
      {/* LEFT PANEL / SIDEBAR FOR CHAPTER INDEX (On Desktop) */}
      <div className="w-full md:w-64 shrink-0 bg-theme-card border border-theme-border rounded-3xl p-4 h-fit md:sticky md:top-4 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center space-x-3 mb-4">
          <button 
            onClick={() => navigate('/')} 
            className="p-1.5 bg-theme-secondary hover:bg-theme-primary-light rounded-full transition-all"
          >
            <ArrowLeft size={16} className="text-theme-primary" />
          </button>
          <span className="font-extrabold text-sm tracking-tight">Hadith Books</span>
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-3 md:grid-cols-1 gap-2 mb-4">
          {books.map(b => (
            <button
              key={b.id}
              onClick={() => setSelectedBook(b.id)}
              className={`py-2 px-3 rounded-xl text-[11px] font-bold text-center md:text-left transition-all ${selectedBook === b.id ? 'bg-theme-primary text-white' : 'bg-theme-secondary hover:bg-theme-primary-light text-theme-text'}`}
            >
              {b.name}
            </button>
          ))}
        </div>

        <hr className="border-theme-border my-3" />

        {/* Chapter Quick Scroll */}
        <span className="text-[9px] uppercase tracking-wider font-extrabold text-theme-secondary block mb-2">Chapters index</span>
        {loading ? (
          <p className="text-[10px] text-theme-secondary">Loading...</p>
        ) : (
          <div className="space-y-1.5 max-h-48 md:max-h-none overflow-y-auto pr-1">
            {chapters.map((ch, idx) => (
              <button
                key={idx}
                onClick={() => handleScrollToChapter(ch)}
                className="w-full text-left text-[10px] py-1 px-1.5 hover:bg-theme-secondary rounded flex items-center justify-between text-theme-secondary hover:text-theme-primary transition-colors"
              >
                <span className="truncate pr-1">{ch}</span>
                <ChevronRight size={10} className="shrink-0" />
              </button>
            ))}
            {chapters.length === 0 && <p className="text-[10px] text-theme-secondary">No chapters</p>}
          </div>
        )}
      </div>

      {/* RIGHT CONTENT PANEL (Hadith list grouped by chapters) */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center bg-theme-card border border-theme-border rounded-2xl px-4 py-3 shadow-sm">
          <Search size={18} className="text-theme-secondary mr-2" />
          <input 
            type="text" 
            placeholder="Search within this book..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full placeholder-theme-secondary text-theme-text"
          />
        </div>

        {loading ? (
          <div className="text-center py-20 bg-theme-card rounded-3xl border border-theme-border shadow-sm">
            <div className="w-9 h-9 border-4 border-theme-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-theme-secondary">Loading Hadith registry details...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {chapters.map((ch, idx) => (
              <div 
                key={idx} 
                id={`chapter-${ch.replace(/\s+/g, '-').toLowerCase()}`}
                className="scroll-mt-4 space-y-4"
              >
                {/* Chapter Heading Banner */}
                <div className="bg-theme-primary-light border-l-4 border-theme-primary px-4 py-2.5 rounded-r-xl">
                  <h3 className="font-extrabold text-xs text-theme-primary uppercase tracking-wide">
                    {ch}
                  </h3>
                </div>

                <div className="space-y-4">
                  {grouped[ch].map((hadith) => (
                    <div 
                      key={hadith.id}
                      className="bg-theme-card p-5 rounded-3xl border border-theme-border shadow-sm space-y-4"
                    >
                      <div className="flex justify-between items-center text-[10px] text-theme-secondary border-b border-theme-border pb-2.5">
                        <span className="font-bold">{hadith.book}</span>
                        <span className="font-medium">Chapter: {hadith.chapter}</span>
                      </div>

                      {/* Isnaad */}
                      <div className="bg-theme-secondary p-3 rounded-2xl text-[11px] leading-relaxed">
                        <span className="text-[9px] text-theme-primary font-extrabold uppercase block mb-1">Chain of Narration (Isnaad)</span>
                        <p className="text-theme-text font-semibold">{hadith.isnaad}</p>
                        <p className="text-theme-secondary text-[10px] mt-0.5 font-medium">({hadith.bengali_isnaad})</p>
                      </div>

                      {/* Matn */}
                      <p className="text-right text-2xl font-arabic leading-loose tracking-wide text-theme-text">
                        {hadith.matn_ar}
                      </p>

                      <div className="space-y-2 border-t border-theme-border pt-3 text-xs leading-relaxed">
                        <p className="text-theme-text">
                          <strong className="text-theme-primary">Bengali:</strong> {hadith.matn_bn}
                        </p>
                        <p className="text-theme-secondary italic">
                          <strong>English:</strong> {hadith.matn_en}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {chapters.length === 0 && (
              <div className="text-center py-10 bg-theme-card border border-theme-border rounded-3xl">
                <p className="text-sm text-theme-secondary">No Hadiths found.</p>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default HadithPage;
