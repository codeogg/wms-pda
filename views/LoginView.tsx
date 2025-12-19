
import React, { useState, useRef, useEffect } from 'react';

interface LoginViewProps {
  onLoginSuccess: (username: string) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [isRfidScanning, setIsRfidScanning] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const accountRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    accountRef.current?.focus();
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');

    if (!account.trim()) {
      setError('请输入账号或工号');
      return;
    }
    if (!password.trim()) {
      setError('请输入密码');
      return;
    }

    // Simple mock validation: Any account works with '123456'
    if (password === '123456' || password === 'admin') {
      onLoginSuccess(account);
    } else {
      setError('账号或密码错误 (提示: 123456)');
    }
  };

  const simulateRfidScan = () => {
    setIsRfidScanning(true);
    setError('');
    
    // Simulate reading an RFID card
    setTimeout(() => {
      const mockEmployeeId = 'EMP-' + Math.floor(Math.random() * 9000 + 1000);
      setAccount(mockEmployeeId);
      setIsRfidScanning(false);
      // Feedback to user
      const msg = document.createElement('div');
      msg.innerText = 'RFID 已读取: ' + mockEmployeeId;
      msg.className = 'fixed top-10 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg z-[100] animate-bounce';
      document.body.appendChild(msg);
      setTimeout(() => msg.remove(), 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white p-8">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-4xl shadow-2xl shadow-blue-500/20 mb-4 border-2 border-blue-400/30">
            <i className="fa-solid fa-warehouse"></i>
          </div>
          <h1 className="text-2xl font-black tracking-tighter italic">WMS PRO <span className="text-blue-500">PDA</span></h1>
          <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest font-bold">智能化仓储作业终端</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">身份验证</label>
            <div className="relative group">
              <i className="fa-solid fa-user-gear absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors"></i>
              <input
                ref={accountRef}
                type="text"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="账号 / 工号"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-600 font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">安全密码</label>
            <div className="relative group">
              <i className="fa-solid fa-shield-halved absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors"></i>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-12 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-600 font-medium"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-xl flex items-center gap-2 animate-shake">
              <i className="fa-solid fa-circle-exclamation"></i>
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={simulateRfidScan}
              disabled={isRfidScanning}
              className={`py-4 rounded-2xl font-bold text-sm flex flex-col items-center justify-center gap-1 border-2 transition-all ${
                isRfidScanning 
                ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed' 
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-blue-500 active:scale-95'
              }`}
            >
              {isRfidScanning ? (
                <i className="fa-solid fa-spinner animate-spin text-lg"></i>
              ) : (
                <i className="fa-solid fa-id-card text-lg"></i>
              )}
              <span>RFID 识别</span>
            </button>
            
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-blue-900/20 active:scale-95 transition-all flex items-center justify-center gap-2 border-2 border-blue-400/20"
            >
              <i className="fa-solid fa-right-to-bracket"></i>
              登 录
            </button>
          </div>
        </form>

        <div className="mt-12 text-center">
          <p className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em]">Hardware Version: V2.4.0-PRO</p>
          <div className="mt-4 flex justify-center gap-6 text-slate-600 text-sm">
            <i className="fa-solid fa-wifi"></i>
            <i className="fa-solid fa-battery-full text-green-600/50"></i>
            <i className="fa-solid fa-bluetooth"></i>
          </div>
        </div>
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

export default LoginView;
