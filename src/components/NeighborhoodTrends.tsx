import React from 'react';
import { TrendingDown, TrendingUp, Minus, ArrowRight } from 'lucide-react';
import { PropertyData } from '../types';

interface TrendCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
}

const TrendCard: React.FC<TrendCardProps> = ({ title, value, change, trend }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-500/50 transition-all cursor-pointer">
      <h4 className="text-sm font-medium text-slate-500 mb-4">{title}</h4>
      <div className="flex flex-col">
        <span className="text-3xl font-extrabold mb-2 text-slate-900">{value}</span>
        <div className={`flex items-center font-bold text-sm ${
          trend === 'up' ? 'text-emerald-500' : 
          trend === 'down' ? 'text-emerald-500' : 
          'text-slate-400'
        }`}>
          {trend === 'up' && <TrendingUp className="w-4 h-4 mr-1" />}
          {trend === 'down' && <TrendingDown className="w-4 h-4 mr-1" />}
          {trend === 'stable' && <Minus className="w-4 h-4 mr-1" />}
          {change}
        </div>
      </div>
    </div>
  );
};

interface NeighborhoodTrendsProps {
  trends: PropertyData['trends'];
}

export const NeighborhoodTrends: React.FC<NeighborhoodTrendsProps> = ({ trends }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-slate-900">Neighborhood Trends</h3>
        <button className="text-sm font-semibold text-blue-500 flex items-center hover:underline">
          View Full Report
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TrendCard title="Avg. Days on Market" value={trends.daysOnMarket.value} change={trends.daysOnMarket.change} trend={trends.daysOnMarket.trend} />
        <TrendCard title="Sale vs List Price" value={trends.saleVsList.value} change={trends.saleVsList.change} trend={trends.saleVsList.trend} />
        <TrendCard title="Median Rent" value={trends.medianRent.value} change={trends.medianRent.change} trend={trends.medianRent.trend} />
        <TrendCard title="Property Tax Est." value={trends.propertyTax.value} change={trends.propertyTax.change} trend={trends.propertyTax.trend} />
      </div>
    </div>
  );
};
