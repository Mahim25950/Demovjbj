import React, { useState, useEffect } from 'react';
import { ManualConverter } from './components/ManualConverter';
import { AIConverter } from './components/AIConverter';
import { HistoryPanel } from './components/HistoryPanel';
import { ConversionResult, UnitCategory } from './types';
import { ArrowRightLeft, Sparkles, Github } from 'lucide-react';

function App() {
  const [mode, setMode] = useState<'manual' | 'ai'>('manual');
  const [history, setHistory] = useState<ConversionResult[]>([]);

  // Determine if API key is available
  const isAiAvailable = typeof process !== 'undefined' && process.env && process.env.API_KEY;

  const handleConversion = (result: ConversionResult) => {
    setHistory(prev => {
      // Prevent duplicates at top of stack
      if (prev.length > 0) {
        const last = prev[0];
        if (last.fromValue === result.fromValue && 
            last.fromUnit === result.fromUnit && 
            last.toUnit === result.toUnit) {
          return prev;
        }
      }
      return [result, ...prev].slice(0, 10);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <ArrowRightLeft className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              OmniConvert <span className="text-indigo-600">AI</span>
            </h1>
          </div>
          
          {/* Mode Switcher (Desktop) */}
          <nav className="hidden sm:flex space-x-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setMode('manual')}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                mode === 'manual' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Standard
            </button>
            {isAiAvailable && (
              <button
                onClick={() => setMode('ai')}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all flex items-center space-x-1.5 ${
                  mode === 'ai' 
                    ? 'bg-white text-purple-600 shadow-sm' 
                    : 'text-slate-500 hover:text-purple-600'
                }`}
              >
                <Sparkles size={14} />
                <span>AI Magic</span>
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Mobile Mode Switcher */}
        <div className="sm:hidden flex space-x-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
             <button
              onClick={() => setMode('manual')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                mode === 'manual' 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Standard
            </button>
            {isAiAvailable && (
              <button
                onClick={() => setMode('ai')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                  mode === 'ai' 
                    ? 'bg-purple-50 text-purple-700 shadow-sm border border-purple-100' 
                    : 'text-slate-500 hover:text-purple-600'
                }`}
              >
                <Sparkles size={14} />
                <span>AI Magic</span>
              </button>
            )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Converter Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className={`transition-opacity duration-300 ${mode === 'manual' ? 'opacity-100' : 'hidden'}`}>
              <ManualConverter onConvert={handleConversion} />
            </div>
            
            {isAiAvailable && (
              <div className={`transition-opacity duration-300 ${mode === 'ai' ? 'opacity-100' : 'hidden'}`}>
                <AIConverter onConvert={handleConversion} />
              </div>
            )}
          </div>

          {/* History Sidebar */}
          <div className="lg:col-span-1">
            <HistoryPanel history={history} onClear={() => setHistory([])} />
            
            {/* Info / Footer */}
            <div className="mt-8 p-4 rounded-xl bg-slate-100 border border-slate-200">
                <h4 className="font-semibold text-sm text-slate-700 mb-2">About OmniConvert</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                    Use Standard mode for precise, instant conversions across {Object.keys(UnitCategory).length} categories. 
                    Switch to AI Magic mode to ask questions like "How many electrons in a coulomb?" or handle mixed units.
                </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;