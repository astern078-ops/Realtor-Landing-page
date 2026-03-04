import { GoogleGenAI, Type } from "@google/genai";
import { PropertyData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const isQuotaError = error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED');
      
      if (isQuotaError && i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        console.warn(`Quota exceeded. Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export async function fetchPropertyData(query: string): Promise<PropertyData> {
  const executeRequest = async (model: string) => {
    const response = await ai.models.generateContent({
      model,
      contents: `You are an expert real estate data analyst. Your task is to retrieve property data and images with absolute precision.
      
      Search Zillow specifically for the residential property listing matching this query: "${query}". 
      
      MANDATORY: All property information MUST be consistent with the actual listing on Zillow for this specific address.
      1. Find the specific property on Zillow.com (even if it is "Off Market").
      2. Extract the EXACT price (or estimated value if off-market), address, beds, baths, and sqft as shown on Zillow.
      3. Provide the Zillow listing URL for the property.
      
      Identify the specific property and extract:
      - Exact price or estimated value
      - Exact street address, city, state, and zip
      - Verified beds/baths/sqft
      - The Zillow listing URL.
      - The source name (e.g., "Zillow").
      - The listing_id, parcel_id, and MLS_id if available.
      
      Additionally, provide current real-world market statistics for the area surrounding ${query}:
      - A realistic Market Heat Score (0-100).
      - Current Market Status (e.g., "Off Market", "Active", "Pending").
      - Inventory levels in that specific neighborhood.
      - A 12-month price history trend (7 points: JAN, MAR, MAY, JUL, SEP, NOW) with relative CSS height classes.
      - Real neighborhood trends: Avg Days on Market, Sale vs List %, Median Rent, and Property Tax estimates.
      - A detailed, professional Market Insight paragraph specifically about the neighborhood.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            price: { type: Type.STRING },
            address: { type: Type.STRING },
            beds: { type: Type.NUMBER },
            baths: { type: Type.NUMBER },
            sqft: { type: Type.STRING },
            imageUrl: { type: Type.STRING, description: "Set to 'ZILLOW_LINK_ONLY'" },
            listingUrl: { type: Type.STRING, description: "The Zillow listing URL for the property." },
            source: { type: Type.STRING },
            listingId: { type: Type.STRING },
            parcelId: { type: Type.STRING },
            mlsId: { type: Type.STRING },
            marketHeatScore: { type: Type.NUMBER },
            marketStatus: { type: Type.STRING },
            inventoryStatus: { type: Type.STRING },
            priceHistory: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  month: { type: Type.STRING },
                  height: { type: Type.STRING },
                  active: { type: Type.BOOLEAN }
                }
              }
            },
            trends: {
              type: Type.OBJECT,
              properties: {
                daysOnMarket: {
                  type: Type.OBJECT,
                  properties: {
                    value: { type: Type.STRING },
                    change: { type: Type.STRING },
                    trend: { type: Type.STRING, enum: ["up", "down", "stable"] }
                  }
                },
                saleVsList: {
                  type: Type.OBJECT,
                  properties: {
                    value: { type: Type.STRING },
                    change: { type: Type.STRING },
                    trend: { type: Type.STRING, enum: ["up", "down", "stable"] }
                  }
                },
                medianRent: {
                  type: Type.OBJECT,
                  properties: {
                    value: { type: Type.STRING },
                    change: { type: Type.STRING },
                    trend: { type: Type.STRING, enum: ["up", "down", "stable"] }
                  }
                },
                propertyTax: {
                  type: Type.OBJECT,
                  properties: {
                    value: { type: Type.STRING },
                    change: { type: Type.STRING },
                    trend: { type: Type.STRING, enum: ["up", "down", "stable"] }
                  }
                }
              }
            },
            insight: { type: Type.STRING }
          },
          required: ["price", "address", "beds", "baths", "sqft", "imageUrl", "marketHeatScore", "marketStatus", "inventoryStatus", "priceHistory", "trends", "insight", "source", "listingUrl"]
        }
      }
    });

    let jsonStr = response.text.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.replace(/^```json/, '').replace(/```$/, '');
    }
    return JSON.parse(jsonStr);
  };

  try {
    return await retryWithBackoff(() => executeRequest("gemini-3.1-pro-preview"));
  } catch (error: any) {
    const isQuotaError = error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED');
    if (isQuotaError) {
      console.warn("Pro model quota exhausted, falling back to Flash model...");
      return await retryWithBackoff(() => executeRequest("gemini-3-flash-preview"));
    }
    throw error;
  }
}
