import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import IlmTab from './tabs/IlmTab';
import AmalTab from './tabs/AmalTab';
import ServiceTab from './tabs/ServiceTab';
import OtherTab from './tabs/OtherTab';
import { useThemeStore } from './store/themeStore';

function App() {
  const [activeTab, setActiveTab] = useState('ilm');
  const { initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  const renderTab = () => {
    switch (activeTab) {
      case 'ilm': return <IlmTab />;
      case 'amal': return <AmalTab />;
      case 'service': return <ServiceTab />;
      case 'other': return <OtherTab />;
      default: return <IlmTab />;
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto relative shadow-2xl bg-slate-50 dark:bg-slate-900 overflow-x-hidden">
      {/* Conditionally render header, only on Ilm and Amal maybe, but prompt says "Always visible on Home/Ilm Tab". We will show it on Ilm tab. */}
      {activeTab === 'ilm' && <Header />}
      
      {/* Main Content Area */}
      <main className="w-full">
        {renderTab()}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
