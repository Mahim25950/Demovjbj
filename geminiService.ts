import { GoogleGenAI, Type } from "@google/genai";
import { AIConversionResponse } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const convertWithAI = async (query: string): Promise<AIConversionResponse> => {
  const ai = getClient();

  // Schema for strict JSON output
  const schema = {
    type: Type.OBJECT,
    properties: {
      sourceValue: { type: Type.NUMBER, description: "The numeric value extracted from the source." },
      sourceUnit: { type: Type.STRING, description: "The unit of the source value." },
      targetValue: { type: Type.NUMBER, description: "The calculated converted numeric value." },
      targetUnit: { type: Type.STRING, description: "The unit converted to." },
      category: { type: Type.STRING, description: "The category of the unit (e.g., Length, Mass, Custom)." },
      explanation: { type: Type.STRING, description: "A brief, friendly explanation of the conversion or context." },
      formula: { type: Type.STRING, description: "The mathematical formula used for this conversion (e.g. x * 2.2)." },
    },
    required: ["sourceValue", "sourceUnit", "targetValue", "targetUnit", "category", "explanation", "formula"],
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Convert the following units. If the request involves abstract or complex comparisons (like 'football fields' or 'blue whales'), provide the best estimate. 
      
      User Query: "${query}"
      
      If the query is invalid or not a conversion request, return 0 for values and 'Error' for units/explanation.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.1, // Keep it deterministic for math
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text) as AIConversionResponse;
    return data;

  } catch (error) {
    console.error("AI Conversion Error:", error);
    throw error;
  }
};
