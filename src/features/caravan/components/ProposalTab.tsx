import React from 'react';
import type { CaravanData } from '../types';

interface Props {
  caravan: CaravanData;
  updateCaravan: (field: keyof CaravanData, value: any) => void;
}

export const ProposalTab: React.FC<Props> = ({ caravan, updateCaravan }) => {
  const handleChange = (field: keyof NonNullable<CaravanData['proposalDetails']>, value: string) => {
    const currentDetails = caravan.proposalDetails || { duration: '', hotels: '', flights: '', inclusions: '' };
    updateCaravan('proposalDetails', { ...currentDetails, [field]: value });
  };

  return (
    <div className="space-y-8 text-slate-200">
      <section>
        <h3 className="text-lg font-bold text-emerald-400 mb-6 flex items-center space-x-2 border-b border-white/10 pb-3">
          <span className="w-1.5 h-5 bg-emerald-500 rounded-full"></span>
          <span>Detalhes da Proposta Comercial</span>
        </h3>
        <p className="text-sm text-slate-400 mb-6">
          Preencha os campos abaixo com os dados de venda. Estas informações não afetam os cálculos de preço, mas serão injetadas no seu <strong>PDF da Proposta Final</strong> para deixá-lo muito mais profissional.
        </p>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Duração / Período da Viagem</label>
            <input 
              type="text" 
              placeholder="Ex: 10 dias / 9 noites"
              className="w-full rounded-lg bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 p-3 transition-all duration-300"
              value={caravan.proposalDetails?.duration || ''}
              onChange={(e) => handleChange('duration', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Hotéis e Acomodações</label>
            <textarea 
              rows={3}
              placeholder="Ex: 3 Noites em Roma (Hotel 4 Estrelas), 2 Noites em Assis..."
              className="w-full rounded-lg bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 p-3 transition-all duration-300 resize-y"
              value={caravan.proposalDetails?.hotels || ''}
              onChange={(e) => handleChange('hotels', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Opções de Voos / Aéreo</label>
            <textarea 
              rows={3}
              placeholder="Ex: Voo direto LATAM (Guarulhos -> Roma). Bagagem de 23kg inclusa."
              className="w-full rounded-lg bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 p-3 transition-all duration-300 resize-y"
              value={caravan.proposalDetails?.flights || ''}
              onChange={(e) => handleChange('flights', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">O que está Incluso (Opcional)</label>
            <textarea 
              rows={4}
              placeholder="Ex: Café da manhã todos os dias, ingressos para o Museu, Guia brasileiro..."
              className="w-full rounded-lg bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 p-3 transition-all duration-300 resize-y"
              value={caravan.proposalDetails?.inclusions || ''}
              onChange={(e) => handleChange('inclusions', e.target.value)}
            />
          </div>
        </div>
      </section>
    </div>
  );
};
