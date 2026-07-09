import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bookmark, Volume2, Play, Pause, ListMusic } from 'lucide-react';
import { fetchSurahDetails } from '../utils/quranService';

const QuranReaderPage = () => {
  const { id } = useParams();
  const surahId = parseInt(id);
  const navigate = useNavigate();

  const [surah, setSurah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedReciter, setSelectedReciter] = useState('ar.alafasy');
  const [bookmarks, setBookmarks] = useState(JSON.parse(localStorage.getItem('bookmarks')) || []);
  
  // AUDIO SEQUENCE STATE
  const [playingState, setPlayingState] = useState('idle'); // idle, auzu, bismillah, ayah
  const [playingAyahIdx, setPlayingAyahIdx] = useState(null);
  const audioRef = useRef(new Audio());

  const reciters = [
    { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy' },
    { id: 'ar.abdurrahmaansudais', name: 'Abdul Rahman Al-Sudais' },
    { id: 'ar.maheralmuaiqly', name: 'Maher Al-Muaiqly' },
    { id: 'ar.shaatree', name: 'Abu Bakr Al-Shatri' }
  ];

  useEffect(() => {
    setLoading(true);
    fetchSurahDetails(surahId, selectedReciter)
      .then(details => setSurah(details))
      .catch(() => navigate('/quran'))
      .finally(() => setLoading(false));
  }, [surahId, selectedReciter]);

  useEffect(() => {
    return () => {
      audioRef.current.pause();
    };
  }, []);

  const toggleBookmark = () => {
    let newBookmarks = [...bookmarks];
    if (newBookmarks.includes(surahId)) {
      newBookmarks = newBookmarks.filter(bId => bId !== surahId);
    } else {
      newBookmarks.push(surahId);
    }
    setBookmarks(newBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
  };

  // AUDIO PLAYBACK SEQUENCER
  const handlePlaySequence = (startIdx = 0) => {
    // If we're already playing the exact item, pause it
    if (playingAyahIdx === startIdx && playingState === 'ayah' && !audioRef.current.paused) {
      audioRef.current.pause();
      setPlayingState('idle');
      return;
    }

    // Sequence execution:
    // 1. Play Audhubillah (if starting from beginning)
    // 2. Play Bismillah (if starting from beginning and not Surah 9)
    // 3. Play Ayahs sequentially
    
    if (startIdx === 0) {
      playAudhubillah(() => {
        if (surahId !== 9) {
          playBismillah(() => {
            playAyah(0);
          });
        } else {
          playAyah(0);
        }
      });
    } else {
      // Just play the clicked ayah directly
      playAyah(startIdx);
    }
  };

  const playAudhubillah = (onEnded) => {
    setPlayingState('auzu');
    setPlayingAyahIdx(null);
    audioRef.current.src = 'https://everyayah.com/data/Alafasy_128kbps/Audhubillah.mp3';
    audioRef.current.play().catch(() => onEnded());
    audioRef.current.onended = onEnded;
  };

  const playBismillah = (onEnded) => {
    setPlayingState('bismillah');
    audioRef.current.src = 'https://everyayah.com/data/Alafasy_128kbps/001001.mp3';
    audioRef.current.play().catch(() => onEnded());
    audioRef.current.onended = onEnded;
  };

  const playAyah = (index) => {
    if (!surah || !surah.verses || index >= surah.verses.length) {
      setPlayingState('idle');
      setPlayingAyahIdx(null);
      return;
    }

    setPlayingState('ayah');
    setPlayingAyahIdx(index);
    const verse = surah.verses[index];
    audioRef.current.src = verse.audio;
    audioRef.current.play().catch(() => {
      alert("Audio failed to load. Check network connection.");
      setPlayingState('idle');
      setPlayingAyahIdx(null);
    });

    audioRef.current.onended = () => {
      playAyah(index + 1);
    };
  };

  const getAudioStatusText = () => {
    if (playingState === 'auzu') return "Reciting A'uzubillah...";
    if (playingState === 'bismillah') return "Reciting Bismillah...";
    if (playingState === 'ayah') return `Reciting Ayah ${playingAyahIdx + 1}...`;
    return '';
  };

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text p-4 pb-20 max-w-2xl mx-auto shadow-xl transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => {
              audioRef.current.pause();
              navigate('/quran');
            }} 
            className="p-2 bg-theme-secondary hover:bg-theme-primary-light rounded-full transition-all"
          >
            <ArrowLeft size={18} className="text-theme-primary" />
          </button>
          {surah && (
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">{surah.name}</h2>
              <p className="text-xs text-theme-secondary">{surah.translation} • {surah.bengali}</p>
            </div>
          )}
        </div>
        {surah && (
          <button 
            onClick={toggleBookmark}
            className={`p-2.5 rounded-full ${bookmarks.includes(surahId) ? 'bg-theme-primary text-white shadow-md' : 'bg-theme-secondary text-theme-primary'}`}
          >
            <Bookmark size={18} />
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-9 h-9 border-4 border-theme-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-theme-secondary">Loading Surah content and setting up recitations...</p>
        </div>
      ) : (
        surah && (
          <div>
            <div className="bg-theme-card p-5 rounded-3xl border border-theme-border shadow-sm mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-theme-primary-light rounded-2xl text-theme-primary">
                  <ListMusic size={20} />
                </div>
                <div className="text-xs">
                  <span className="text-theme-secondary block">Active Reciter</span>
                  <select
                    value={selectedReciter}
                    onChange={(e) => setSelectedReciter(e.target.value)}
                    className="bg-transparent border-none outline-none font-bold text-theme-text mt-0.5"
                  >
                    {reciters.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button 
                  onClick={() => handlePlaySequence(0)}
                  className="flex items-center justify-center gap-1.5 w-full md:w-auto px-5 py-3 bg-theme-primary hover:bg-theme-primary-hover text-white font-bold rounded-2xl text-xs shadow-md transition-all active:scale-95"
                >
                  {playingState !== 'idle' ? <Pause size={14} /> : <Play size={14} />}
                  {playingState !== 'idle' ? 'Pause' : 'Play Full Surah'}
                </button>
              </div>
            </div>

            {playingState !== 'idle' && (
              <div className="bg-theme-primary-light border border-theme-primary/10 text-theme-primary p-3 rounded-2xl text-xs font-bold mb-4 text-center animate-pulse">
                {getAudioStatusText()}
              </div>
            )}

            {/* Verses Container */}
            <div className="space-y-4">
              {surah.verses && surah.verses.map((verse, idx) => (
                <div 
                  key={idx} 
                  className={`p-5 rounded-3xl border shadow-sm transition-all duration-200 ${
                    playingAyahIdx === idx && playingState === 'ayah'
                      ? 'bg-theme-primary-light border-theme-primary/30 scale-[1.01]' 
                      : 'bg-theme-card border-theme-border'
                  }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="w-6 h-6 rounded-full bg-theme-secondary text-theme-primary text-[10px] flex items-center justify-center font-bold">
                      {verse.number}
                    </span>
                    <button 
                      onClick={() => handlePlaySequence(idx)}
                      className={`p-2 rounded-xl transition-all active:scale-95 ${
                        playingAyahIdx === idx && playingState === 'ayah'
                          ? 'bg-red-500 text-white' 
                          : 'bg-theme-secondary text-theme-primary hover:bg-theme-primary hover:text-white'
                      }`}
                    >
                      {playingAyahIdx === idx && playingState === 'ayah' ? <Pause size={12} /> : <Play size={12} />}
                    </button>
                  </div>
                  <p className="text-right text-3xl font-arabic leading-loose mb-4 tracking-wide text-theme-text">
                    {verse.ar}
                  </p>
                  <div className="space-y-1.5 text-xs border-t border-theme-border pt-3">
                    <p className="text-theme-secondary italic leading-relaxed">
                      <strong>Pronunciation:</strong> {verse.bn}
                    </p>
                    <p className="text-theme-text leading-relaxed">
                      <strong>English:</strong> {verse.en}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default QuranReaderPage;
