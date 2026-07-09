import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Heart } from 'lucide-react';
import namesData from '../data/namesOfAllah.json';

const NamesPage = () => {
  const navigate = useNavigate();
  const [playingNameId, setPlayingNameId] = useState(null);

  const togglePlayName = (nameId) => {
    if (playingNameId === nameId) {
      setPlayingNameId(null);
    } else {
      setPlayingNameId(nameId);
      // Simulated audio
      alert("Pronunciation audio playing (offline cache loaded).");
      setTimeout(() => setPlayingNameId(null), 2000);
    }
  };

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
          <h2 className="text-xl font-extrabold tracking-tight">Asma-ul-Husna</h2>
          <p className="text-xs text-theme-secondary">99 Names of Allah with translation and pronunciation</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {namesData.map((name) => (
          <div 
            key={name.id} 
            className="bg-theme-card p-5 rounded-3xl border border-theme-border shadow-sm flex flex-col items-center justify-between text-center relative group"
          >
            <div className="absolute top-2.5 right-2.5">
              <button 
                onClick={() => togglePlayName(name.id)}
                className="p-1.5 bg-theme-secondary hover:bg-theme-primary-light text-theme-primary rounded-full transition-all"
              >
                {playingNameId === name.id ? <Pause size={10} /> : <Play size={10} />}
              </button>
            </div>
            
            <div className="w-9 h-9 rounded-full bg-theme-secondary text-[10px] font-bold flex items-center justify-center text-theme-secondary mb-2">
              {name.id}
            </div>

            <h4 className="text-2xl font-arabic text-theme-text leading-normal mb-1">{name.ar}</h4>
            <p className="text-xs font-bold text-theme-primary">{name.bn_trans}</p>
            <p className="text-[10px] text-theme-secondary mt-1 font-semibold leading-tight">{name.en}</p>
            <p className="text-[10px] text-theme-secondary mt-0.5">{name.bn}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NamesPage;
