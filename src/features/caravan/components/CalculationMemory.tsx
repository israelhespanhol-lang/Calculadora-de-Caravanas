import React from 'react';
import type { CalculationMemoryItem } from '../types';

interface Props {
  memory: CalculationMemoryItem[];
  onClose: () => void;
}

export const CalculationMemory: React.FC<Props> = ({ memory, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900/90 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden relative">
        
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900/80 backdrop-blur-xl z-10">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
            <span>Memória de Cálculo Completa</span>
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-2xl leading-none">&times;</button>
        </div>

        <div className="p-0 overflow-y-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-blue-900/80 backdrop-blur-md text-blue-100 sticky top-0 border-b border-blue-500/20">
              <tr>
                <th className="p-4 text-sm font-semibold tracking-wide">Etapa / Descrição</th>
                <th className="p-4 text-sm font-semibold tracking-wide">Fórmula Aplicada</th>
                <th className="p-4 text-sm font-semibold tracking-wide">Valores Utilizados</th>
                <th className="p-4 text-sm font-semibold tracking-wide text-right">Resultado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-slate-800/20">
              {memory.map((item, index) => (
                <tr key={index} className="hover:bg-white/5 transition-colors duration-300">
                  <td className="p-4 text-sm font-medium text-slate-200">{item.description}</td>
                  <td className="p-4 text-xs text-blue-300 font-mono bg-slate-900/50">{item.formula}</td>
                  <td className="p-4 text-xs text-slate-400">{item.valueUsed}</td>
                  <td className="p-4 text-sm font-bold text-blue-400 text-right">{item.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-white/10 bg-slate-900/50 flex justify-end">
          <button onClick={onClose} className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-0.5 transition-all font-bold">Fechar Memória</button>
        </div>
      </div>
    </div>
  );
};
