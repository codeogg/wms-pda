
import React, { useState, useRef, useEffect } from 'react';

interface InboundViewProps {
  onBack: () => void;
}

const InboundView: React.FC<InboundViewProps> = ({ onBack }) => {
  const [palletCode, setPalletCode] = useState('');
  const [portCode, setPortCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'success'>('idle');
  const [error, setError] = useState('');

  const palletInputRef = useRef<HTMLInputElement>(null);
  const portInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (palletInputRef.current) palletInputRef.current.focus();
  }, []);

  const handleConfirm = () => {
    if (!palletCode.trim()) {
      setError('请扫描或输入托盘码');
      palletInputRef.current?.focus();
      return;
    }
    if (!portCode.trim()) {
      setError('请扫描或输入接驳口码');
      portInputRef.current?.focus();
      return;
    }

    // Simulate API Call
    setError('');
    setStatus('success');
    
    // Auto reset after 2 seconds to allow continuous operation
    setTimeout(() => {
      setPalletCode('');
      setPortCode('');
      setStatus('idle');
      palletInputRef.current?.focus();
    }, 2000);
  };

  if (status === 'success') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-emerald-50 text-center animate-pulse">
        <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center text-5xl mb-6 shadow-lg">
          <i className="fa-solid fa-check"></i>
        </div>
        <h2 className="text-2xl font-bold text-emerald-800 mb-2">入库成功</h2>
        <p className="text-emerald-600">托盘 {palletCode} 已送往 {portCode}</p>
        <p className="mt-8 text-xs text-emerald-400">系统正在准备下一次扫描...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 border-b flex items-center gap-3 sticky top-0 z-10 shadow-sm">
        <button onClick={onBack} className="text-gray-500 active:scale-95">
          <i className="fa-solid fa-chevron-left text-lg"></i>
        </button>
        <h2 className="font-bold flex-1 text-center">收货入库 (接驳口)</h2>
        <div className="w-6"></div>
      </div>

      <div className="p-6 space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-inner">
            <i className="fa-solid fa-truck-ramp-box"></i>
          </div>
          <h3 className="font-bold text-gray-800">托盘入库接驳</h3>
          <p className="text-xs text-gray-400 mt-1">请依次扫描托盘上的二维码和对应接驳口的标签</p>
        </div>

        <div className="space-y-6">
          {/* Pallet Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase px-1 tracking-widest flex justify-between">
              <span>托盘编码</span>
              {palletCode && <i className="fa-solid fa-circle-check text-emerald-500"></i>}
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                <i className="fa-solid fa-pallet"></i>
              </div>
              <input
                ref={palletInputRef}
                type="text"
                value={palletCode}
                onChange={(e) => setPalletCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && portInputRef.current?.focus()}
                placeholder="扫描托盘条码..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-mono"
              />
            </div>
          </div>

          {/* Port Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase px-1 tracking-widest flex justify-between">
              <span>接驳口编码</span>
              {portCode && <i className="fa-solid fa-circle-check text-emerald-500"></i>}
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                <i className="fa-solid fa-door-open"></i>
              </div>
              <input
                ref={portInputRef}
                type="text"
                value={portCode}
                onChange={(e) => setPortCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                placeholder="扫描接驳口条码..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-mono"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 p-3 rounded-lg border border-red-100 animate-shake">
              <i className="fa-solid fa-circle-exclamation"></i>
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-white border-t mt-auto shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
        <button
          onClick={handleConfirm}
          className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg"
        >
          <i className="fa-solid fa-cloud-arrow-up"></i>
          确认入库
        </button>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 2;
        }
      `}</style>
    </div>
  );
};

export default InboundView;
