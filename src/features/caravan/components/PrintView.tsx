import React from 'react';
import type { CaravanData, CaravanCalculationResult } from '../types';
import { formatCurrencyBRL } from '../../../utils/currency';
import { CheckCircle2, Calendar, Users, Globe, FileText } from 'lucide-react';

interface Props {
  caravan: CaravanData;
  result: CaravanCalculationResult;
  // Overrides para o modo Rascunho (Draft)
  draftName?: string;
  draftTravelerQuantity?: string;
  draftIndividualPrice?: string;
  draftTotalPrice?: string;
  draftObservations?: string;
  comparisonCaravan?: CaravanData;
  comparisonResult?: CaravanCalculationResult;
}

export const PrintView: React.FC<Props> = ({ 
  caravan, 
  result,
  draftName,
  draftTravelerQuantity,
  draftIndividualPrice,
  draftTotalPrice,
  draftObservations,
  comparisonCaravan,
  comparisonResult
}) => {
  const displayIndividual = draftIndividualPrice !== undefined ? draftIndividualPrice : result.valorVendaIndividual;
  const displayTotal = draftTotalPrice !== undefined ? draftTotalPrice : result.valorVendaCaravana;
  
  return (
    <div className="w-[794px] min-h-[1123px] bg-white text-slate-800 font-sans mx-auto relative flex flex-col">
      
      {/* Header Premium */}
      <div className="bg-[#0f172a] text-white p-10 flex justify-between items-center rounded-b-[2rem] shadow-lg z-10 relative">
        <div className="flex items-center gap-6">
          <div className="bg-white p-3 rounded-2xl shadow-inner">
            <img src="/logo.png" alt="Ultravel Logo" className="h-14 object-contain" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-[0.2em] text-blue-300 uppercase mb-1">Proposta Comercial</h1>
            <p className="text-2xl font-black tracking-tight">{draftName || caravan.name}</p>
          </div>
        </div>
        <div className="text-right flex flex-col gap-1 text-slate-300">
          <div className="flex items-center justify-end gap-2 text-sm">
            <Calendar size={16} className="text-blue-400" />
            <span>Data: <strong>{caravan.quoteDate}</strong></span>
          </div>
          <div className="flex items-center justify-end gap-2 text-sm">
            <Globe size={16} className="text-blue-400" />
            <span>Moeda: <strong>{caravan.currency}</strong> (R$ {caravan.exchangeRate})</span>
          </div>
        </div>
      </div>

      <div className="p-12 flex-1 flex flex-col">
        
        {/* Detalhes da Proposta */}
        {caravan.proposalDetails && (caravan.proposalDetails.duration || caravan.proposalDetails.hotels || caravan.proposalDetails.flights || caravan.proposalDetails.inclusions) && (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
              <h3 className="text-xl font-bold text-[#0f172a]">Detalhes da Viagem</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {caravan.proposalDetails.duration && (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 shadow-sm">
                  <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Duração / Período</h4>
                  <p className="text-sm text-slate-700 font-medium">{caravan.proposalDetails.duration}</p>
                </div>
              )}
              {caravan.proposalDetails.flights && (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 shadow-sm">
                  <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Opções de Voos</h4>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{caravan.proposalDetails.flights}</p>
                </div>
              )}
              {caravan.proposalDetails.hotels && (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 shadow-sm col-span-2">
                  <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Hotéis e Acomodações</h4>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{caravan.proposalDetails.hotels}</p>
                </div>
              )}
              {caravan.proposalDetails.inclusions && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 shadow-sm col-span-2">
                  <h4 className="text-xs uppercase tracking-widest text-emerald-600 font-bold mb-2">O que está Incluso</h4>
                  <p className="text-sm text-emerald-900 whitespace-pre-wrap leading-relaxed font-medium">{caravan.proposalDetails.inclusions}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Resumo da Operação */}
        <div className="mb-10 bg-slate-50 border border-slate-100 p-6 rounded-2xl shadow-sm flex items-start gap-4">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-xl shrink-0">
            <Users size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Dimensionamento do Grupo</h3>
            <p className="text-slate-600 leading-relaxed">
              Esta proposta foi estruturada e precificada exclusivamente para um grupo fechado de <strong>{draftTravelerQuantity || caravan.travelerQuantity} viajantes</strong>. Alterações no número de passageiros poderão impactar os valores finais.
            </p>
          </div>
        </div>

        {/* Investimento Cards */}
        {!comparisonCaravan ? (
          <div className="grid grid-cols-2 gap-8 mb-12">
            {/* Card Individual */}
            <div className="bg-white border-2 border-slate-100 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-cyan-500"></div>
              <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-6">Investimento Individual</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <p className="text-5xl font-black text-[#0f172a] tracking-tight">{formatCurrencyBRL(displayIndividual)}</p>
              </div>
              <p className="text-sm font-medium text-blue-600 bg-blue-50 inline-block px-3 py-1 rounded-full">Por passageiro</p>
            </div>
            
            {/* Card Total */}
            <div className="bg-white border-2 border-slate-100 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-slate-800 to-slate-600"></div>
              <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-6">Investimento Total do Grupo</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <p className="text-4xl font-bold text-slate-700 tracking-tight">{formatCurrencyBRL(displayTotal)}</p>
              </div>
              <p className="text-sm font-medium text-slate-500 bg-slate-100 inline-block px-3 py-1 rounded-full">Para {draftTravelerQuantity || caravan.travelerQuantity} passageiros</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 mb-12">
            {/* Pacote Principal */}
            <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-cyan-500"></div>
              <h3 className="text-sm font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">{draftName || caravan.name} (Opção 1)</h3>
              <div className="mb-6">
                <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Por Passageiro</h4>
                <p className="text-3xl font-black text-[#0f172a]">{formatCurrencyBRL(displayIndividual)}</p>
              </div>
              <div>
                <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Total do Grupo ({draftTravelerQuantity || caravan.travelerQuantity} pax)</h4>
                <p className="text-xl font-bold text-slate-600">{formatCurrencyBRL(displayTotal)}</p>
              </div>
            </div>

            {/* Pacote Secundário */}
            <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
              <h3 className="text-sm font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">{comparisonCaravan.name} (Opção 2)</h3>
              <div className="mb-6">
                <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Por Passageiro</h4>
                <p className="text-3xl font-black text-[#0f172a]">{formatCurrencyBRL(comparisonResult!.valorVendaIndividual)}</p>
              </div>
              <div>
                <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Total do Grupo ({comparisonCaravan.travelerQuantity} pax)</h4>
                <p className="text-xl font-bold text-slate-600">{formatCurrencyBRL(comparisonResult!.valorVendaCaravana)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Itens Inclusos */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
            <CheckCircle2 className="text-blue-600" size={24} />
            <h3 className="text-xl font-bold text-[#0f172a]">Serviços Inclusos na Operação</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            {caravan.operationItems.filter(i => i.isActive).map(item => (
              <div key={item.id} className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700 font-medium">{item.description}</span>
              </div>
            ))}
            {Number(caravan.mentorCost) > 0 && (
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700 font-medium">Custo do Mentor Incluído</span>
              </div>
            )}
            {Number(caravan.tourLeaderCosts.aereo) > 0 && (
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700 font-medium">Tour Leader Acompanhante Incluído</span>
              </div>
            )}
          </div>
        </div>

        {/* Observações */}
        {(draftObservations !== undefined ? draftObservations : caravan.observations) && (
          <div className="mt-auto mb-8 bg-amber-50/50 border border-amber-100 rounded-2xl p-6 relative">
            <div className="absolute -top-3 left-6 bg-white border border-amber-200 text-amber-700 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FileText size={12} /> Observações Importantes
            </div>
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed mt-2">
              {draftObservations !== undefined ? draftObservations : caravan.observations}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-slate-50 border-t border-slate-200 p-8 text-center mt-auto">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Ultravel Viagens e Turismo</p>
        <p className="text-[10px] text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Este documento é uma proposta comercial estimativa gerada automaticamente e seus valores estão estritamente atrelados à variação cambial da moeda base ({caravan.currency}) no dia do fechamento do contrato.
          Validade desta proposta sob consulta.
        </p>
      </div>
    </div>
  );
};
