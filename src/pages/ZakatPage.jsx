import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calculator } from 'lucide-react';

const ZakatPage = () => {
  const navigate = useNavigate();
  const [cash, setCash] = useState(0);
  const [gold, setGold] = useState(0);
  const [silver, setSilver] = useState(0);
  const [businessAssets, setBusinessAssets] = useState(0);
  const [liabilities, setLiabilities] = useState(0);
  const [goldPrice, setGoldPrice] = useState(9000); 
  const [silverPrice, setSilverPrice] = useState(150); 

  const calculateZakat = () => {
    const totalGoldValue = gold * goldPrice;
    const totalSilverValue = silver * silverPrice;
    const totalAssets = cash + totalGoldValue + totalSilverValue + businessAssets;
    const netAssets = totalAssets - liabilities;
    const silverNisabThreshold = 612.36 * silverPrice;
    const isEligible = netAssets >= silverNisabThreshold;
    const zakatDue = isEligible ? netAssets * 0.025 : 0;

    return {
      totalAssets,
      netAssets,
      silverNisabThreshold,
      isEligible,
      zakatDue
    };
  };

  const results = calculateZakat();

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
          <h2 className="text-xl font-extrabold tracking-tight">Zakat Calculator</h2>
          <p className="text-xs text-theme-secondary">Calculate wealth options against current Nisab thresholds</p>
        </div>
      </div>

      <div className="bg-theme-card p-5 rounded-3xl border border-theme-border shadow-sm mb-6 space-y-4">
        <h3 className="font-bold text-sm text-theme-text flex items-center gap-1.5">
          <Calculator size={18} className="text-theme-primary" /> Asset Valuation
        </h3>
        
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-theme-secondary font-bold mb-1 uppercase text-[9px]">Gold Price (BDT/gram)</label>
            <input 
              type="number" 
              value={goldPrice} 
              onChange={(e) => setGoldPrice(parseFloat(e.target.value) || 0)}
              className="w-full bg-theme-secondary border border-theme-border p-2.5 rounded-xl outline-none text-theme-text"
            />
          </div>
          <div>
            <label className="block text-theme-secondary font-bold mb-1 uppercase text-[9px]">Silver Price (BDT/gram)</label>
            <input 
              type="number" 
              value={silverPrice} 
              onChange={(e) => setSilverPrice(parseFloat(e.target.value) || 0)}
              className="w-full bg-theme-secondary border border-theme-border p-2.5 rounded-xl outline-none text-theme-text"
            />
          </div>
        </div>

        <hr className="border-theme-border" />

        <div className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold mb-1 text-theme-text">Cash, Savings & Bank Balances</label>
            <input 
              type="number" 
              value={cash || ''} 
              placeholder="0 BDT"
              onChange={(e) => setCash(parseFloat(e.target.value) || 0)}
              className="w-full bg-theme-secondary border border-theme-border p-3 rounded-xl outline-none text-sm font-semibold text-theme-text"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1 text-theme-text">Gold Weight owned (grams)</label>
            <input 
              type="number" 
              value={gold || ''} 
              placeholder="0 g"
              onChange={(e) => setGold(parseFloat(e.target.value) || 0)}
              className="w-full bg-theme-secondary border border-theme-border p-3 rounded-xl outline-none text-sm font-semibold text-theme-text"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1 text-theme-text">Silver Weight owned (grams)</label>
            <input 
              type="number" 
              value={silver || ''} 
              placeholder="0 g"
              onChange={(e) => setSilver(parseFloat(e.target.value) || 0)}
              className="w-full bg-theme-secondary border border-theme-border p-3 rounded-xl outline-none text-sm font-semibold text-theme-text"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1 text-theme-text">Value of Business Stocks / Inventory</label>
            <input 
              type="number" 
              value={businessAssets || ''} 
              placeholder="0 BDT"
              onChange={(e) => setBusinessAssets(parseFloat(e.target.value) || 0)}
              className="w-full bg-theme-secondary border border-theme-border p-3 rounded-xl outline-none text-sm font-semibold text-theme-text"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1 text-theme-text">Debts & Liabilities to deduct</label>
            <input 
              type="number" 
              value={liabilities || ''} 
              placeholder="0 BDT"
              onChange={(e) => setLiabilities(parseFloat(e.target.value) || 0)}
              className="w-full bg-theme-secondary border border-theme-border p-3 rounded-xl outline-none text-sm font-semibold text-theme-text"
            />
          </div>
        </div>
      </div>

      {/* Calculations Result */}
      <div className="bg-theme-secondary p-5 rounded-3xl border border-theme-border space-y-4">
        <h4 className="text-[10px] uppercase font-bold text-theme-primary tracking-wider">Results Summary</h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-theme-text">
            <span>Total Valued Assets:</span>
            <span className="font-bold">{results.totalAssets.toFixed(2)} BDT</span>
          </div>
          <div className="flex justify-between text-theme-text">
            <span>Net Liquid Wealth:</span>
            <span className="font-bold">{results.netAssets.toFixed(2)} BDT</span>
          </div>
          <div className="flex justify-between text-theme-text">
            <span>Nisab Threshold (612.36g Silver):</span>
            <span className="font-bold">{results.silverNisabThreshold.toFixed(2)} BDT</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-theme-card border border-theme-border flex flex-col items-center text-center">
          {results.isEligible ? (
            <>
              <span className="text-[10px] text-yellow-500 uppercase tracking-wider font-extrabold mb-1">Zakat Obligatory</span>
              <span className="text-3xl font-extrabold text-theme-primary">{results.zakatDue.toFixed(2)} BDT</span>
              <span className="text-[9px] text-theme-secondary mt-1">2.5% on Net wealth to be paid annually.</span>
            </>
          ) : (
            <>
              <span className="text-[10px] text-theme-secondary uppercase tracking-wider font-extrabold mb-1">Below Nisab</span>
              <span className="text-2xl font-bold">0.00 BDT</span>
              <span className="text-[9px] text-theme-secondary mt-1">No Zakat is due on this current balance.</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ZakatPage;
