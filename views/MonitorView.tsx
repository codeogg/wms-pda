
import React, { useState } from 'react';
import { DockPort, Cart, QueueTask } from '../types';
import { MOCK_DOCK_PORTS, MOCK_CARTS, INITIAL_QUEUE } from '../constants';

interface MonitorViewProps {
  onBack: () => void;
}

const MonitorView: React.FC<MonitorViewProps> = ({ onBack }) => {
  const [ports] = useState<DockPort[]>(MOCK_DOCK_PORTS);
  const [carts] = useState<Cart[]>(MOCK_CARTS);
  const [queue, setQueue] = useState<QueueTask[]>(INITIAL_QUEUE);
  
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnPallet, setReturnPallet] = useState('');
  const [returnPort, setReturnPort] = useState('');
  const [error, setError] = useState('');

  const handleAddReturn = () => {
    if (!returnPallet || !returnPort) {
      setError('请完整输入托盘码和接驳口码');
      return;
    }

    const newTask: QueueTask = {
      id: 'R' + Math.floor(Math.random() * 1000),
      type: 'return',
      palletCode: returnPallet,
      source: returnPort,
      target: 'STORAGE-AUTO',
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false })
    };

    // Insert at the FRONT of the queue as requested
    setQueue([newTask, ...queue]);
    
    // Close and reset
    setIsReturnModalOpen(false);
    setReturnPallet('');
    setReturnPort('');
    setError('');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <div className="bg-white p-4 border-b flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack} className="text-gray-500">
          <i className="fa-solid fa-chevron-left text-lg"></i>
        </button>
        <h2 className="font-bold flex-1 text-center">实时库内监控</h2>
        <div className="w-6"></div>
      </div>

      <div className="p-4 space-y-6 overflow-y-auto no-scrollbar pb-24">
        {/* Docking Ports Section */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <i className="fa-solid fa-door-open text-blue-500"></i>
              接驳口状态
            </h3>
            <span className="text-[10px] text-emerald-500 font-bold bg-emerald-50 px-2 py-0.5 rounded-full animate-pulse">LIVE</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {ports.map(port => (
              <div key={port.id} className={`p-3 rounded-xl border bg-white shadow-sm transition-all ${port.status === 'occupied' ? 'border-orange-200' : 'border-gray-100'}`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-gray-700">{port.name}</span>
                  <div className={`w-2 h-2 rounded-full ${port.status === 'occupied' ? 'bg-orange-500' : 'bg-emerald-500'}`}></div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className={`text-[10px] font-medium ${port.status === 'occupied' ? 'text-orange-600' : 'text-emerald-600'}`}>
                    {port.status === 'occupied' ? '占用中' : '空闲'}
                  </span>
                  {port.palletCode && (
                    <span className="text-[10px] font-mono text-gray-400 truncate">{port.palletCode}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Carts Status Section */}
        <section>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-3 px-1">
            <i className="fa-solid fa-robot text-purple-500"></i>
            小车实时状态 (AGV)
          </h3>
          <div className="bg-white rounded-xl border border-gray-100 divide-y shadow-sm">
            {carts.map(cart => (
              <div key={cart.id} className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                    cart.status === 'idle' ? 'bg-gray-100 text-gray-400' : 
                    cart.status === 'busy' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                  }`}>
                    <i className="fa-solid fa-truck-pickup"></i>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-800">{cart.id}</div>
                    <div className="text-[10px] text-gray-500">{cart.currentTask || '等待任务中...'}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase inline-block mb-1 ${
                    cart.status === 'idle' ? 'bg-gray-100 text-gray-500' : 
                    cart.status === 'busy' ? 'bg-blue-100 text-blue-700' : 
                    cart.status === 'charging' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {cart.status}
                  </div>
                  <div className="flex items-center gap-1 justify-end text-[10px] text-gray-400">
                    <i className={`fa-solid fa-battery-${cart.battery > 50 ? 'full' : cart.battery > 20 ? 'half' : 'quarter'} ${cart.battery < 20 ? 'text-red-500' : 'text-emerald-500'}`}></i>
                    {cart.battery}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Queue Section */}
        <section>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-3 px-1">
            <i className="fa-solid fa-layer-group text-orange-500"></i>
            待作业队列 (待出货/回库)
          </h3>
          <div className="space-y-2">
            {queue.map((task, index) => (
              <div key={task.id} className={`bg-white p-3 rounded-xl border flex items-center gap-3 shadow-sm transition-all ${task.type === 'return' ? 'border-l-4 border-l-red-500 border-gray-100 bg-red-50' : 'border-gray-100'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${task.type === 'return' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                  {task.type === 'return' ? <i className="fa-solid fa-rotate-left"></i> : <i className="fa-solid fa-truck-fast"></i>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-xs font-bold text-gray-800 truncate">{task.palletCode}</span>
                    <span className="text-[10px] text-gray-400">{task.timestamp}</span>
                  </div>
                  <div className="text-[10px] text-gray-500 flex items-center gap-1">
                    <span className="bg-gray-200 px-1 rounded">{task.source}</span>
                    <i className="fa-solid fa-arrow-right-long text-[8px] text-gray-300"></i>
                    <span className="bg-gray-200 px-1 rounded">{task.target}</span>
                  </div>
                </div>
                {index === 0 && <span className="text-[8px] font-bold text-white bg-red-500 px-1 rounded uppercase tracking-tighter">Priority</span>}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-white border-t sticky bottom-0 left-0 right-0 z-20 flex gap-3">
        <button 
          onClick={() => setIsReturnModalOpen(true)}
          className="w-full py-4 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-100 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-rotate-left"></i>
          回库操作
        </button>
      </div>

      {/* Return Modal */}
      {isReturnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800">回库申请</h3>
              <button onClick={() => setIsReturnModalOpen(false)} className="text-gray-400 p-1">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase px-1">扫码/输入 托盘码</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={returnPallet}
                    onChange={(e) => setReturnPallet(e.target.value)}
                    placeholder="例如: PL-B-105"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500 transition-all"
                  />
                  <i className="fa-solid fa-qrcode absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase px-1">扫码/输入 接驳口码</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={returnPort}
                    onChange={(e) => setReturnPort(e.target.value)}
                    placeholder="例如: PORT-01"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500 transition-all"
                  />
                  <i className="fa-solid fa-location-dot absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>
              </div>

              {error && <p className="text-red-500 text-xs text-center">{error}</p>}

              <div className="pt-2 flex gap-3">
                <button 
                  onClick={() => setIsReturnModalOpen(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm"
                >
                  取消
                </button>
                <button 
                  onClick={handleAddReturn}
                  className="flex-[2] py-3 bg-red-600 text-white rounded-xl font-bold text-sm shadow-md active:scale-95"
                >
                  确认回库 (优先)
                </button>
              </div>
              <p className="text-[10px] text-gray-400 text-center italic">确认后操作将插入待作业队列首位</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MonitorView;
