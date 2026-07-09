import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw } from 'lucide-react';

const TasbihPage = () => {
  const navigate = useNavigate();
  const [tasbihCount, setTasbihCount] = useState(0);
  const [tasbihTarget, setTasbihTarget] = useState(33);

  const incrementTasbih = () => {
    const newCount = tasbihCount + 1;
    setTasbihCount(newCount);
    
    if (navigator.vibrate) {
      if (newCount === tasbihTarget) {
        navigator.vibrate([100, 50, 100]); 
      } else {
        navigator.vibrate(30); 
      }
    }
  };

  const resetTasbih = () => {
    setTasbihCount(0);
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
          <h2 className="text-xl font-extrabold tracking-tight">Digital Tasbih</h2>
          <p className="text-xs text-theme-secondary">Dhikr counter clicker with target vibrations</p>
        </div>
      </div>

      <div className="bg-theme-card rounded-3xl border border-theme-border p-8 shadow-sm flex flex-col items-center text-center">
        <span className="text-xs text-theme-secondary uppercase tracking-widest font-bold mb-1">Dhikr Counter</span>
        <h3 className="font-bold text-sm mb-8 text-theme-text">Subhanallah / Alhamdulillah / Allahu Akbar</h3>

        {/* Clicker Circle */}
        <div 
          onClick={incrementTasbih}
          className="w-48 h-48 rounded-full bg-gradient-to-br from-theme-primary to-theme-primary-hover text-white flex flex-col items-center justify-center shadow-xl border-8 border-theme-secondary cursor-pointer active:scale-95 transition-transform select-none relative"
        >
          <span className="text-5xl font-extrabold tracking-tight">{tasbihCount}</span>
          <span className="text-[10px] text-white/80 uppercase tracking-wider font-bold mt-2">Target: {tasbihTarget}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between w-full mt-10">
          <button 
            onClick={resetTasbih}
            className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/20 px-4 py-2.5 rounded-xl active:scale-95 transition-all"
          >
            <RotateCcw size={14} /> Reset
          </button>

          <div className="flex items-center space-x-1.5 bg-theme-secondary p-1 rounded-xl">
            {[33, 99, 100].map((tVal) => (
              <button
                key={tVal}
                onClick={() => setTasbihTarget(tVal)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${tasbihTarget === tVal ? 'bg-theme-card shadow-sm text-theme-primary' : 'text-theme-secondary'}`}
              >
                {tVal}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasbihPage;
