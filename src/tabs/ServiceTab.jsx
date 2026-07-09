import React from 'react';
import { Calculator, Briefcase, FileText, Users } from 'lucide-react';

const ServiceTab = () => {
  const items = [
    { title: 'Zakat Calculator', icon: Calculator, desc: 'Calculate your Zakat' },
    { title: 'Biniyog', icon: Briefcase, desc: 'Halal Investments' },
    { title: 'Masayel', icon: FileText, desc: 'Fatwa & Q&A' },
    { title: 'Matrimony', icon: Users, desc: 'Islamic Marriage' },
  ];

  return (
    <div className="p-4 pb-24">
      <h2 className="text-xl font-bold mb-4">Service</h2>
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
    </div>
  );
};

export default ServiceTab;
