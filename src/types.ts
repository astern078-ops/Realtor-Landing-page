export interface PropertyData {
  price: string;
  address: string;
  beds: number;
  baths: number;
  sqft: string;
  imageUrl: string;
  listingUrl?: string;
  source?: string;
  listingId?: string;
  parcelId?: string;
  mlsId?: string;
  marketHeatScore: number;
  marketStatus: string;
  inventoryStatus: string;
  priceHistory: { month: string; height: string; active: boolean }[];
  trends: {
    daysOnMarket: { value: string; change: string; trend: 'up' | 'down' | 'stable' };
    saleVsList: { value: string; change: string; trend: 'up' | 'down' | 'stable' };
    medianRent: { value: string; change: string; trend: 'up' | 'down' | 'stable' };
    propertyTax: { value: string; change: string; trend: 'up' | 'down' | 'stable' };
  };
  insight: string;
}
