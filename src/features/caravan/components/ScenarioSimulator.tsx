import React from 'react';
import type { CaravanData, CaravanCalculationResult } from '../types';
import { calculateCaravan } from '../../../calculations/calculationEngine';
import { formatCurrencyBRL } from '../../../utils/currency';
import { TrendingUp, Users } from 'lucide-react';

interface Props {
  caravan: CaravanData;
  currentResult: CaravanCalculationResult;
}

export const ScenarioSimulator: React.FC<Props> = ({ caravan, currentResult }) => {
  const currentQuantity = Number(caravan.travelerQuantity) || 1;
  const scenarios = [-5, +5, +10];

  const renderScenario = (offset: number) => {
    const newQuantity = currentQuantity + offset;
    if (newQuantity <= 0) return null;

    // Duplica o objeto caravan e sobrepõe a quantidade
    const simulatedCaravan: CaravanData = {
      ...caravan,
      travelerQuantity: String(newQuantity)
    };

    const simulatedResult = calculateCaravan(simulatedCaravan);
    
    // Calcula o Lucro Total da Operação (Comissão Ultravel + Imposto Retido) 
    // Para simplificar, o "lucro" visto pela agência aqui pode ser a Comissão Ultravel + Trader
    // O sistema calcula Comissão Ultravel como lucro base.
    const currentProfit = Number(currentResult.comissaoUltravel);
    const simulatedProfit = Number(simulatedResult.comissaoUltravel);
    
    const profitDiff = simulatedProfit - currentProfit;
    const isPositive = profitDiff > 0;

    return (
      <div key={offset} className={`p-4 rounded-xl border ${isPositive ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-red-900/20 border-red-500/30'} flex flex-col gap-2`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-slate-300 font-bold">
            <Users size={16} className={isPositive ? "text-emerald-400" : "text-red-400"} />
            <span>{newQuantity} Passageiros</span>
          </div>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
            {offset > 0 ? `+${offset}` : offset} pessoas
          </span>
        </div>
        
        <div className="flex justify-between items-end mt-2">
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Preço Unitário Cai Para</p>
            <p className="text-lg font-black text-white">{formatCurrencyBRL(simulatedResult.valorVendaIndividual)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 mb-0.5">Variação no Lucro</p>
            <p className={`text-sm font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}{formatCurrencyBRL(profitDiff)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mt-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="text-purple-400" size={20} />
        <h3 className="font-bold text-white text-lg">Simulador de Cenários</h3>
      </div>
      <p className="text-sm text-slate-400 mb-4 leading-relaxed">
        Veja como o preço individual e o lucro da agência reagem se você vender mais (ou menos) assentos.
      </p>
      
      <div className="flex flex-col gap-4">
        {scenarios.map(offset => renderScenario(offset))}
      </div>
    </div>
  );
};
