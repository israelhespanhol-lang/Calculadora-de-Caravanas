import React, { useState, useEffect } from 'react';
import type { CaravanData, CaravanCalculationResult } from '../types';
import { formatCurrencyBRL } from '../../../utils/currency';
import { Copy, MessageCircle, X, Check } from 'lucide-react';

interface Props {
  caravan: CaravanData;
  result: CaravanCalculationResult;
  onClose: () => void;
}

export const WhatsAppCopyModal: React.FC<Props> = ({ caravan, result, onClose }) => {
  const [copyText, setCopyText] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    // Generate the intelligent sales copy
    const valorIndividual = formatCurrencyBRL(result.valorVendaIndividual);
    const payingTravelers = Number(caravan.travelerQuantity) - Number(caravan.freePassengers || 0);
    
    // Calcula um "falso parcelamento" de 10x sem juros (comum no turismo)
    const parcela = formatCurrencyBRL(Number(result.valorVendaIndividual) / 10);

    const text = `*PROPOSTA COMERCIAL: ${caravan.name.toUpperCase()}* ✈️🌍

Olá! Tudo bem?
Acabei de finalizar o cálculo detalhado da nossa operação.

Conseguimos viabilizar condições excelentes para o seu grupo de *${caravan.travelerQuantity} passageiros* (sendo ${payingTravelers} pagantes).

🔹 *Investimento por Passageiro:*
De: ~${formatCurrencyBRL(Number(result.valorVendaIndividual) * 1.15)}~
Por: *${valorIndividual}* (ou em até 10x de *${parcela}*)

✅ *O que já está incluso neste valor?*
${caravan.operationItems.filter(i => i.isActive).map(item => `• ${item.description}`).join('\n')}
${Number(caravan.mentorCost) > 0 ? '• Mentor Oficial' : ''}
${Number(caravan.tourLeaderCosts.aereo) > 0 ? '• Tour Leader Acompanhante' : ''}

⚠️ *Aviso Importante:* Este orçamento foi fechado com a cotação do ${caravan.currency} a R$ ${caravan.exchangeRate}. Como o câmbio é volátil, recomendo avançarmos o quanto antes para travar esse valor no banco!

Me avisa o que achou pra gente dar o próximo passo? Estou à disposição! 👇`;

    setCopyText(text);
  }, [caravan, result]);

  const handleCopy = () => {
    navigator.clipboard.writeText(copyText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-6 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <MessageCircle size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Copywriter Inteligente</h2>
              <p className="text-emerald-100 text-sm">Mensagem otimizada com gatilhos de vendas para WhatsApp</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Você pode editar o texto abaixo antes de copiar:
          </label>
          <textarea
            className="w-full h-80 bg-slate-900/50 border border-slate-600 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none resize-none custom-scrollbar"
            value={copyText}
            onChange={(e) => setCopyText(e.target.value)}
          />
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 bg-slate-800/80 shrink-0 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 text-slate-300 hover:text-white transition-colors font-medium">
            Fechar
          </button>
          <button 
            onClick={handleCopy} 
            className={`px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all ${
              isCopied 
                ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                : 'bg-white text-emerald-600 hover:bg-emerald-50 shadow-white/10'
            }`}
          >
            {isCopied ? <><Check size={18} /> Copiado!</> : <><Copy size={18} /> Copiar Mensagem</>}
          </button>
        </div>

      </div>
    </div>
  );
};
