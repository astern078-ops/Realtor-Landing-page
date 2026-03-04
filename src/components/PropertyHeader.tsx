import React from 'react';
import { MapPin, Bed, Bath, Maximize, ExternalLink } from 'lucide-react';
import { PropertyData } from '../types';

interface PropertyHeaderProps {
  data: PropertyData;
}

export const PropertyHeader: React.FC<PropertyHeaderProps> = ({ data }) => {
  return (
    <section className="mb-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-4">
            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-100">
              {data.marketStatus || 'Active'}
            </span>
            {data.listingId && (
              <span className="text-slate-400 text-xs font-medium">
                MLS ID: {data.mlsId || data.listingId}
              </span>
            )}
          </div>
          <h1 className="text-5xl font-extrabold mb-2 tracking-tight text-slate-900">{data.price}</h1>
          <p className="text-xl text-slate-500 flex items-center">
            <MapPin className="mr-2 text-blue-500 w-5 h-5" />
            {data.address}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="grid grid-cols-3 gap-4 flex-1">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center min-w-[100px]">
              <div className="flex items-center justify-center space-x-2 text-blue-500 mb-1">
                <Bed className="w-5 h-5" />
                <span className="font-bold text-lg">{data.beds}</span>
              </div>
              <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Beds</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center min-w-[100px]">
              <div className="flex items-center justify-center space-x-2 text-blue-500 mb-1">
                <Bath className="w-5 h-5" />
                <span className="font-bold text-lg">{data.baths}</span>
              </div>
              <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Baths</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center min-w-[100px]">
              <div className="flex items-center justify-center space-x-2 text-blue-500 mb-1">
                <Maximize className="w-5 h-5" />
                <span className="font-bold text-lg">{data.sqft}</span>
              </div>
              <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Sqft</span>
            </div>
          </div>

          <a 
            href={data.listingUrl || `https://www.zillow.com/homes/${encodeURIComponent(data.address)}_rb/`}
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 bg-[#006aff] hover:bg-[#0055cc] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 group"
          >
            <ExternalLink className="w-5 h-5" />
            <span>View on Zillow</span>
          </a>
        </div>
      </div>
    </section>
  );
};
