import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Heart, Shield, BookOpen, User, Home, HelpCircle } from 'lucide-react';
import duasData from '../data/duas.json';

const DuaPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [duaSearch, setDuaSearch] = useState('');

  const categories = [
    { id: 'All', name: 'All Duas', bn: 'সব দুআ', icon: BookOpen },
    { id: 'Morning & Evening', name: 'Morning/Evening', bn: 'সকাল ও সন্ধ্যা', icon: Shield },
    { id: 'Home & Travel', name: 'Home & Travel', bn: 'ঘর ও সফর', icon: Home },
    { id: 'distress', name: 'Protection', bn: 'সুরক্ষা ও সাহায্য', icon: Heart },
    { id: 'general', name: 'General Daily', bn: 'সাধারণ দোয়া', icon: User }
  ];

  const filteredDuas = duasData.filter(d => {
    const matchesCategory = selectedCategory === 'All' || d.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = d.title.toLowerCase().includes(duaSearch.toLowerCase()) || 
                          d.bn_title.toLowerCase().includes(duaSearch.toLowerCase()) ||
                          d.bn_mean.toLowerCase().includes(duaSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text p-4 pb-20 max-w-2xl mx-auto shadow-xl transition-colors duration-300">
      
      {/* Top Header */}
      <div className="flex items-center space-x-3 mb-6">
        <button 
          onClick={() => navigate('/')} 
          className="p-2 bg-theme-secondary hover:bg-theme-primary-light rounded-full transition-all"
        >
          <ArrowLeft size={18} className="text-theme-primary" />
        </button>
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Hisnul Muslim</h2>
          <p className="text-xs text-theme-secondary">Dua & Azkar explorer with authentic references</p>
        </div>
      </div>

      {/* Category Card Grid */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-3 rounded-2xl border text-center cursor-pointer transition-all ${
                isActive 
                  ? 'bg-theme-primary text-white border-theme-primary shadow-md scale-95' 
                  : 'bg-theme-card border-theme-border hover:border-theme-primary'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-1.5 ${isActive ? 'bg-white/20 text-white' : 'bg-theme-primary-light text-theme-primary'}`}>
                <Icon size={16} />
              </div>
              <h4 className="font-extrabold text-[10px] truncate">{cat.name}</h4>
              <span className={`text-[9px] block opacity-80 ${isActive ? 'text-white' : 'text-theme-secondary'}`}>{cat.bn}</span>
            </div>
          );
        })}
      </div>

      {/* Search Box */}
      <div className="flex items-center bg-theme-card border border-theme-border rounded-2xl px-4 py-3 mb-6 shadow-sm">
        <Search size={18} className="text-theme-secondary mr-2" />
        <input 
          type="text" 
          placeholder="Search dua by title or translation..."
          value={duaSearch}
          onChange={(e) => setDuaSearch(e.target.value)}
          className="bg-transparent border-none outline-none text-sm w-full placeholder-theme-secondary text-theme-text"
        />
      </div>

      {/* Duas List */}
      <div className="space-y-4">
        {filteredDuas.map((dua) => (
          <div key={dua.id} className="bg-theme-card p-5 rounded-3xl border border-theme-border shadow-sm space-y-4">
            <div className="flex justify-between items-center text-[10px] text-theme-secondary">
              <span className="bg-theme-primary-light text-theme-primary px-2.5 py-1 rounded-lg font-bold">
                {dua.category}
              </span>
              <span>{dua.ref}</span>
            </div>
            
            <h4 className="font-extrabold text-sm text-theme-text">{dua.title} <span className="text-theme-secondary font-medium">({dua.bn_title})</span></h4>
            
            <p className="text-right text-2xl font-arabic leading-loose tracking-wide text-theme-text">
              {dua.ar}
            </p>

            <div className="space-y-2 border-t border-theme-border pt-3 text-xs leading-relaxed">
              <p className="text-theme-secondary italic">
                <strong className="text-theme-primary not-italic">Pronunciation:</strong> {dua.bn_trans}
              </p>
              <p className="text-theme-text">
                <strong>Bengali:</strong> {dua.bn_mean}
              </p>
              <p className="text-theme-secondary italic">
                <strong>English:</strong> {dua.en_mean}
              </p>
            </div>
          </div>
        ))}
        {filteredDuas.length === 0 && (
          <div className="text-center py-10 bg-theme-card border border-theme-border rounded-3xl">
            <p className="text-sm text-theme-secondary">No Duas found in this category.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default DuaPage;
