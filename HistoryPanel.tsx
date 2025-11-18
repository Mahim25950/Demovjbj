import React from 'react';
import { History, Trash2, Sparkles } from 'lucide-react';
import { ConversionResult } from '../types';

interface HistoryPanelProps {
  history: ConversionResult[];
  onClear: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onClear }) => {
  if (history.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 text-slate-800">
          <History size={20} className="text-slate-400" />
          <h3 className="font-semibold">History</h3>
        </div>
        <button 
          onClick={onClear}
          className="text-xs text-red-400 hover:text-red-600 flex items-center space-x-1 transition-colors"
        >
          <Trash2 size={14} />
          <span>Clear</span>
        </button>
      </div>

      <div className="space-y-3">
        {history.map((item, idx) => (
          <div key={item.timestamp + idx} className="group flex items-start justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline space-x-2 text-sm">
                <span className="font-medium text-slate-900 truncate">
                  {Number(item.fromValue).toLocaleString()} <span className="text-slate-500 text-xs">{item.fromUnit}</span>
                </span>
                <span className="text-slate-300 text-xs">→</span>
                <span className="font-bold text-indigo-600 truncate">
                  {Number(item.toValue).toLocaleString()} <span className="text-indigo-400 text-xs">{item.toUnit}</span>
                </span>
              </div>
              <div className="flex items-center mt-1 space-x-2">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider border border-slate-100 rounded px-1">
                    {item.category}
                  </span>
                  {item.isAiGenerated && (
                      <span className="flex items-center text-[10px] text-purple-400">
                          <Sparkles size={10} className="mr-1" /> AI
                      </span>
                  )}
              </div>
            </div>
            <div className="text-[10px] text-slate-300 whitespace-nowrap ml-4 mt-1">
              {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
