import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, HelpCircle } from 'lucide-react';
import masayelData from '../data/masayel.json';

const MasayelPage = () => {
  const navigate = useNavigate();
  const [masayelQuery, setMasayelQuery] = useState('');

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
          <h2 className="text-xl font-extrabold tracking-tight">Masayel Database</h2>
          <p className="text-xs text-theme-secondary">Common Rulings & Islamic Q&As offline</p>
        </div>
      </div>

      <div className="flex items-center bg-theme-card border border-theme-border rounded-2xl px-4 py-3 mb-6 shadow-sm">
        <Search size={18} className="text-theme-secondary mr-2" />
        <input 
          type="text" 
          placeholder="Search fatwa rulings..."
          value={masayelQuery}
          onChange={(e) => setMasayelQuery(e.target.value)}
          className="bg-transparent border-none outline-none text-sm w-full placeholder-theme-secondary text-theme-text"
        />
      </div>

      <div className="space-y-4">
        {masayelData
          .filter(m => m.question.toLowerCase().includes(masayelQuery.toLowerCase()) || m.bn_question.toLowerCase().includes(masayelQuery.toLowerCase()))
          .map((masayel) => (
            <div key={masayel.id} className="bg-theme-card p-5 rounded-3xl border border-theme-border shadow-sm">
              <div className="flex items-start space-x-2.5 mb-3">
                <HelpCircle className="text-theme-primary shrink-0 mt-0.5" size={18} />
                <h4 className="font-extrabold text-sm text-theme-text">{masayel.question} <span className="text-theme-secondary font-medium">({masayel.bn_question})</span></h4>
              </div>
              <div className="bg-theme-secondary p-3 rounded-2xl border border-theme-border text-xs text-theme-text leading-relaxed whitespace-pre-line">
                <p className="font-bold text-theme-primary mb-1">Answer:</p>
                {masayel.answer}
                <hr className="my-2 border-theme-border" />
                <p className="text-theme-secondary italic">{masayel.bn_answer}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MasayelPage;
