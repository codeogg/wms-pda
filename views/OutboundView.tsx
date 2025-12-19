
import React, { useState, useMemo } from 'react';
import { OutboundOrder, PalletStock, SKUItem } from '../types';
import { MOCK_OUTBOUND_ORDERS, MOCK_PALLET_STOCK } from '../constants';

interface OutboundViewProps {
  onBack: () => void;
}

type ViewStep = 'list' | 'detail' | 'analyzing' | 'suggestion' | 'queue';

const OutboundView: React.FC<OutboundViewProps> = ({ onBack }) => {
  const [step, setStep] = useState<ViewStep>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OutboundOrder | null>(null);
  const [suggestedPallets, setSuggestedPallets] = useState<PalletStock[]>([]);
  const [shippingQueue, setShippingQueue] = useState<PalletStock[]>([]);

  // Filtering orders
  const filteredOrders = useMemo(() => {
    return MOCK_OUTBOUND_ORDERS.filter(o => 
      o.orderNo.toLowerCase().includes(searchQuery.toLowerCase()) || 
      o.customer.includes(searchQuery)
    );
  }, [searchQuery]);

  const handleStartOutbound = () => {
    if (!selectedOrder) return;
    setStep('analyzing');
    
    // Simulate algorithm analysis
    setTimeout(() => {
      const match: PalletStock[] = [];
      selectedOrder.items.forEach(item => {
        // Simple mock matching algorithm
        const found = MOCK_PALLET_STOCK.filter(p => p.items.some(pi => pi.sku === item.sku));
        found.forEach(f => {
          if (!match.find(m => m.palletCode === f.palletCode)) {
            match.push(f);
          }
        });
      });
      setSuggestedPallets(match);
      setStep('suggestion');
    }, 1500);
  };

  const handleConfirmOutbound = () => {
    setShippingQueue([...shippingQueue, ...suggestedPallets]);
    setStep('queue');
  };

  const reset = () => {
    setStep('list');
    setSelectedOrder(null);
    setSuggestedPallets([]);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 border-b flex items-center gap-3 sticky top-0 z-10 shadow-sm">
        <button onClick={step === 'list' ? onBack : () => setStep('list')} className="text-gray-500 active:scale-95">
          <i className="fa-solid fa-chevron-left text-lg"></i>
        </button>
        <h2 className="font-bold flex-1 text-center truncate">
          {step === 'list' && "待作业作业单"}
          {step === 'detail' && (selectedOrder?.isRedDash ? "红冲明细" : "出库详情")}
          {step === 'analyzing' && "算法分析中"}
          {step === 'suggestion' && "系统推荐托盘"}
          {step === 'queue' && "待作业队列"}
        </h2>
        <div className="w-6"></div>
      </div>

      {step === 'list' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 bg-white border-b">
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type="text" 
                placeholder="搜索单号/客户..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-orange-500 transition-all outline-none"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-20 text-gray-400">暂无匹配单据</div>
            ) : (
              filteredOrders.map(order => (
                <div 
                  key={order.orderNo}
                  onClick={() => { setSelectedOrder(order); setStep('detail'); }}
                  className={`bg-white p-4 rounded-xl border shadow-sm active:opacity-75 transition-all ${
                    order.isRedDash ? 'border-red-200' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-bold ${order.isRedDash ? 'text-red-600' : 'text-orange-600'}`}>
                        {order.orderNo}
                      </span>
                      {order.isRedDash && (
                        <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.5 rounded-sm font-bold animate-pulse">红冲单</span>
                      )}
                    </div>
                    <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded font-medium text-gray-500 uppercase">{order.status}</span>
                  </div>
                  <div className="text-sm font-bold text-gray-800 mb-1">{order.customer}</div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-[10px] text-gray-400 flex gap-4">
                      <span><i className="fa-solid fa-box mr-1"></i>{order.items.length} 种 SKU</span>
                    </div>
                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded ${order.isRedDash ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                      {order.isRedDash ? "业务: 红冲入库 (退货回寄)" : "业务: 正常出库"}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {step === 'detail' && selectedOrder && (
        <div className="flex-1 flex flex-col">
          <div className={`p-4 mb-3 border-b ${selectedOrder.isRedDash ? 'bg-red-50 border-red-100' : 'bg-white'}`}>
            <h3 className={`text-xs font-bold uppercase tracking-widest mb-2 ${selectedOrder.isRedDash ? 'text-red-600' : 'text-gray-400'}`}>单据摘要</h3>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <span className="text-gray-500">单据号:</span><span className={`font-mono font-bold ${selectedOrder.isRedDash ? 'text-red-600' : ''}`}>{selectedOrder.orderNo}</span>
              <span className="text-gray-500">客户/供应商:</span><span className="font-bold">{selectedOrder.customer}</span>
              <span className="text-gray-500">类型:</span><span className={`font-bold ${selectedOrder.isRedDash ? 'text-red-600' : 'text-orange-600'}`}>{selectedOrder.isRedDash ? '红冲单' : '标准单'}</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-3 no-scrollbar">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">待作业明细</h3>
            {selectedOrder.items.map((item, idx) => (
              <div key={idx} className={`p-4 rounded-xl border shadow-sm flex justify-between items-center bg-white ${selectedOrder.isRedDash ? 'border-red-100' : 'border-gray-100'}`}>
                <div>
                  <div className="font-bold text-gray-800">{item.sku}</div>
                  <div className="text-xs text-gray-500">{item.name}</div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${selectedOrder.isRedDash ? 'text-red-600' : 'text-orange-600'}`}>{item.qty}</div>
                  <div className="text-[10px] text-gray-400 uppercase">REQUIRED</div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-white border-t sticky bottom-0">
            <button 
              onClick={handleStartOutbound}
              className={`w-full py-4 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-all ${
                selectedOrder.isRedDash ? 'bg-red-600 shadow-red-200' : 'bg-orange-600 shadow-orange-200'
              }`}
            >
              开始作业分析
            </button>
          </div>
        </div>
      )}

      {step === 'analyzing' && (
        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
          <div className="relative w-24 h-24 mb-6">
            <div className={`absolute inset-0 border-4 rounded-full ${selectedOrder?.isRedDash ? 'border-red-100' : 'border-orange-100'}`}></div>
            <div className={`absolute inset-0 border-4 rounded-full border-t-transparent animate-spin ${selectedOrder?.isRedDash ? 'border-red-600' : 'border-orange-500'}`}></div>
            <div className={`absolute inset-0 flex items-center justify-center ${selectedOrder?.isRedDash ? 'text-red-600' : 'text-orange-500'}`}>
              <i className="fa-solid fa-brain text-3xl"></i>
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">智能算法分析中...</h3>
          <p className="text-sm text-gray-500">正在为您匹配最优库位托盘，请稍候</p>
        </div>
      )}

      {step === 'suggestion' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className={`p-4 border-b ${selectedOrder?.isRedDash ? 'bg-red-50 border-red-100' : 'bg-orange-50 border-orange-100'}`}>
            <div className={`flex items-center gap-2 font-bold text-sm ${selectedOrder?.isRedDash ? 'text-red-700' : 'text-orange-700'}`}>
              <i className="fa-solid fa-wand-magic-sparkles"></i>
              <span>匹配完成：推荐下架 {suggestedPallets.length} 个托盘</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
            {suggestedPallets.map((pallet, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-gray-50 px-4 py-2 border-b flex justify-between items-center">
                  <span className="font-mono font-bold text-gray-700">{pallet.palletCode}</span>
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">{pallet.location}</span>
                </div>
                <div className="p-3 space-y-1">
                  {pallet.items.map((pi, pidx) => (
                    <div key={pidx} className="flex justify-between text-xs">
                      <span className="text-gray-600">{pi.sku}</span>
                      <span className="font-bold">x {pi.qty}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-white border-t flex gap-3">
            <button 
              onClick={() => setStep('detail')}
              className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold"
            >
              取消
            </button>
            <button 
              onClick={handleConfirmOutbound}
              className={`flex-[2] py-4 text-white rounded-xl font-bold shadow-lg active:scale-95 ${selectedOrder?.isRedDash ? 'bg-red-600 shadow-red-100' : 'bg-green-600 shadow-green-100'}`}
            >
              确认作业
            </button>
          </div>
        </div>
      )}

      {step === 'queue' && (
        <div className="flex-1 flex flex-col p-4">
          <div className={`${selectedOrder?.isRedDash ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} p-6 rounded-2xl flex flex-col items-center text-center mb-6`}>
            <i className="fa-solid fa-circle-check text-4xl mb-3"></i>
            <h3 className="font-bold text-lg">操作成功</h3>
            <p className="text-sm opacity-90">{selectedOrder?.isRedDash ? '已将红冲托盘加入待上架/返还队列' : '已将相关托盘加入待出货队列'}</p>
          </div>
          
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">当前作业队列</h3>
          <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar pb-24">
            {shippingQueue.map((p, idx) => (
              <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded flex items-center justify-center text-gray-400 ${selectedOrder?.isRedDash ? 'bg-red-50' : 'bg-gray-100'}`}>
                    <i className="fa-solid fa-pallet"></i>
                  </div>
                  <div>
                    <div className="font-mono font-bold text-sm">{p.palletCode}</div>
                    <div className="text-[10px] text-gray-400 uppercase">{selectedOrder?.isRedDash ? 'Wait for Correction' : 'Wait for Truck'}</div>
                  </div>
                </div>
                <div className={`text-xs font-bold px-3 py-1 rounded ${selectedOrder?.isRedDash ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                  {p.location}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 bg-white border-t absolute bottom-0 left-0 right-0">
            <button 
              onClick={reset}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold active:scale-95"
            >
              返回主列表
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutboundView;
