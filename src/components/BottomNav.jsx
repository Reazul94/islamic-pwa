import React from 'react';
import { BookOpen, Activity, HeartHandshake, Grid } from 'lucide-react';
import clsx from 'clsx';

const BottomNav = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'ilm', label: 'Ilm', icon: BookOpen },
    { id: 'amal', label: 'Amal', icon: Activity },
    { id: 'service', label: 'Service', icon: HeartHandshake },
    { id: 'other', label: 'Other', icon: Grid },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe z-50">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200",
                isActive ? "text-islamic-600 dark:text-islamic-400" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
              )}
            >
              <Icon className={clsx("w-6 h-6", isActive && "animate-bounce")} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
