import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Bookmark } from 'lucide-react';
import { fetchSurahList } from '../utils/quranService';

const QuranPage = () => {
  const [surahs, setSurahs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks] = useState(JSON.parse(localStorage.getItem('bookmarks')) || []);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSurahList().then(list => setSurahs(list));
  }, []);

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
          <h2 className="text-xl font-extrabold tracking-tight">Quran Explorer</h2>
          <p className="text-xs text-theme-secondary">Explore all 114 Surahs with translations</p>
        </div>
      </div>

      <div className="flex items-center bg-theme-card border border-theme-border rounded-2xl px-4 py-3 mb-6 shadow-sm">
        <Search size={18} className="text-theme-secondary mr-2" />
        <input 
          type="text" 
          placeholder="Search Surah by name or meaning..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-none outline-none text-sm w-full placeholder-theme-secondary text-theme-text"
        />
      </div>

      <div className="space-y-3.5">
        {surahs
          .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.translation.toLowerCase().includes(searchQuery.toLowerCase()) || (s.bengali && s.bengali.includes(searchQuery)))
          .map((surah) => (
            <div 
              key={surah.id} 
              onClick={() => navigate(`/quran/${surah.id}`)}
              className="bg-theme-card p-4.5 rounded-3xl border border-theme-border flex justify-between items-center shadow-sm cursor-pointer hover:border-theme-primary hover:scale-[1.01] transition-all duration-200"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-2xl bg-theme-primary-light text-theme-primary flex items-center justify-center font-bold text-sm">
                  {surah.id}
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h4 className="font-bold text-sm text-theme-text">{surah.name}</h4>
                    {bookmarks.includes(surah.id) && <Bookmark size={12} className="text-theme-primary fill-current" />}
                  </div>
                  <p className="text-[10px] text-theme-secondary mt-0.5">{surah.translation} • {surah.verses_count} Ayahs</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold font-arabic text-theme-text">{surah.arabic}</p>
                <p className="text-[9px] text-theme-secondary mt-0.5 uppercase font-bold tracking-wider">{surah.type}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default QuranPage;
