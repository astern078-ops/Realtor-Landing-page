import React from 'react';
import { Sparkles } from 'lucide-react';

interface MarketInsightProps {
  insight: string;
}

export const MarketInsight: React.FC<MarketInsightProps> = ({ insight }) => {
  return (
    <div className="mt-8 bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <Sparkles className="text-blue-500 w-5 h-5" />
        </div>
        <h4 className="font-bold text-blue-600">Market Insight</h4>
      </div>
      <p className="text-sm leading-relaxed text-slate-600">
        {insight}
      </p>
    </div>
  );
};
