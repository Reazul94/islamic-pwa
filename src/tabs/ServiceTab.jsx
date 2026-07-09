import React, { useState, useRef } from 'react';
import { ArrowLeft, Calculator, Briefcase, FileText, Users, HelpCircle, Heart, Search } from 'lucide-react';
import masayelData from '../data/masayel.json';

const ServiceTab = () => {
  const [activeView, setActiveView] = useState('grid'); // grid, zakat, masayel, biniyog, matrimony
  const scrollRef = useRef(null);
  
  // ZAKAT CALCULATOR STATE
  const [cash, setCash] = useState(0);
  const [gold, setGold] = useState(0);
  const [silver, setSilver] = useState(0);
  const [businessAssets, setBusinessAssets] = useState(0);
  const [liabilities, setLiabilities] = useState(0);
  const [goldPrice, setGoldPrice] = useState(9000); // per gram in BDT (customizable)
  const [silverPrice, setSilverPrice] = useState(150); // per gram in BDT

  // MASAYEL STATE
  const [masayelQuery, setMasayelQuery] = useState('');

  const menuItems = [
    { id: 'zakat', title: 'Zakat Calculator', icon: Calculator, desc: 'Calculate assets against current Nisab' },
    { id: 'masayel', title: 'Masayel Database', icon: FileText, desc: 'Common Fatwas & questions answered offline' },
    { id: 'biniyog', title: 'Biniyog (Halal Finance)', icon: Briefcase, desc: 'Islamic investment principles and resources' },
    { id: 'matrimony', title: 'Matrimony', icon: Users, desc: 'Halal matchmaking information' }
  ];

  // ZAKAT CALCULATION LOGIC
  const calculateZakat = () => {
    const totalGoldValue = gold * goldPrice;
    const totalSilverValue = silver * silverPrice;
    const totalAssets = cash + totalGoldValue + totalSilverValue + businessAssets;
    const netAssets = totalAssets - liabilities;
    
    // Nisab Threshold: Value of 87.48 grams of gold or 612.36 grams of silver
    // Typically silver Nisab is lower, so it is safer and more beneficial for poor to use silver Nisab
    const silverNisabThreshold = 612.36 * silverPrice;
    const goldNisabThreshold = 87.48 * goldPrice;
    
    const isEligible = netAssets >= silverNisabThreshold;
    const zakatDue = isEligible ? netAssets * 0.025 : 0;

    return {
      totalAssets,
      netAssets,
      silverNisabThreshold,
      goldNisabThreshold,
      isEligible,
      zakatDue
    };
  };

  const zakatResults = calculateZakat();

  // 1. RENDER ZAKAT CALCULATOR
  const renderZakatCalculator = () => {
    return (
      <div ref={scrollRef} className="p-4 pb-24 animate-fade-in scroll-mt-2">
        <button 
          onClick={() => setActiveView('grid')} 
          className="flex items-center gap-1.5 text-xs font-semibold text-islamic-600 dark:text-islamic-400 mb-4 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm mb-6 space-y-4">
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">Advanced Zakat Calculator</h3>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1 uppercase text-[9px]">Gold Price (per gram)</label>
              <input 
                type="number" 
                value={goldPrice} 
                onChange={(e) => setGoldPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-bold mb-1 uppercase text-[9px]">Silver Price (per gram)</label>
              <input 
                type="number" 
                value={silverPrice} 
                onChange={(e) => setSilverPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl outline-none"
              />
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-700" />

          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-200">Cash & Savings</label>
              <input 
                type="number" 
                value={cash || ''} 
                placeholder="0 BDT"
                onChange={(e) => setCash(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl outline-none text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-200">Gold Quantity (grams)</label>
              <input 
                type="number" 
                value={gold || ''} 
                placeholder="0 g"
                onChange={(e) => setGold(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl outline-none text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-200">Silver Quantity (grams)</label>
              <input 
                type="number" 
                value={silver || ''} 
                placeholder="0 g"
                onChange={(e) => setSilver(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl outline-none text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-200">Business Assets / Inventory</label>
              <input 
                type="number" 
                value={businessAssets || ''} 
                placeholder="0 BDT"
                onChange={(e) => setBusinessAssets(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl outline-none text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-200">Liabilities / Debts to Pay</label>
              <input 
                type="number" 
                value={liabilities || ''} 
                placeholder="0 BDT"
                onChange={(e) => setLiabilities(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl outline-none text-sm font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Calculations display */}
        <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-lg border border-slate-800">
          <h4 className="text-[10px] uppercase font-bold text-islamic-400 tracking-wider mb-2">Calculation Results</h4>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="opacity-80">Total Wealth:</span>
              <span className="font-bold">{zakatResults.totalAssets.toFixed(2)} BDT</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-80">Net Wealth (Wealth - Liabilities):</span>
              <span className="font-bold">{zakatResults.netAssets.toFixed(2)} BDT</span>
            </div>
            <div className="flex justify-between border-t border-slate-850 pt-2.5">
              <span className="opacity-80">Silver Nisab Threshold (612.36g):</span>
              <span className="font-semibold text-islamic-300">{zakatResults.silverNisabThreshold.toFixed(2)} BDT</span>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center text-center">
            {zakatResults.isEligible ? (
              <>
                <span className="text-[10px] text-yellow-300 uppercase tracking-widest font-extrabold mb-1">Zakat is Obligatory</span>
                <span className="text-3xl font-extrabold text-islamic-400">{zakatResults.zakatDue.toFixed(2)} BDT</span>
                <span className="text-[9px] opacity-60 mt-1">2.5% payable on Net wealth</span>
              </>
            ) : (
              <>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold mb-1">Below Nisab</span>
                <span className="text-2xl font-bold">0.00 BDT</span>
                <span className="text-[9px] opacity-60 mt-1">Net wealth does not exceed the Nisab threshold.</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 2. RENDER MASAYEL DATABASE
  const renderMasayel = () => {
    return (
      <div className="p-4 pb-24 animate-fade-in">
        <button 
          onClick={() => setActiveView('grid')} 
          className="flex items-center gap-1.5 text-xs font-semibold text-islamic-600 dark:text-islamic-400 mb-4 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3">Fatwa & Rulings</h3>

        <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 mb-4 shadow-sm">
          <Search size={18} className="text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search questions or rulings..."
            value={masayelQuery}
            onChange={(e) => setMasayelQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full text-slate-800 dark:text-slate-100 placeholder-slate-400"
          />
        </div>

        <div className="space-y-4">
          {masayelData
            .filter(m => m.question.toLowerCase().includes(masayelQuery.toLowerCase()) || m.bn_question.toLowerCase().includes(masayelQuery.toLowerCase()))
            .map((masayel) => (
              <div key={masayel.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="flex items-start space-x-2.5 mb-3">
                  <HelpCircle className="text-islamic-600 shrink-0 mt-0.5" size={18} />
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{masayel.question} ({masayel.bn_question})</h4>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  <p className="font-semibold text-islamic-600 mb-1">Answer:</p>
                  {masayel.answer}
                  <hr className="my-2 border-slate-200 dark:border-slate-750" />
                  <p className="text-slate-600 dark:text-slate-400 italic">{masayel.bn_answer}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  };

  // 3. RENDER HALAL FINANCE INFO
  const renderBiniyog = () => (
    <div ref={scrollRef} className="p-4 pb-24 animate-fade-in scroll-mt-2">
      <button onClick={() => setActiveView('grid')} className="flex items-center gap-1.5 text-xs font-semibold text-islamic-600 mb-4 bg-slate-100 px-3 py-1.5 rounded-full"><ArrowLeft size={14} /> Back</button>
      <h3 className="text-lg font-bold mb-3">Halal Investment Principles</h3>
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
        <div>
          <h4 className="font-bold text-sm text-islamic-600">Avoid Riba (Interest)</h4>
          <p className="mt-1">Any deal guaranteed with fixed profits regardless of business performance is categorized as Riba and is forbidden.</p>
        </div>
        <div>
          <h4 className="font-bold text-sm text-islamic-600">Profit-Loss Sharing (Mudarabah)</h4>
          <p className="mt-1">Halal finance dictates that both parties must share risks. Partners agree on a profit ratio, while financial loss is borne by the capital provider unless negligence is proven.</p>
        </div>
        <div>
          <h4 className="font-bold text-sm text-islamic-600">Sectors to Avoid</h4>
          <p className="mt-1">Companies engaged in alcohol, gaming, conventional financial services, weapons, or non-halal foods are strictly prohibited.</p>
        </div>
      </div>
    </div>
  );

  // 4. RENDER MATRIMONY
  const renderMatrimony = () => (
    <div ref={scrollRef} className="p-4 pb-24 animate-fade-in scroll-mt-2">
      <button onClick={() => setActiveView('grid')} className="flex items-center gap-1.5 text-xs font-semibold text-islamic-600 mb-4 bg-slate-100 px-3 py-1.5 rounded-full"><ArrowLeft size={14} /> Back</button>
      <h3 className="text-lg font-bold mb-3">Halal Matrimony</h3>
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm text-center py-8">
        <Heart className="text-red-500 mx-auto mb-3 animate-pulse" size={32} />
        <h4 className="font-bold text-sm mb-1">Muslim Bangla Matchmaking</h4>
        <p className="text-xs text-slate-400 max-w-xs mx-auto mb-4">Halal, guardian-involved profiles to find your life partner in accordance with Islamic guidelines.</p>
        <button className="bg-islamic-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-islamic-500">
          Open Matrimony Portal (Offline Mode)
        </button>
      </div>
    </div>
  );

  // MAIN GRID VIEW
  const renderGrid = () => {
    return (
      <div className="p-4 pb-24 animate-fade-in">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Service</h2>
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.id} 
                onClick={() => {
                  setActiveView(item.id);
                  setTimeout(() => {
                    if (scrollRef.current) {
                      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 100);
                }}
                className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/80 flex flex-col items-center justify-center text-center hover:shadow-md cursor-pointer hover:border-islamic-200 dark:hover:border-slate-600 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-islamic-50 dark:bg-slate-700 text-islamic-600 dark:text-islamic-400 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">{item.title}</h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 leading-snug">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  switch (activeView) {
    case 'zzakkat': // fallback typo
    case 'zakat': return renderZakatCalculator();
    case 'masayel': return renderMasayel();
    case 'biniyog': return renderBiniyog();
    case 'matrimony': return renderMatrimony();
    default: return renderGrid();
  }
};

export default ServiceTab;
