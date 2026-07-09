import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, HandMetal, Moon, Navigation } from 'lucide-react';

const AmalTab = () => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'tracker', title: 'Daily Salat Tracker', icon: CheckCircle2, desc: 'Log prayers & view consistency charts', action: () => navigate('/tracker') },
    { id: 'tasbih', title: 'Digital Tasbih', icon: HandMetal, desc: 'Offline count clicker with target vibration', action: () => navigate('/tasbih') },
    { id: 'duas', title: 'Hisnul Muslim', icon: Moon, desc: 'Dua & Azkar explorer with references', action: () => navigate('/duas') },
    { id: 'mushaf', title: 'Mushaf', icon: Navigation, desc: 'Physical Quran page reading layout', action: () => navigate('/mushaf') }
  ];

  return (
    <div className="p-4 animate-fade-in">
      <h2 className="text-xl font-bold text-theme-text mb-4">Amal (Actions)</h2>
      <div className="grid grid-cols-2 gap-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.id} 
              onClick={item.action}
              className="bg-theme-card p-4 rounded-3xl shadow-sm border border-theme-border flex flex-col items-center justify-center text-center hover:shadow-md cursor-pointer hover:border-theme-primary transition-all duration-300 group"
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
};

export default AmalTab;
