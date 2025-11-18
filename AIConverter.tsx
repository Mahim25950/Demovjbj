import React, { useState } from 'react';
import { Sparkles, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { convertWithAI } from '../services/geminiService';
import { AIConversionResponse, ConversionResult } from '../types';

interface AIConverterProps {
  onConvert: (result: ConversionResult) => void;
}

export const AIConverter: React.FC<AIConverterProps> = ({ onConvert }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIConversionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await convertWithAI(query);
      setResult(data);
      
      // Save to history
      if (data.sourceUnit !== 'Error') {
        onConvert({
          fromValue: data.sourceValue.toString(),
          fromUnit: data.sourceUnit,
          toValue: data.targetValue.toString(),
          toUnit: data.targetUnit,
          category: data.category || 'AI Custom',
          explanation: data.explanation,
          isAiGenerated: true,
          timestamp: Date.now()
        });
      }
    } catch (err) {
      setError("Failed to process conversion. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex items-center space-x-2 mb-4 text-purple-600">
          <Sparkles size={20} />
          <span className="font-semibold text-sm uppercase tracking-wider">AI Magic Mode</span>
        </div>

        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          Ask anything naturally
        </h3>
        <p className="text-slate-500 mb-6 text-sm">
          "Convert 5 light years to parsecs", "How many teaspoons in a swimming pool?", or "300 Kelvin to Fahrenheit"
        </p>

        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe your conversion..."
            className="w-full pl-4 pr-14 py-4 bg-white border-2 border-purple-100 rounded-xl text-lg text-slate-800 placeholder-slate-300 focus:border-purple-500 focus:ring-0 focus:outline-none transition-all shadow-sm"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : <ArrowRight size={24} />}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl flex items-start space-x-3 text-sm">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-6 animate-fade-in-up">
            <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-xl p-6">
              <div className="flex flex-col md:flex-row md:items-baseline md:space-x-4 mb-4">
                <div className="text-3xl font-bold text-slate-800">
                  {result.targetValue.toLocaleString(undefined, { maximumFractionDigits: 6 })} 
                  <span className="text-lg font-medium text-purple-600 ml-1">{result.targetUnit}</span>
                </div>
                <div className="text-sm text-slate-400">
                  from {result.sourceValue} {result.sourceUnit}
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-white/60 rounded-lg border border-purple-100/50 backdrop-blur-sm">
                  <p className="text-xs font-semibold text-purple-400 uppercase mb-1">Explanation</p>
                  <p className="text-slate-700 text-sm leading-relaxed">{result.explanation}</p>
                </div>
                
                {result.formula && (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 font-mono text-xs text-slate-600">
                    <span className="font-bold text-slate-400 select-none mr-2">FORMULA:</span>
                    {result.formula}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
