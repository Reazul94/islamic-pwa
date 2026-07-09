import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calculator, Briefcase, FileText, Users } from 'lucide-react';

const ServiceTab = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('grid'); // grid, biniyog
  const readerRef = useRef(null);

  const menuItems = [
    { id: 'zakat', title: 'Zakat Calculator', icon: Calculator, desc: 'Calculate assets against current Nisab', action: () => navigate('/zakat') },
    { id: 'masayel', title: 'Masayel Database', icon: FileText, desc: 'Common Fatwas & questions answered offline', action: () => navigate('/masayel') },
    { id: 'biniyog', title: 'Biniyog (Halal Finance)', icon: Briefcase, desc: 'Islamic investment principles and resources', action: () => { setActiveView('biniyog'); scrollDetail(); } },
    { id: 'matrimony', title: 'Matrimony', icon: Users, desc: 'Redirect to ordhekdeen.com matrimonial portal', action: () => window.open('https://ordhekdeen.com/', '_blank') }
  ];

  const scrollDetail = () => {
    setTimeout(() => {
      if (readerRef.current) {
        readerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const renderGrid = () => (
    <div className="p-4 animate-fade-in">
      <h2 className="text-xl font-bold text-theme-text mb-4">Service</h2>
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

  const renderBiniyog = () => (
    <div ref={readerRef} className="p-4 pb-24 animate-fade-in scroll-mt-2">
      <button onClick={() => setActiveView('grid')} className="flex items-center gap-1.5 text-xs font-semibold text-theme-primary mb-4 bg-theme-secondary px-3 py-1.5 rounded-full"><ArrowLeft size={14} /> Back</button>
      <h3 className="text-lg font-bold mb-3 text-theme-text">Halal Investment Principles</h3>
      <div className="bg-theme-card p-5 rounded-2xl border border-theme-border shadow-sm space-y-4 text-xs leading-relaxed text-theme-secondary">
        <div>
          <h4 className="font-bold text-sm text-theme-primary">Avoid Riba (Interest)</h4>
          <p className="mt-1">Any deal guaranteed with fixed profits regardless of business performance is categorized as Riba and is forbidden.</p>
        </div>
        <div>
          <h4 className="font-bold text-sm text-theme-primary">Profit-Loss Sharing (Mudarabah)</h4>
          <p className="mt-1">Halal finance dictates that both parties must share risks. Partners agree on a profit ratio, while financial loss is borne by the capital provider unless negligence is proven.</p>
        </div>
        <div>
          <h4 className="font-bold text-sm text-theme-primary">Sectors to Avoid</h4>
          <p className="mt-1">Companies engaged in alcohol, gaming, conventional financial services, weapons, or non-halal foods are strictly prohibited.</p>
        </div>
      </div>
    </div>
  );

  return activeView === 'biniyog' ? renderBiniyog() : renderGrid();
};

export default ServiceTab;
