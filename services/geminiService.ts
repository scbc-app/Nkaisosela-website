
import { GoogleGenAI, Type } from "@google/genai";
import { SheetRow } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  // Use gemini-3-pro-preview for complex reasoning tasks like data analysis
  async analyzeData(data: SheetRow[]) {
    const prompt = `
      Analyze the following inventory and supplier data for Nkaisosela Suppliers & General Dealers.
      Provide a summary of stock health, revenue potential, and inventory balance.
      Data: ${JSON.stringify(data.slice(0, 50))}
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              keyInsights: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              topMetrics: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    value: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      return null;
    }
  }

  // Multi-turn chat support with precise location context
  async chatWithData(query: string, data: SheetRow[], history: {role: string, text: string}[]) {
    const dataContext = JSON.stringify(data.slice(0, 30));
    const systemInstruction = `
      You are the official digital assistant for Nkaisosela Suppliers and General Dealers Ltd. 
      Help users with questions about inventory, pricing, company mission, or supply chain services.
      Company Context: Zambian-owned, registered under Act No. 10 of 2017. 
      Official Location: Chanika Lodge, Shop #3, Kapiri Mposhi, Zambia.
      Precise Coordinates: -13.967971, 28.677111.
      Inventory Context (First 30 items): ${dataContext}
      Be professional, helpful, and concise. If someone asks for directions, mention Kapiri Mposhi and provide the Chanika Lodge details.
    `;

    try {
      const filteredHistory = history.filter((m, i) => i > 0 || m.role === 'user');
      
      const contents = [
        ...filteredHistory.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        { role: 'user', parts: [{ text: query }] }
      ];

      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      return "I'm sorry, I encountered an error processing your request.";
    }
  }
}

export const geminiService = new GeminiService();
