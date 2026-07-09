import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const MushafPage = () => {
  const navigate = useNavigate();

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
          <h2 className="text-xl font-extrabold tracking-tight">Mushaf Quran</h2>
          <p className="text-xs text-theme-secondary">Physical Page Mushaf simulator</p>
        </div>
      </div>

      <div className="bg-[#fcf8f2] dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-3xl p-6 border-2 border-[#e6d5bf] dark:border-slate-700 shadow-md relative font-serif">
        <div className="absolute top-2 bottom-2 left-2 right-2 border border-[#f0e3d0] dark:border-slate-700 pointer-events-none rounded-2xl"></div>
        
        <div className="flex justify-between items-center text-[10px] text-[#8c7456] dark:text-slate-400 mb-4 px-2">
          <span>Surah Al-Fatihah</span>
          <span>Juz' 1</span>
        </div>

        <div className="text-center font-arabic text-2xl leading-[3.5rem] tracking-wide py-4 select-text">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝
          الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝
          الرَّحْمَٰنِ الرَّحِيمِ ۝
          مَالِكِ يَوْمِ الدِّينِ ۝
          إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝
          اهْدِنَا الصِّরَاطَ الْمُسْتَقِيمَ ۝
          صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ۝
        </div>

        <div className="flex justify-center text-xs text-[#8c7456] dark:text-slate-400 mt-6 border-t border-[#f0e3d0] dark:border-slate-700 pt-3">
          <span>Page 1</span>
        </div>
      </div>
    </div>
  );
};

export default MushafPage;
