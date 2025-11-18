import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRightLeft, Copy, Check } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { UnitCategory, UnitDefinition, ConversionResult } from '../types';

interface ManualConverterProps {
  onConvert: (result: ConversionResult) => void;
}

export const ManualConverter: React.FC<ManualConverterProps> = ({ onConvert }) => {
  const [activeCategory, setActiveCategory] = useState<UnitCategory>(UnitCategory.LENGTH);
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnitId, setFromUnitId] = useState<string>('');
  const [toUnitId, setToUnitId] = useState<string>('');
  const [outputValue, setOutputValue] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const currentCategory = useMemo(() => 
    CATEGORIES.find(c => c.name === activeCategory) || CATEGORIES[0], 
  [activeCategory]);

  // Initialize default units when category changes
  useEffect(() => {
    if (currentCategory.units.length >= 2) {
      setFromUnitId(currentCategory.units[0].id);
      setToUnitId(currentCategory.units[1].id);
    } else if (currentCategory.units.length === 1) {
       setFromUnitId(currentCategory.units[0].id);
       setToUnitId(currentCategory.units[0].id);
    }
  }, [currentCategory]);

  // Perform conversion
  useEffect(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) {
      setOutputValue('---');
      return;
    }

    const fromUnit = currentCategory.units.find(u => u.id === fromUnitId);
    const toUnit = currentCategory.units.find(u => u.id === toUnitId);

    if (!fromUnit || !toUnit) return;

    let result = 0;

    // Special handling for Temperature
    if (activeCategory === UnitCategory.TEMPERATURE) {
      let valInCelsius = val;
      // Convert to Celsius first
      if (fromUnit.id === 'f') valInCelsius = (val - 32) * (5/9);
      else if (fromUnit.id === 'k') valInCelsius = val - 273.15;
      
      // Convert from Celsius to Target
      if (toUnit.id === 'c') result = valInCelsius;
      else if (toUnit.id === 'f') result = (valInCelsius * 9/5) + 32;
      else if (toUnit.id === 'k') result = valInCelsius + 273.15;
    } else {
      // Standard linear conversion
      // (Value * FromFactor) / ToFactor
      const baseValue = val * fromUnit.factor;
      result = baseValue / toUnit.factor;
    }

    // Clean formatting
    const formattedResult = Number.isInteger(result) 
      ? result.toString() 
      : parseFloat(result.toFixed(6)).toString(); // Remove trailing zeros after 6 decimals

    setOutputValue(formattedResult);

    // Only log valid conversions to history if user stops typing (debounce could be added here, but for simplicity we just pass it up when meaningful changes happen? 
    // Actually, let's not spam the history on every keystroke.
    // We will only trigger onConvert when the user leaves the field or clicks a button, maybe?
    // For now, we won't auto-add to history on every keystroke to avoid clutter. 
    // We'll assume the parent handles history only when explicitly asked, 
    // OR we could add a 'Save' button. Let's skip auto-history for manual to keep it simple for now.)

  }, [inputValue, fromUnitId, toUnitId, currentCategory, activeCategory]);


  const handleSwap = () => {
    setFromUnitId(toUnitId);
    setToUnitId(fromUnitId);
  };

  const handleCopy = () => {
    if (outputValue && outputValue !== '---') {
      navigator.clipboard.writeText(outputValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const triggerSave = () => {
     const fromUnit = currentCategory.units.find(u => u.id === fromUnitId);
     const toUnit = currentCategory.units.find(u => u.id === toUnitId);
     if(fromUnit && toUnit && outputValue !== '---') {
         onConvert({
             fromValue: inputValue,
             fromUnit: fromUnit.symbol,
             toValue: outputValue,
             toUnit: toUnit.symbol,
             category: activeCategory,
             timestamp: Date.now()
         })
     }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-fade-in">
      {/* Category Selector */}
      <div className="mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex space-x-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.name
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 items-center">
        {/* FROM Input */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">From</label>
          <div className="relative">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={triggerSave}
              className="block w-full px-4 py-3 text-2xl font-bold text-slate-800 bg-slate-50 border-transparent rounded-xl focus:border-indigo-500 focus:bg-white focus:ring-0 transition-colors"
              placeholder="0"
            />
          </div>
          <select
            value={fromUnitId}
            onChange={(e) => setFromUnitId(e.target.value)}
            className="block w-full mt-2 px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
          >
            {currentCategory.units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center md:pt-6">
          <button
            onClick={handleSwap}
            className="p-3 rounded-full bg-slate-100 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors shadow-sm"
            aria-label="Swap units"
          >
            <ArrowRightLeft size={20} />
          </button>
        </div>

        {/* TO Input */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">To</label>
          <div className="relative">
            <div className="block w-full px-4 py-3 text-2xl font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-xl min-h-[3.5rem] flex items-center justify-between group">
                <span className="truncate mr-2">{outputValue}</span>
                <button 
                    onClick={handleCopy}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400 hover:text-indigo-700 focus:opacity-100"
                >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
            </div>
          </div>
          <select
            value={toUnitId}
            onChange={(e) => setToUnitId(e.target.value)}
            className="block w-full mt-2 px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
          >
            {currentCategory.units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Visual Table / Quick Reference (Optional, showing commonly used values) */}
      <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-xs text-slate-400 font-medium mb-3 uppercase">Quick Reference</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
              {[1, 5, 10, 50, 100].map(val => {
                   // Simple mini calculation for the reference table
                   // We re-use logic roughly here or just skip if too complex. 
                   // Let's just render a static text for now as re-implementing logic inside render is messy.
                   return (
                       <div key={val} className="bg-slate-50 rounded p-2 text-xs text-slate-600">
                           <span className="font-bold text-slate-800">{val}</span> <br/> 
                           <span className="text-[10px] text-slate-400">BASE</span>
                       </div>
                   )
              })}
              <div className="bg-indigo-50 rounded p-2 text-xs text-indigo-600 flex items-center justify-center font-medium">
                  x {currentCategory.units.find(u => u.id === fromUnitId)?.factor}
              </div>
          </div>
      </div>
    </div>
  );
};
