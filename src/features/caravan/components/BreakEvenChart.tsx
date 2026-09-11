import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { CaravanData, CaravanCalculationResult } from '../types';
import { calculateCaravan } from '../../../calculations/calculationEngine';

interface Props {
  caravan: CaravanData;
  result: CaravanCalculationResult;
}

export const BreakEvenChart: React.FC<Props> = ({ caravan, result }) => {
  const data = useMemo(() => {
    const fixedSalePrice = Number(result.valorVendaIndividual);
    if (!fixedSalePrice || fixedSalePrice <= 0) return [];

    const minPax = Math.max(1, Math.floor(Number(caravan.travelerQuantity) * 0.5));
    const maxPax = Math.ceil(Number(caravan.travelerQuantity) * 1.5);
    
    const chartData = [];
    for (let i = minPax; i <= maxPax; i++) {
      // Calculate costs for i travelers
      const testCaravan = { ...caravan, travelerQuantity: i.toString() };
      const testResult = calculateCaravan(testCaravan);
      
      const totalRevenue = fixedSalePrice * i;
      const totalCost = Number(testResult.totalOperacaoCaravana); // Including internal costs and everything
      const profit = totalRevenue - totalCost;

      chartData.push({
        pax: i,
        lucro: Math.round(profit),
        receita: Math.round(totalRevenue),
        custo: Math.round(totalCost)
      });
    }
    return chartData;
  }, [caravan, result]);

  if (data.length === 0) return null;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const lucro = payload[0].value;
      const isPrejuizo = lucro < 0;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-sm z-50">
          <p className="text-slate-300 mb-1">{label} Pagantes</p>
          <p className={`font-bold ${isPrejuizo ? 'text-red-400' : 'text-emerald-400'}`}>
            {isPrejuizo ? 'Prejuízo: ' : 'Lucro: '} R$ {Math.abs(lucro).toLocaleString('pt-BR')}
          </p>
        </div>
      );
    }
    return null;
  };

  // To make the area chart two-colored based on 0, we can use a gradient with a dynamic offset
  const maxLucro = Math.max(...data.map(d => d.lucro));
  const minLucro = Math.min(...data.map(d => d.lucro));
  const totalRange = maxLucro - minLucro;
  // If min is positive, offset is 0. If max is negative, offset is 1. Else ratio.
  const zeroOffset = totalRange === 0 ? 0 : (maxLucro <= 0 ? 1 : (minLucro >= 0 ? 0 : maxLucro / totalRange));

  return (
    <div className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-blue-500/20 rounded-2xl shadow-2xl p-6 mt-6">
      <h2 className="text-sm font-bold text-slate-300 mb-2 flex items-center space-x-2">
        <span className="w-1.5 h-4 bg-emerald-500 rounded-full"></span>
        <span>Análise de Ponto de Equilíbrio (Break-Even)</span>
      </h2>
      <p className="text-xs text-slate-400 mb-6">Projeção de lucro baseada no preço de venda atual (R$ {Number(result.valorVendaIndividual).toLocaleString('pt-BR', { minimumFractionDigits: 2 })})</p>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset={zeroOffset} stopColor="#10b981" stopOpacity={0.3} />
                <stop offset={zeroOffset} stopColor="#ef4444" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="pax" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${(value/1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#64748b" strokeDasharray="3 3" />
            <ReferenceLine x={Number(caravan.travelerQuantity)} stroke="#3b82f6" strokeDasharray="3 3" label={{ position: 'top', value: 'Meta', fill: '#93c5fd', fontSize: 10 }} />
            <Area type="monotone" dataKey="lucro" stroke="#94a3b8" fill="url(#splitColor)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
