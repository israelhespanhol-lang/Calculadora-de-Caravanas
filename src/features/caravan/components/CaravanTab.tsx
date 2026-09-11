import React from 'react';
import type { CaravanData, CaravanCalculationResult } from '../types';
import { formatCurrencyBRL } from '../../../utils/currency';

interface Props {
  caravan: CaravanData;
  updateCaravan: (field: keyof CaravanData, value: any) => void;
  calculationResult: CaravanCalculationResult;
}

export const CaravanTab: React.FC<Props> = ({ caravan, updateCaravan, calculationResult }) => {
  const updateTL = (field: keyof typeof caravan.tourLeaderCosts, value: string) => {
    updateCaravan('tourLeaderCosts', { ...caravan.tourLeaderCosts, [field]: value });
  };

  return (
    <div className="space-y-8 text-slate-200">

      <section className="bg-white/5 border border-white/10 rounded-xl p-5 shadow-inner">
        <label className="block text-sm font-bold text-blue-300 mb-2">Nome do Projeto</label>
        <input 
          type="text" 
          className="w-full rounded-lg bg-slate-800/80 border border-slate-600/50 text-white text-lg font-medium shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-500/50 p-3 transition-all duration-300 outline-none placeholder-slate-500"
          value={caravan.name}
          onChange={(e) => updateCaravan('name', e.target.value)}
          placeholder="Digite o nome do projeto (ex: Caravana Israel 2024)..."
        />
      </section>
      
      <section className="bg-slate-800/40 border border-blue-500/20 rounded-xl p-5 shadow-inner">
        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Custo da Operação (Importado)</h3>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <input 
              type="text" 
              className="w-full rounded-lg border-blue-600/30 bg-blue-900/30 text-blue-100 p-2.5 cursor-not-allowed font-bold text-lg shadow-inner outline-none"
              value={formatCurrencyBRL(calculationResult.custoOperacaoGrupoComRemessa)}
              disabled
            />
          </div>
          <div className="text-xs text-slate-400 max-w-sm">Valor importado automaticamente da aba "Custo da Operação". Inclui remessas cambiais.</div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold text-blue-300 mb-6 flex items-center space-x-2 border-b border-white/10 pb-3">
          <span className="w-1.5 h-5 bg-blue-400 rounded-full"></span>
          <span>Composição da Caravana</span>
        </h3>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          <div className="space-y-5 bg-white/5 p-6 rounded-2xl border border-white/5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Horas do Projeto da Caravana</label>
              <div className="flex items-center space-x-3">
                <input 
                  type="number" 
                  className="w-28 rounded-lg bg-blue-900/30 border border-blue-600/50 text-blue-100 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 p-2.5 transition-all duration-300 outline-none"
                  value={caravan.projectHours}
                  onChange={(e) => updateCaravan('projectHours', e.target.value)}
                />
                <span className="text-slate-400 text-sm font-medium">horas</span>
              </div>
            </div>

            <div className="pt-5 border-t border-white/10">
              <label className="block text-sm font-medium text-slate-300 mb-2">Designer (Valor Fixo R$)</label>
              <input 
                type="number" 
                step="0.01"
                className="w-full rounded-lg bg-slate-800/50 border border-slate-600/50 text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 p-2.5 transition-all duration-300 outline-none"
                value={caravan.designerFixed}
                onChange={(e) => updateCaravan('designerFixed', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Outros 2 (Valor Fixo R$)</label>
              <input 
                type="number" 
                step="0.01"
                className="w-full rounded-lg bg-slate-800/50 border border-slate-600/50 text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 p-2.5 transition-all duration-300 outline-none"
                value={caravan.otherFixed2}
                onChange={(e) => updateCaravan('otherFixed2', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Outros 3 (Valor Fixo R$)</label>
              <input 
                type="number" 
                step="0.01"
                className="w-full rounded-lg bg-slate-800/50 border border-slate-600/50 text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 p-2.5 transition-all duration-300 outline-none"
                value={caravan.otherFixed3}
                onChange={(e) => updateCaravan('otherFixed3', e.target.value)}
              />
            </div>
          </div>

          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-700/50 shadow-inner">
            <h4 className="font-bold text-slate-200 mb-5 flex items-center space-x-2">
              <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
              <span>Valores Calculados (Leitura)</span>
            </h4>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                <span className="text-slate-400">Custo Interno (Horas)</span>
                <span className="font-medium text-slate-200">{formatCurrencyBRL(calculationResult.custoInternoProjeto)}</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                <span className="text-slate-400">Imposto da Operação (Gross-up)</span>
                <span className="font-medium text-slate-200">{formatCurrencyBRL(calculationResult.valorImpostoOperacao)}</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                <span className="text-slate-400">Comissão Ultravel ({caravan.percentagesSnapshot.comissaoUltravel}%)</span>
                <span className="font-medium text-slate-200">{formatCurrencyBRL(calculationResult.comissaoUltravel)}</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                <span className="text-slate-400">Trader/Captador ({caravan.percentagesSnapshot.traderCaptador}%)</span>
                <span className="font-medium text-slate-200">{formatCurrencyBRL(calculationResult.traderCaptador)}</span>
              </div>
              <div className="pt-4 mt-2 border-t border-white/10 flex justify-between font-bold text-lg">
                <span className="text-blue-400">Total Operação</span>
                <span className="text-blue-300">{formatCurrencyBRL(calculationResult.totalOperacaoCaravana)}</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold text-blue-300 mb-6 flex items-center space-x-2 border-b border-white/10 pb-3">
          <span className="w-1.5 h-5 bg-blue-400 rounded-full"></span>
          <span>Tour Leader & Mentor</span>
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-white/10">
            <h4 className="font-bold text-blue-100 mb-4">Tour Leader</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Aéreo</label>
                <input type="number" className="w-full rounded-lg border-slate-600/50 bg-slate-800/50 text-white p-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all duration-300" value={caravan.tourLeaderCosts.aereo} onChange={(e) => updateTL('aereo', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Hotel</label>
                <input type="number" className="w-full rounded-lg border-slate-600/50 bg-slate-800/50 text-white p-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all duration-300" value={caravan.tourLeaderCosts.hotel} onChange={(e) => updateTL('hotel', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Seguro</label>
                <input type="number" className="w-full rounded-lg border-slate-600/50 bg-slate-800/50 text-white p-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all duration-300" value={caravan.tourLeaderCosts.seguro} onChange={(e) => updateTL('seguro', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Outros</label>
                <input type="number" className="w-full rounded-lg border-slate-600/50 bg-slate-800/50 text-white p-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all duration-300" value={caravan.tourLeaderCosts.outros} onChange={(e) => updateTL('outros', e.target.value)} />
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-white/10 flex justify-between items-center text-sm">
              <span className="text-slate-400">Custo Total + Imposto:</span>
              <span className="font-bold text-lg text-blue-300">{formatCurrencyBRL(calculationResult.tourLeaderComImposto)}</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-white/10 flex flex-col">
            <h4 className="font-bold text-blue-100 mb-4">Mentor</h4>
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Custo Líquido do Mentor</label>
              <input 
                type="number" 
                className="w-full rounded-lg border-blue-600/50 bg-blue-900/30 text-blue-100 p-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all duration-300" 
                value={caravan.mentorCost} 
                onChange={(e) => updateCaravan('mentorCost', e.target.value)} 
              />
            </div>
            <div className="mt-5 pt-4 border-t border-white/10 flex justify-between items-center text-sm">
              <span className="text-slate-400">Custo Total + Imposto:</span>
              <span className="font-bold text-lg text-blue-300">{formatCurrencyBRL(calculationResult.mentorComImposto)}</span>
            </div>
          </div>

        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold text-blue-300 mb-6 flex items-center space-x-2 border-b border-white/10 pb-3">
          <span className="w-1.5 h-5 bg-blue-400 rounded-full"></span>
          <span>Adicionais Líquidos (Por Pessoa)</span>
        </h3>
        <p className="text-sm text-slate-400 mb-4">
          Valores fixos cobrados diretamente do passageiro. Estes itens não sofrem nenhum repasse de impostos, taxas, lucros ou comissões. São adicionados 100% limpos ao final do valor individual.
        </p>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-white/10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Seguro Viagem</label>
              <input 
                type="number" 
                className="w-full rounded-lg border-slate-600/50 bg-slate-800/50 text-white p-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all duration-300" 
                value={caravan.finalNetCosts?.seguroViagem || '0'} 
                onChange={(e) => {
                  const val = e.target.value;
                  const newFinalNetCosts = { ...(caravan.finalNetCosts || { seguroViagem: '0', brinde: '0', aereo: '0', fee: '0' }), seguroViagem: val };
                  updateCaravan('finalNetCosts', newFinalNetCosts as any);
                }} 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Brinde</label>
              <input 
                type="number" 
                className="w-full rounded-lg border-slate-600/50 bg-slate-800/50 text-white p-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all duration-300" 
                value={caravan.finalNetCosts?.brinde || '0'} 
                onChange={(e) => {
                  const val = e.target.value;
                  const newFinalNetCosts = { ...(caravan.finalNetCosts || { seguroViagem: '0', brinde: '0', aereo: '0', fee: '0' }), brinde: val };
                  updateCaravan('finalNetCosts', newFinalNetCosts as any);
                }} 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Aéreo</label>
              <input 
                type="number" 
                className="w-full rounded-lg border-slate-600/50 bg-slate-800/50 text-white p-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all duration-300" 
                value={caravan.finalNetCosts?.aereo || '0'} 
                onChange={(e) => {
                  const val = e.target.value;
                  const newFinalNetCosts = { ...(caravan.finalNetCosts || { seguroViagem: '0', brinde: '0', aereo: '0', fee: '0' }), aereo: val };
                  updateCaravan('finalNetCosts', newFinalNetCosts as any);
                }} 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Fee</label>
              <input 
                type="number" 
                className="w-full rounded-lg border-slate-600/50 bg-slate-800/50 text-white p-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all duration-300" 
                value={caravan.finalNetCosts?.fee || '0'} 
                onChange={(e) => {
                  const val = e.target.value;
                  const newFinalNetCosts = { ...(caravan.finalNetCosts || { seguroViagem: '0', brinde: '0', aereo: '0', fee: '0' }), fee: val };
                  updateCaravan('finalNetCosts', newFinalNetCosts as any);
                }} 
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
