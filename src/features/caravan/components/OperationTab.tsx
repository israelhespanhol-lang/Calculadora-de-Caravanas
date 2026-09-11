import React from 'react';
import type { CaravanData } from '../types';
import { Plus, Trash2, HelpCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  caravan: CaravanData;
  updateCaravan: (field: keyof CaravanData, value: any) => void;
}

export const OperationTab: React.FC<Props> = ({ caravan, updateCaravan }) => {
  const handleItemChange = (id: string, field: string, value: any) => {
    const updated = caravan.operationItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    updateCaravan('operationItems', updated);
  };

  const handleAddItem = () => {
    const newItem = {
      id: uuidv4(),
      description: 'Novo Item',
      quantity: null,
      unitCost: '0',
      isActive: true
    };
    updateCaravan('operationItems', [...caravan.operationItems, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    updateCaravan('operationItems', caravan.operationItems.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-8 text-slate-200">
      <section>
        <h3 className="text-lg font-bold text-blue-300 mb-6 flex items-center space-x-2">
          <span className="w-1.5 h-5 bg-blue-400 rounded-full"></span>
          <span>Informações Gerais</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Nome da Caravana</label>
            <input 
              type="text" 
              className="w-full rounded-lg bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 p-2.5 transition-all duration-300"
              value={caravan.name}
              onChange={(e) => updateCaravan('name', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Data da Cotação</label>
            <input 
              type="date" 
              className="w-full rounded-lg bg-slate-800/50 border border-slate-600/50 text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 p-2.5 transition-all duration-300"
              value={caravan.quoteDate}
              onChange={(e) => updateCaravan('quoteDate', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center">
              Qtd. Padrão de Viajantes
              <span title="Tamanho total do grupo, incluindo pagantes e cortesias." className="ml-1 text-slate-500 cursor-help hover:text-blue-400"><HelpCircle size={14} /></span>
            </label>
            <input 
              type="number" 
              className="w-full rounded-lg bg-blue-900/30 border border-blue-600/50 text-blue-100 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 p-2.5 transition-all duration-300"
              value={caravan.travelerQuantity}
              onChange={(e) => updateCaravan('travelerQuantity', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center">
              Regra de Cortesias (Frees)
              <span title="Passageiros grátis (ex: Pastor). O custo deles será rateado entre os pagantes." className="ml-1 text-slate-500 cursor-help hover:text-emerald-400"><HelpCircle size={14} /></span>
            </label>
            <div className="flex space-x-2">
              <select 
                className="w-1/2 rounded-lg bg-emerald-900/20 border border-emerald-600/50 text-emerald-100 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 p-2.5 transition-all duration-300 text-sm"
                value={caravan.freePassengerRule || 'manual'}
                onChange={(e) => updateCaravan('freePassengerRule', e.target.value)}
              >
                <option value="manual">Manual</option>
                <option value="proportional">Proporcional</option>
              </select>

              {caravan.freePassengerRule === 'proportional' ? (
                <div className="w-1/2 flex items-center bg-emerald-900/20 border border-emerald-600/50 rounded-lg px-2 text-emerald-100 focus-within:ring-2 focus-within:ring-emerald-500/50">
                  <span className="text-xs mr-1 opacity-70 whitespace-nowrap">1 a cada</span>
                  <input 
                    type="number"
                    className="min-w-0 flex-1 bg-transparent outline-none text-sm p-1.5"
                    value={caravan.freePassengerRatio ?? ''}
                    onChange={(e) => updateCaravan('freePassengerRatio', e.target.value)}
                  />
                </div>
              ) : (
                <input 
                  type="number" 
                  className="w-1/2 rounded-lg bg-emerald-900/20 border border-emerald-600/50 text-emerald-100 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 p-2.5 transition-all duration-300"
                  value={caravan.freePassengers ?? ''}
                  onChange={(e) => updateCaravan('freePassengers', e.target.value)}
                  placeholder="Qtd"
                />
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Moeda da Cotação</label>
            <select 
              className="w-full rounded-lg bg-slate-800/50 border border-slate-600/50 text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 p-2.5 transition-all duration-300"
              value={caravan.currency}
              onChange={async (e) => {
                const newCurrency = e.target.value;
                updateCaravan('currency', newCurrency);
                // Auto-fetch new exchange rate
                try {
                  const response = await fetch(`https://economia.awesomeapi.com.br/last/${newCurrency}-BRL`);
                  const data = await response.json();
                  const rate = data[`${newCurrency}BRL`]?.ask;
                  if (rate) updateCaravan('exchangeRate', parseFloat(rate).toFixed(3));
                } catch (err) {
                  console.error('Failed to auto-fetch rate');
                }
              }}
            >
              <option value="USD">Dólar Americano (USD)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="GBP">Libra Esterlina (GBP)</option>
              <option value="CAD">Dólar Canadense (CAD)</option>
              <option value="AUD">Dólar Australiano (AUD)</option>
              <option value="CHF">Franco Suíço (CHF)</option>
              <option value="JPY">Iene Japonês (JPY)</option>
              <option value="ILS">Shekel Israelense (ILS)</option>
              <option value="EGP">Libra Egípcia (EGP)</option>
              <option value="AED">Dirham dos Emirados (AED)</option>
              <option value="ARS">Peso Argentino (ARS)</option>
              <option value="CLP">Peso Chileno (CLP)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center">
              Cotação da Moeda (R$)
              <span title="Preencha manualmente a cotação do dia" className="ml-1 text-slate-500 cursor-help hover:text-blue-400 transition-colors"><HelpCircle size={14} /></span>
            </label>
            <div className="relative">
              <input 
                type="number" 
                step="0.001"
                className="w-full rounded-lg bg-blue-900/30 border border-blue-600/50 text-blue-100 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 p-2.5 transition-all duration-300"
                value={caravan.exchangeRate}
                onChange={(e) => updateCaravan('exchangeRate', e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-blue-300 flex items-center space-x-2">
            <span className="w-1.5 h-5 bg-blue-400 rounded-full"></span>
            <span>Itens da Operação (Moeda Estrangeira)</span>
          </h3>
          <button 
            onClick={handleAddItem}
            className="flex items-center space-x-2 text-sm bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg hover:bg-red-500/30 hover:scale-105 transition-all duration-300 font-medium"
          >
            <Plus size={16} /> <span>Adicionar Linha</span>
          </button>
        </div>
        
        <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-xl">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead className="bg-slate-800/80 text-slate-300 text-sm border-b border-white/10">
              <tr>
                <th className="p-4 font-medium w-12 text-center rounded-tl-xl whitespace-nowrap">Ativo</th>
                <th className="p-4 font-medium min-w-[200px]">Descrição</th>
                <th className="p-4 font-medium w-32 text-center whitespace-nowrap">Usar Padrão?</th>
                <th className="p-4 font-medium w-32 min-w-[100px] text-right">Qtd.</th>
                <th className="p-4 font-medium w-40 min-w-[160px] text-right">Custo Unitário</th>
                <th className="p-4 font-medium w-16 text-center rounded-tr-xl">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {caravan.operationItems.map(item => {
                const useDefault = item.quantity === null || item.quantity === '';
                return (
                  <tr key={item.id} className={`transition-all duration-300 ${item.isActive ? 'hover:bg-white/5' : 'opacity-40 grayscale'}`}>
                    <td className="p-3 text-center">
                      <input 
                        type="checkbox" 
                        checked={item.isActive} 
                        onChange={(e) => handleItemChange(item.id, 'isActive', e.target.checked)}
                        className="rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500/50 focus:ring-offset-slate-900 cursor-pointer w-4 h-4"
                      />
                    </td>
                    <td className="p-3">
                      <input 
                        type="text" 
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                        className={`w-full p-2 border rounded-lg text-sm transition-all duration-300 outline-none ${item.isActive ? 'bg-blue-900/20 border-blue-600/30 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50' : 'bg-transparent border-transparent text-slate-500'}`}
                        disabled={!item.isActive}
                      />
                    </td>
                    <td className="p-3 text-center">
                      <input 
                        type="checkbox" 
                        checked={useDefault}
                        onChange={(e) => handleItemChange(item.id, 'quantity', e.target.checked ? null : '1')}
                        className="rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500/50 focus:ring-offset-slate-900 cursor-pointer w-4 h-4"
                        disabled={!item.isActive}
                      />
                    </td>
                    <td className="p-3">
                      <input 
                        type="number" 
                        value={useDefault ? caravan.travelerQuantity : item.quantity!}
                        onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                        className={`w-full p-2 border rounded-lg text-sm text-right transition-all duration-300 outline-none ${item.isActive && !useDefault ? 'bg-blue-900/20 border-blue-600/30 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50' : 'bg-transparent border-transparent text-slate-500 cursor-not-allowed'}`}
                        disabled={!item.isActive || useDefault}
                      />
                    </td>
                    <td className="p-3">
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-slate-400 text-sm font-medium">{caravan.currency === 'USD' ? '$' : caravan.currency}</span>
                        <input 
                          type="number" 
                          step="0.01"
                          value={item.unitCost}
                          onChange={(e) => handleItemChange(item.id, 'unitCost', e.target.value)}
                          className={`w-full pl-10 p-2 border rounded-lg text-sm text-right transition-all duration-300 outline-none ${item.isActive ? 'bg-blue-900/20 border-blue-600/30 text-blue-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50' : 'bg-transparent border-transparent text-slate-500'}`}
                          disabled={!item.isActive}
                        />
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300 p-2 rounded-lg"
                        title="Remover linha"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
