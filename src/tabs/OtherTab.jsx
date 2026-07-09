import React from 'react';
import { Compass, Map, Heart, Calendar } from 'lucide-react';

const OtherTab = () => {
  const items = [
    { title: 'Qibla Compass', icon: Compass, desc: 'Point to Mecca' },
    { title: 'Mosque', icon: Map, desc: 'Find nearby mosques' },
    { title: 'Names of Allah', icon: Heart, desc: 'Asma-ul-Husna' },
    { title: 'Calendar', icon: Calendar, desc: 'Important Days' },
  ];

  return (
    <div className="p-4 pb-24">
      <h2 className="text-xl font-bold mb-4">Other Tools</h2>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center hover:bg-islamic-50 dark:hover:bg-slate-700 transition-colors">
              <div className="w-12 h-12 bg-islamic-100 dark:bg-slate-700 text-islamic-600 dark:text-islamic-400 rounded-full flex items-center justify-center mb-3">
                <Icon size={24} />
              </div>
              <h3 className="font-semibold text-sm">{item.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
            </div>
          );
        })}
      </div>
      
      {/* Sadaqah Jariyah Banner */}
      <div className="mt-8 bg-islamic-600 text-white rounded-2xl p-5 shadow-lg flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg">Support Muslim Bangla</h3>
          <p className="text-sm opacity-90 mt-1">Sadaqah Jariyah for app maintenance.</p>
        </div>
        <button className="bg-white text-islamic-600 px-4 py-2 rounded-full text-sm font-semibold shadow-sm hover:bg-slate-100 transition-colors">
          Donate
        </button>
      </div>
    </div>
  );
};

export default OtherTab;
