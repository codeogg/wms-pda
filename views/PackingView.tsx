
import React, { useState, useEffect, useRef } from 'react';
import { InboundOrder, InboundItem, PalletDetail, Pallet } from '../types';
import { MOCK_INBOUND_ORDERS, M_WAREHOUSE_ID } from '../constants';

interface PackingViewProps {
  onBack: () => void;
}

const PackingView: React.FC<PackingViewProps> = ({ onBack }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Select Order, 2: Scan Pallet, 3: Add Details
  const [inboundOrders, setInboundOrders] = useState<InboundOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<InboundOrder | null>(null);
  const [palletCode, setPalletCode] = useState<string>('');
  const [palletDetails, setPalletDetails] = useState<PalletDetail[]>([]);
  
  // Form State for new line item
  const [newItemSku, setNewItemSku] = useState<string>('');
  const [newItemQty, setNewItemQty] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Refs for auto-focusing inputs like a real PDA
  const palletInputRef = useRef<HTMLInputElement>(null);
  const qtyInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 1. Loading pending orders for M Warehouse (Includes normal and Red Dash)
    const filtered = MOCK_INBOUND_ORDERS.filter(o => o.warehouseId === M_WAREHOUSE_ID);
    setInboundOrders(filtered);
  }, []);

  useEffect(() => {
    if (step === 2 && palletInputRef.current) {
      palletInputRef.current.focus();
    }
  }, [step]);

  const handleSelectOrder = (order: InboundOrder) => {
    setSelectedOrder(order);
    setStep(2);
  };

  const handlePalletScan = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!palletCode.trim()) {
      setError('请输入或扫描托盘码');
      return;
    }
    setError(null);
    setStep(3);
  };

  const handleAddItem = () => {
    if (!selectedOrder) return;
    if (!newItemSku) {
      setError('请选择货号');
      return;
    }
    if (newItemQty <= 0) {
      setError('数量必须大于0');
      return;
    }

    const orderItem = selectedOrder.items.find(i => i.sku === newItemSku);
    if (!orderItem) {
      setError('货号不在入库单中');
      return;
    }

    // Validation: Packing qty <= total - already_packed (in this session or previously)
    const alreadyPackedInPallet = palletDetails
      .filter(d => d.sku === newItemSku)
      .reduce((sum, d) => sum + d.qty, 0);
    
    const availableToPack = orderItem.totalQty - orderItem.packedQty - alreadyPackedInPallet;

    if (newItemQty > availableToPack) {
      setError(`打包数量超出。最大可打包: ${availableToPack}`);
      return;
    }

    setPalletDetails([...palletDetails, { sku: newItemSku, qty: newItemQty }]);
    setNewItemSku('');
    setNewItemQty(0);
    setError(null);
  };

  const handleRemoveDetail = (index: number) => {
    const newList = [...palletDetails];
    newList.splice(index, 1);
    setPalletDetails(newList);
  };

  const handleSavePallet = () => {
    if (palletDetails.length === 0) {
      setError('请添加至少一项明细');
      return;
    }
    
    // Simulate API Call Success
    alert(`托盘 ${palletCode} 已成功打包保存！`);
    
    // Reset process
    setStep(1);
    setSelectedOrder(null);
    setPalletCode('');
    setPalletDetails([]);
    setNewItemSku('');
    setNewItemQty(0);
  };

  // Stepper UI
  const PackingStepper = () => (
    <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between sticky top-[53px] z-10 shadow-sm">
      <div className="flex-1 flex flex-col items-center gap-1">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
          {step > 1 ? <i className="fa-solid fa-check"></i> : "1"}
        </div>
        <span className={`text-[9px] font-bold ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>选择订单</span>
      </div>
      
      <div className={`h-0.5 flex-1 mx-2 transition-colors ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>

      <div className="flex-1 flex flex-col items-center gap-1">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'} ${step === 2 ? 'ring-4 ring-blue-100' : ''}`}>
          {step > 2 ? <i className="fa-solid fa-check"></i> : "2"}
        </div>
        <span className={`text-[9px] font-bold ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>扫描托盘</span>
      </div>

      <div className={`h-0.5 flex-1 mx-2 transition-colors ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>

      <div className="flex-1 flex flex-col items-center gap-1">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'} ${step === 3 ? 'ring-4 ring-blue-100' : ''}`}>
          3
        </div>
        <span className={`text-[9px] font-bold ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>打包明细</span>
      </div>
    </div>
  );

  const StepHeader = () => (
    <div className="flex items-center gap-2 p-4 bg-white border-b sticky top-0 z-10">
      <button onClick={onBack} className="text-gray-500 active:scale-95">
        <i className="fa-solid fa-chevron-left"></i>
      </button>
      <h2 className="font-bold flex-1 text-center">
        {step === 1 && "选择入库单"}
        {step === 2 && "扫描托盘"}
        {step === 3 && "新增托盘明细"}
      </h2>
      <div className="w-6"></div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <StepHeader />
      <PackingStepper />

      {step === 1 && (
        <div className="p-4 flex-1">
          <div className="mb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
            待处理作业 ({inboundOrders.length})
          </div>
          <div className="space-y-3">
            {inboundOrders.map(order => (
              <div 
                key={order.orderNo}
                onClick={() => handleSelectOrder(order)}
                className={`bg-white p-4 rounded-xl border shadow-sm transition-all active:opacity-70 cursor-pointer ${
                  order.isRedDash ? 'border-red-200' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`font-mono font-bold ${order.isRedDash ? 'text-red-600' : 'text-blue-700'}`}>
                      {order.orderNo}
                    </span>
                    {order.isRedDash && (
                      <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.5 rounded-sm font-bold animate-pulse">红冲单</span>
                    )}
                  </div>
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded uppercase">{order.status}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {order.isRedDash ? "业务类型: 红冲出库 (返库入库)" : "业务类型: 正常入库"}
                </div>
                <div className="text-[10px] text-gray-400 mt-1">
                  包含项目: {order.items.length} 种 | 总数: {order.items.reduce((s, i) => s + i.totalQty, 0)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 2 && selectedOrder && (
        <div className="p-6 flex-1 flex flex-col items-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-6 ${
            selectedOrder.isRedDash ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
          }`}>
            <i className="fa-solid fa-qrcode"></i>
          </div>
          <h3 className="text-lg font-bold mb-2">扫描托盘二维码</h3>
          <p className="text-sm text-gray-500 mb-8 text-center px-6">
            请将PDA对准托盘上的标签，或手动输入托盘编号。
          </p>
          
          <form onSubmit={handlePalletScan} className="w-full space-y-4">
            <div className="relative">
              <input
                ref={palletInputRef}
                type="text"
                value={palletCode}
                onChange={(e) => setPalletCode(e.target.value)}
                placeholder="托盘编码 (例如: PL-001)"
                className={`w-full p-4 pr-12 bg-white border rounded-xl outline-none transition-all ${
                  selectedOrder.isRedDash ? 'border-red-300 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                }`}
              />
              <button type="submit" className={selectedOrder.isRedDash ? 'absolute right-4 top-1/2 -translate-y-1/2 text-red-600' : 'absolute right-4 top-1/2 -translate-y-1/2 text-blue-600'}>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
            {error && <p className="text-red-500 text-xs text-center">{error}</p>}
            
            <div className="pt-4 space-y-2">
              <div className="text-xs text-gray-400 font-bold uppercase">当前单据信息</div>
              <div className={`bg-white p-3 rounded-lg border text-sm ${selectedOrder.isRedDash ? 'border-red-100 bg-red-50/30' : 'border-gray-200'}`}>
                <div className="flex justify-between border-b pb-2 mb-2">
                  <span className="text-gray-500">单号</span>
                  <span className={`font-bold ${selectedOrder.isRedDash ? 'text-red-600' : ''}`}>{selectedOrder.orderNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">类型</span>
                  <span className="font-bold">{selectedOrder.isRedDash ? '红冲作业' : '正常作业'}</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {step === 3 && selectedOrder && (
        <div className="flex flex-col h-full overflow-hidden">
          <div className={`p-4 border-b flex flex-col gap-2 ${selectedOrder.isRedDash ? 'bg-red-50 border-red-100' : 'bg-white'}`}>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">托盘: <span className="text-gray-800 font-bold">{palletCode}</span></span>
              <span className="text-gray-500">单号: <span className={`font-bold ${selectedOrder.isRedDash ? 'text-red-600' : 'text-gray-800'}`}>{selectedOrder.orderNo}</span></span>
            </div>
          </div>

          <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar pb-32">
            {/* Entry Form */}
            <div className={`p-4 rounded-xl border shadow-inner ${selectedOrder.isRedDash ? 'bg-red-100/50 border-red-200' : 'bg-blue-50 border-blue-100'}`}>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className={`text-[10px] font-bold uppercase ${selectedOrder.isRedDash ? 'text-red-600' : 'text-blue-600'}`}>货号选择</label>
                  <select 
                    value={newItemSku}
                    onChange={(e) => {
                      setNewItemSku(e.target.value);
                      setError(null);
                    }}
                    className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- 请选择货号 --</option>
                    {selectedOrder.items.map(item => {
                      const remain = item.totalQty - item.packedQty - (palletDetails.find(pd => pd.sku === item.sku)?.qty || 0);
                      return (
                        <option key={item.sku} value={item.sku} disabled={remain <= 0}>
                          {item.sku} - {item.name} (余: {remain})
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 flex flex-col gap-1">
                    <label className={`text-[10px] font-bold uppercase ${selectedOrder.isRedDash ? 'text-red-600' : 'text-blue-600'}`}>打包数量</label>
                    <input
                      ref={qtyInputRef}
                      type="number"
                      value={newItemQty || ''}
                      onChange={(e) => setNewItemQty(Number(e.target.value))}
                      placeholder="0"
                      className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <button 
                      onClick={handleAddItem}
                      className={`h-[46px] px-6 text-white rounded-lg font-bold shadow-lg active:scale-95 transition-colors ${selectedOrder.isRedDash ? 'bg-red-600' : 'bg-blue-600'}`}
                    >
                      <i className="fa-solid fa-plus"></i>
                    </button>
                  </div>
                </div>
                {error && <p className="text-red-500 text-[10px] font-medium">{error}</p>}
              </div>
            </div>

            {/* Added Items List */}
            <div className="space-y-3 pb-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase flex justify-between">
                <span>托盘明细 ({palletDetails.length})</span>
                <span>总件数: {palletDetails.reduce((s, i) => s + i.qty, 0)}</span>
              </h4>
              {palletDetails.length === 0 ? (
                <div className="text-center py-8 text-gray-400 italic text-sm">暂无明细，请先添加</div>
              ) : (
                palletDetails.map((detail, idx) => {
                  const info = selectedOrder.items.find(i => i.sku === detail.sku);
                  return (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-800">{detail.sku}</span>
                        <span className="text-[10px] text-gray-500">{info?.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`font-mono font-bold px-2 rounded ${selectedOrder.isRedDash ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>x {detail.qty}</span>
                        <button 
                          onClick={() => handleRemoveDetail(idx)}
                          className="text-red-400 p-1 active:scale-90"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Sticky Actions */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t flex gap-3 z-20 shadow-2xl">
            <button 
              onClick={() => {
                setStep(2);
                setPalletDetails([]);
                setError(null);
              }}
              className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold active:bg-gray-200"
            >
              重新扫描
            </button>
            <button 
              onClick={handleSavePallet}
              disabled={palletDetails.length === 0}
              className={`flex-[2] py-4 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-all ${
                palletDetails.length > 0 ? (selectedOrder.isRedDash ? 'bg-red-600 shadow-red-200' : 'bg-green-600 shadow-green-200') : 'bg-gray-300'
              }`}
            >
              <i className="fa-solid fa-floppy-disk mr-2"></i>
              完成并保存
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackingView;
