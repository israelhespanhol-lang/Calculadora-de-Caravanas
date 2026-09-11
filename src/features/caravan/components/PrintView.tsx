import React from 'react';
import type { CaravanData, CaravanCalculationResult } from '../types';
import { formatCurrencyBRL } from '../../../utils/currency';

interface Props {
  caravan: CaravanData;
  result: CaravanCalculationResult;
  // Overrides para o modo Rascunho (Draft)
  draftName?: string;
  draftTravelerQuantity?: string;
  draftIndividualPrice?: string;
  draftTotalPrice?: string;
  draftObservations?: string;
}

export const PrintView: React.FC<Props> = ({ 
  caravan, 
  result,
  draftName,
  draftTravelerQuantity,
  draftIndividualPrice,
  draftTotalPrice,
  draftObservations
}) => {
  const displayIndividual = draftIndividualPrice !== undefined ? draftIndividualPrice : result.valorVendaIndividual;
  const displayTotal = draftTotalPrice !== undefined ? draftTotalPrice : result.valorVendaCaravana;
  
  return (
    <div className="p-8 bg-white text-black font-sans">
      <div className="border-b-2 border-blue-800 pb-4 mb-6 flex justify-between items-end">
        <div>
          <img src="/logo.png" alt="Ultravel Logo" className="h-12 object-contain mb-2" />
          <p className="text-sm text-gray-500 uppercase tracking-widest mt-1">Proposta Comercial de Caravana</p>
        </div>
        <div className="text-right">
          <p className="text-sm"><strong>Data da Cotação:</strong> {caravan.quoteDate}</p>
          <p className="text-sm"><strong>Moeda Base:</strong> {caravan.currency} (Cotação R$ {caravan.exchangeRate})</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-1">{draftName || caravan.name}</h2>
        <p className="text-gray-600">Baseado em um grupo de <strong>{draftTravelerQuantity || caravan.travelerQuantity} viajantes</strong>.</p>
        {(draftObservations !== undefined ? draftObservations : caravan.observations) && (
          <p className="mt-4 italic text-sm text-gray-500 border-l-4 border-gray-300 pl-3">
            {draftObservations !== undefined ? draftObservations : caravan.observations}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-8 mb-12">
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm uppercase tracking-wider text-gray-500 font-bold mb-4">Investimento Individual</h3>
          <p className="text-4xl font-black text-blue-700">{formatCurrencyBRL(displayIndividual)}</p>
          <p className="text-sm text-gray-500 mt-2">Por viajante</p>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm uppercase tracking-wider text-gray-500 font-bold mb-4">Investimento Total</h3>
          <p className="text-3xl font-bold text-gray-800">{formatCurrencyBRL(displayTotal)}</p>
          <p className="text-sm text-gray-500 mt-2">Para o grupo de {draftTravelerQuantity || caravan.travelerQuantity} pessoas</p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-bold border-b border-gray-300 pb-2 mb-4">Itens Inclusos na Operação Internacional</h3>
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-800">
              <th className="py-2">Item</th>
            </tr>
          </thead>
          <tbody>
            {caravan.operationItems.filter(i => i.isActive).map(item => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-2">{item.description}</td>
              </tr>
            ))}
            {Number(caravan.mentorCost) > 0 && (
              <tr className="border-b border-gray-200">
                <td className="py-2">Mentor Incluído</td>
              </tr>
            )}
            {Number(caravan.tourLeaderCosts.aereo) > 0 && (
              <tr className="border-b border-gray-200">
                <td className="py-2">Tour Leader Acompanhante</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-gray-400 text-center mt-16 pt-8 border-t border-gray-200">
        <p>Proposta gerada automaticamente pelo Sistema Simulador Ultravel.</p>
        <p>Valores sujeitos a alteração conforme variação cambial.</p>
      </div>
    </div>
  );
};
