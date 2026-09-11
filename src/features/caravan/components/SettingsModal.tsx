import React from 'react';
import type { Settings, CaravanData } from '../types';
import { Lightbulb } from 'lucide-react';

interface Props {
  onClose: () => void;
  globalSettings: Settings;
  onSaveGlobal: (settings: Settings) => void;
  activeCaravan: CaravanData;
  onUpdateCaravanSettings: () => void;
}

export const SettingsModal: React.FC<Props> = ({ onClose, globalSettings, onSaveGlobal, activeCaravan, onUpdateCaravanSettings }) => {
  const [localSettings, setLocalSettings] = React.useState<Settings>(globalSettings);

  const getMarkupSuggestion = () => {
    const c = activeCaravan.currency;
    if (['EUR', 'GBP', 'CHF'].includes(c)) return { val: '18', desc: 'Europa (Premium)' };
    if (['USD', 'CAD', 'AUD'].includes(c)) return { val: '15', desc: 'América do Norte/Oceania' };
    if (['ILS', 'EGP', 'AED'].includes(c)) return { val: '12', desc: 'Oriente Médio (Volume)' };
    if (['ARS', 'CLP'].includes(c)) return { val: '10', desc: 'América do Sul' };
    return { val: '15', desc: 'Padrão' };
  };
  const suggestion = getMarkupSuggestion();

  const updateCost = (field: keyof Settings['corporateCosts'], value: string) => {
    setLocalSettings({
      ...localSettings,
      corporateCosts: { ...localSettings.corporateCosts, [field]: value }
    });
  };

  const updatePerc = (field: keyof Settings['defaultPercentages'], value: string) => {
    setLocalSettings({
      ...localSettings,
      defaultPercentages: { ...localSettings.defaultPercentages, [field]: value }
    });
  };

  const handleSave = () => {
    onSaveGlobal(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900/90 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto overflow-x-hidden relative">
        
        <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-slate-900/80 backdrop-blur-xl z-10">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
            <span>Configurações Corporativas</span>
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-2xl leading-none">&times;</button>
        </div>

        <div className="p-6 space-y-8 text-slate-200">
          <div className="bg-blue-900/20 border border-blue-500/30 p-5 rounded-xl text-sm text-blue-100 shadow-inner">
            <p className="font-semibold text-blue-300 mb-2">Atenção:</p>
            <p>Salvar estas configurações afetará <strong>apenas novas caravanas</strong> criadas a partir de agora.</p>
            <p className="mt-2">Se você deseja que o projeto atual <strong>"{activeCaravan.name}"</strong> utilize estas novas configurações, clique no botão "Atualizar este projeto" abaixo.</p>
            <button 
              onClick={onUpdateCaravanSettings}
              className="mt-4 bg-blue-600/30 border border-blue-500/50 text-blue-200 px-4 py-2 rounded-lg hover:bg-blue-500/50 hover:text-white transition-all duration-300 font-medium w-full sm:w-auto"
            >
              Atualizar este projeto com as configurações vigentes
            </button>
          </div>

          <section>
            <h3 className="font-bold text-slate-300 mb-4 border-b border-white/10 pb-2">Custos Mensais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Custo Fixo Mensal (R$)</label>
                <input type="number" className="w-full border-slate-600/50 rounded-lg p-2.5 bg-slate-800/50 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all" value={localSettings.corporateCosts.custoFixoMensal} onChange={e => updateCost('custoFixoMensal', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Marketing (R$)</label>
                <input type="number" className="w-full border-slate-600/50 rounded-lg p-2.5 bg-slate-800/50 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all" value={localSettings.corporateCosts.marketing} onChange={e => updateCost('marketing', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Sistema (R$)</label>
                <input type="number" className="w-full border-slate-600/50 rounded-lg p-2.5 bg-slate-800/50 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all" value={localSettings.corporateCosts.sistema} onChange={e => updateCost('sistema', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Horas Mensais</label>
                <input type="number" className="w-full border-slate-600/50 rounded-lg p-2.5 bg-slate-800/50 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all" value={localSettings.corporateCosts.horasMensais} onChange={e => updateCost('horasMensais', e.target.value)} />
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-bold text-slate-300 mb-4 border-b border-white/10 pb-2">Percentuais Padrão (%)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Imposto Venda</label>
                <input type="number" step="0.01" className="w-full border-slate-600/50 rounded-lg p-2.5 bg-slate-800/50 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all" value={localSettings.defaultPercentages.imposto} onChange={e => updatePerc('imposto', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Comissão Ultravel</label>
                <input type="number" step="0.01" className="w-full border-slate-600/50 rounded-lg p-2.5 bg-slate-800/50 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all" value={localSettings.defaultPercentages.comissaoUltravel} onChange={e => updatePerc('comissaoUltravel', e.target.value)} />
                <div 
                  className="mt-1.5 flex items-center space-x-1 text-[11px] text-emerald-400 cursor-pointer hover:text-emerald-300 transition-colors" 
                  onClick={() => updatePerc('comissaoUltravel', suggestion.val)}
                  title="Clique para aplicar a sugestão da IA"
                >
                  <Lightbulb size={12} /> <span>Sugestão IA: {suggestion.val}% ({suggestion.desc})</span>
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Trader / Captador</label>
                <input type="number" step="0.01" className="w-full border-slate-600/50 rounded-lg p-2.5 bg-slate-800/50 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all" value={localSettings.defaultPercentages.traderCaptador} onChange={e => updatePerc('traderCaptador', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">IOF</label>
                <input type="number" step="0.01" className="w-full border-slate-600/50 rounded-lg p-2.5 bg-slate-800/50 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all" value={localSettings.defaultPercentages.iof} onChange={e => updatePerc('iof', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">IR/Custo Remessa</label>
                <input type="number" step="0.01" className="w-full border-slate-600/50 rounded-lg p-2.5 bg-slate-800/50 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all" value={localSettings.defaultPercentages.impostoRendaRemessa} onChange={e => updatePerc('impostoRendaRemessa', e.target.value)} />
              </div>
            </div>
          </section>

        </div>

        <div className="p-6 border-t border-white/10 bg-slate-900/50 flex justify-end space-x-4">
          <button onClick={onClose} className="px-5 py-2.5 text-slate-300 hover:text-white transition-colors font-medium">Cancelar</button>
          <button onClick={handleSave} className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-0.5 transition-all font-bold">Salvar Padrões Globais</button>
        </div>
      </div>
    </div>
  );
};
