import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PropertyHeader } from './components/PropertyHeader';
import { MarketScore } from './components/MarketScore';
import { PriceHistory } from './components/PriceHistory';
import { NeighborhoodTrends } from './components/NeighborhoodTrends';
import { MarketInsight } from './components/MarketInsight';
import { PropertyData } from './types';
import { fetchPropertyData } from './services/geminiService';
import { Loader2 } from 'lucide-react';

const INITIAL_DATA: PropertyData = {
  price: "$1,245,000",
  address: "2480 Broadway St, San Francisco, CA 94115",
  beds: 3,
  baths: 2.5,
  sqft: "2,150",
  imageUrl: "ZILLOW_LINK_ONLY",
  listingUrl: "https://www.zillow.com/homedetails/2480-Broadway-St-San-Francisco-CA-94115/15081825_zpid/",
  marketHeatScore: 88,
  marketStatus: "Very Hot Market",
  inventoryStatus: "Low Inventory",
  priceHistory: [
    { month: 'JAN', height: 'h-24', active: false },
    { month: 'MAR', height: 'h-32', active: false },
    { month: 'MAY', height: 'h-20', active: false },
    { month: 'JUL', height: 'h-40', active: false },
    { month: 'SEP', height: 'h-36', active: false },
    { month: 'NOV', height: 'h-48', active: false },
    { month: 'NOW', height: 'h-56', active: true },
  ],
  trends: {
    daysOnMarket: { value: "12 Days", change: "-4.2% YoY", trend: 'down' },
    saleVsList: { value: "104.5%", change: "+2.1% YoY", trend: 'up' },
    medianRent: { value: "$4,850", change: "+5.4% YoY", trend: 'up' },
    propertyTax: { value: "$14,200", change: "Stable", trend: 'stable' },
  },
  insight: "The Pacific Heights area is currently seeing a surge in demand for modern architecture like this property. Properties in this tier are selling 15% faster than the city average."
};

export default function App() {
  const [propertyData, setPropertyData] = useState<PropertyData>(INITIAL_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchPropertyData(query);
      setPropertyData(data);
    } catch (err: any) {
      console.error("Search error:", err);
      const isQuotaError = err?.message?.includes('429') || err?.message?.includes('RESOURCE_EXHAUSTED');
      if (isQuotaError) {
        setError("The market analysis tool is currently at peak capacity. Please wait a moment and try your search again.");
      } else {
        setError("Failed to fetch property data. Please ensure the address is correct and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar onSearch={handleSearch} isLoading={isLoading} zillowUrl={propertyData.listingUrl} />
      
      <main className="max-w-7xl mx-auto px-6 py-8 relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-2xl">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              <p className="text-slate-600 font-medium">Analyzing market data...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-center">
            {error}
          </div>
        )}

        <PropertyHeader data={propertyData} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <MarketScore 
              score={propertyData.marketHeatScore} 
              status={propertyData.marketStatus} 
              inventory={propertyData.inventoryStatus} 
            />
            <PriceHistory data={propertyData.priceHistory} />
          </div>
          
          <div>
            <NeighborhoodTrends trends={propertyData.trends} />
            <MarketInsight insight={propertyData.insight} />
          </div>
        </div>
        
        <footer className="mt-16 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm">
          <p>© 2024 MarketView Real Estate Analytics. All data updated 15 minutes ago.</p>
        </footer>
      </main>
    </div>
  );
}
