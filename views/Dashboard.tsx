
import React from 'react';
import { AppMode } from '../types';

interface DashboardProps {
  onSelectMode: (mode: AppMode) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectMode }) => {
  return (
    <div className="p-4">
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6 border border-gray-100">
        <h2 className="text-sm text-gray-500 mb-1">当前工作站</h2>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-800">M 待入库暂存区</span>
          <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-medium">运行中</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => onSelectMode('packing')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 active:bg-gray-50 transition-colors"
        >
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl">
            <i className="fa-solid fa-box-open"></i>
          </div>
          <span className="font-bold text-gray-700 text-sm">打包作业</span>
        </button>

        <button 
          onClick={() => onSelectMode('inbound')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 active:bg-gray-50 transition-colors"
        >
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-xl">
            <i className="fa-solid fa-truck-ramp-box"></i>
          </div>
          <span className="font-bold text-gray-700 text-sm">收货入库</span>
        </button>

        <button 
          onClick={() => onSelectMode('outbound')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 active:bg-gray-50 transition-colors"
        >
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center text-xl">
            <i className="fa-solid fa-truck-fast"></i>
          </div>
          <span className="font-bold text-gray-700 text-sm">拣货出库</span>
        </button>

        <button 
          onClick={() => onSelectMode('monitor')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 active:bg-gray-50 transition-colors"
        >
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-xl">
            <i className="fa-solid fa-desktop"></i>
          </div>
          <span className="font-bold text-gray-700 text-sm">实时监控</span>
        </button>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-bold text-gray-600 mb-3 px-1">今日统计</h3>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y">
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-circle-check text-green-500"></i>
              <span className="text-sm">已完成打包</span>
            </div>
            <span className="font-bold">12 托</span>
          </div>
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-clock text-blue-500"></i>
              <span className="text-sm">待处理单据</span>
            </div>
            <span className="font-bold">4 份</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
