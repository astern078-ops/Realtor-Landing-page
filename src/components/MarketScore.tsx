import React from 'react';
import { Flame } from 'lucide-react';

interface MarketScoreProps {
  score: number;
  status: string;
  inventory: string;
}

export const MarketScore: React.FC<MarketScoreProps> = ({ score, status, inventory }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xs font-bold text-blue-500 uppercase tracking-[0.2em] mb-1">Market Heat Score</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-slate-900">{score}/100</span>
          </div>
          <p className="text-sm text-slate-500 mt-2 flex items-center">
            <span className="w-2 h-2 rounded-full bg-orange-500 mr-2"></span>
            {status} • {inventory}
          </p>
        </div>
        <div className="relative w-24 h-24">
          <div 
            className="circular-progress w-full h-full rounded-full flex items-center justify-center"
            style={{ 
              background: `radial-gradient(closest-side, transparent 79%, transparent 80% 100%), conic-gradient(#3b82f6 ${score}%, #334155 0)` 
            }}
          >
            <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center">
              <Flame className="text-blue-500 w-8 h-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
