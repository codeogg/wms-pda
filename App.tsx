
import React, { useState } from 'react';
import { AppMode } from './types';
import Dashboard from './views/Dashboard';
import PackingView from './views/PackingView';
import OutboundView from './views/OutboundView';
import MonitorView from './views/MonitorView';
import InboundView from './views/InboundView';
import LoginView from './views/LoginView';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');

  const handleLoginSuccess = (username: string) => {
    setCurrentUser(username);
    setIsLoggedIn(true);
    setMode('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser('');
    setMode('home');
  };

  if (!isLoggedIn) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  const renderContent = () => {
    switch (mode) {
      case 'home':
        return <Dashboard onSelectMode={setMode} />;
      case 'packing':
        return <PackingView onBack={() => setMode('home')} />;
      case 'inbound':
        return <InboundView onBack={() => setMode('home')} />;
      case 'outbound':
        return <OutboundView onBack={() => setMode('home')} />;
      case 'monitor':
        return <MonitorView onBack={() => setMode('home')} />;
      default:
        return <Dashboard onSelectMode={setMode} />;
    }
  };

  return (
    <div className="pda-container max-w-md mx-auto shadow-2xl border-x border-gray-200">
      {/* Header */}
      <header className="bg-blue-700 text-white p-4 flex justify-between items-center shadow-md shrink-0">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-warehouse text-xl"></i>
          <span className="font-bold tracking-wider uppercase text-sm">PDA 仓储管家</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] opacity-70 font-bold uppercase tracking-tighter">Operator</span>
            <span className="text-xs font-bold leading-none">{currentUser}</span>
          </div>
          <button onClick={handleLogout} className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center active:scale-90 transition-transform">
            <i className="fa-solid fa-power-off text-xs text-red-400"></i>
          </button>
        </div>
      </header>

      {/* Main Area */}
      <main className="flex-1 overflow-y-auto bg-gray-50 relative">
        {renderContent()}
      </main>

      {/* Bottom Nav - Monitor moved to far right */}
      <nav className="bg-white border-t border-gray-200 flex justify-around p-1 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)] shrink-0">
        <button 
          onClick={() => setMode('home')}
          className={`flex-1 flex flex-col items-center py-1 gap-0.5 ${mode === 'home' ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <i className="fa-solid fa-house text-base"></i>
          <span className="text-[9px] font-medium">首页</span>
        </button>
        <button 
          onClick={() => setMode('packing')}
          className={`flex-1 flex flex-col items-center py-1 gap-0.5 ${mode === 'packing' ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <i className="fa-solid fa-box-open text-base"></i>
          <span className="text-[9px] font-medium">打包</span>
        </button>
        <button 
          onClick={() => setMode('inbound')}
          className={`flex-1 flex flex-col items-center py-1 gap-0.5 ${mode === 'inbound' ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <i className="fa-solid fa-truck-ramp-box text-base"></i>
          <span className="text-[9px] font-medium">收货</span>
        </button>
        <button 
          onClick={() => setMode('outbound')}
          className={`flex-1 flex flex-col items-center py-1 gap-0.5 ${mode === 'outbound' ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <i className="fa-solid fa-file-export text-base"></i>
          <span className="text-[9px] font-medium">出库</span>
        </button>
        <button 
          onClick={() => setMode('monitor')}
          className={`flex-1 flex flex-col items-center py-1 gap-0.5 ${mode === 'monitor' ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <i className="fa-solid fa-desktop text-base"></i>
          <span className="text-[9px] font-medium">监控</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
