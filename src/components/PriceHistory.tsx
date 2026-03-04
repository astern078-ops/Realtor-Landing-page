import React from 'react';

interface PriceHistoryProps {
  data: { month: string; height: string; active: boolean }[];
}

export const PriceHistory: React.FC<PriceHistoryProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-bold text-slate-900">Price History</h3>
        <div className="flex space-x-4 text-xs font-semibold">
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span className="text-slate-600">LIST</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded-full bg-slate-200"></span>
            <span className="text-slate-600">SALE</span>
          </div>
        </div>
      </div>
      <div className="relative h-64 flex items-end justify-between space-x-2 mt-4 px-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center group">
            <div className={`w-full rounded-t-lg ${item.active ? 'bg-blue-100 border-x border-t border-blue-200' : 'bg-slate-100'} ${item.height} relative overflow-hidden transition-all group-hover:bg-slate-200`}>
              {item.active && <div className="absolute inset-0 bg-blue-500 opacity-20"></div>}
              {index === 0 && <div className="absolute bottom-0 w-full bg-blue-500 h-2"></div>}
            </div>
            <span className={`text-[10px] font-bold mt-4 ${item.active ? 'text-blue-500' : 'text-slate-400'}`}>
              {item.month}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
