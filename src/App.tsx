import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { v4 as uuidv4 } from 'uuid';
import type { CaravanData, Settings } from './features/caravan/types';
import { getCaravans, getSettings, saveCaravan, deleteCaravan, saveSettings } from './repositories/caravanRepository';
import { calculateCaravan } from './calculations/calculationEngine';

import { OperationTab } from './features/caravan/components/OperationTab';
import { CaravanTab } from './features/caravan/components/CaravanTab';
import { SettingsModal } from './features/caravan/components/SettingsModal';
import { CalculationMemory } from './features/caravan/components/CalculationMemory';
import { PrintView } from './features/caravan/components/PrintView';
import { BreakEvenChart } from './features/caravan/components/BreakEvenChart';

import { Settings as SettingsIcon, Save, Plus, Trash2, Copy, History, Download, TrendingUp, Loader2, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatCurrencyBRL } from './utils/currency';

function App() {
  const [caravans, setCaravans] = useState<CaravanData[]>([]);
  const [activeCaravan, setActiveCaravan] = useState<CaravanData | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  
  const [activeTab, setActiveTab] = useState<'operation' | 'caravan'>('operation');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMemoryOpen, setIsMemoryOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [currencyVolatility, setCurrencyVolatility] = useState<number | null>(null);

  useEffect(() => {
    const loadedSettings = getSettings();
    setSettings(loadedSettings);
    
    const loadedCaravans = getCaravans();
    setCaravans(loadedCaravans);
    
    if (loadedCaravans.length > 0) {
      setActiveCaravan(loadedCaravans[0]);
    } else {
      createNewCaravan(loadedSettings);
    }
  }, []);

  useEffect(() => {
    if (!activeCaravan?.currency) return;
    
    const fetchVolatility = async () => {
      try {
        const currency = activeCaravan.currency === 'GBP' ? 'GBP' : activeCaravan.currency;
        const res = await fetch(`https://economia.awesomeapi.com.br/json/daily/${currency}-BRL/15`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const values = data.map(d => parseFloat(d.ask));
          const max = Math.max(...values);
          const min = Math.min(...values);
          if (min > 0) {
            setCurrencyVolatility(((max - min) / min) * 100);
          }
        }
      } catch (e) {
        console.error("Erro ao buscar volatilidade", e);
      }
    };
    fetchVolatility();
  }, [activeCaravan?.currency]);

  const createNewCaravan = (currentSettings: Settings) => {
    const newCaravan: CaravanData = {
      id: uuidv4(),
      name: 'Nova Caravana',
      travelerQuantity: '20',
      responsible: '',
      creationDate: new Date().toISOString().split('T')[0],
      quoteDate: new Date().toISOString().split('T')[0],
      observations: '',
      currency: 'USD',
      exchangeRate: '5.26', // Exemplo inicial
      projectHours: '3',
      designerFixed: '0',
      otherFixed2: '0',
      otherFixed3: '0',
      mentorCost: '0',
      calculationVersion: 'legacy-v1',
      corporateCostsSnapshot: currentSettings.corporateCosts,
      percentagesSnapshot: currentSettings.defaultPercentages,
      operationItems: [
        { id: uuidv4(), description: 'Hotelaria', quantity: null, unitCost: '0', isActive: true },
        { id: uuidv4(), description: 'Transfer', quantity: null, unitCost: '0', isActive: true },
        { id: uuidv4(), description: 'Guias', quantity: null, unitCost: '0', isActive: true },
        { id: uuidv4(), description: 'Tickets', quantity: null, unitCost: '0', isActive: true },
      ],
      tourLeaderCosts: { aereo: '0', hotel: '0', seguro: '0', outros: '0' }
    };
    
    setActiveCaravan(newCaravan);
    setActiveTab('operation');
  };

  const handleSave = () => {
    if (activeCaravan) {
      saveCaravan(activeCaravan);
      setCaravans(getCaravans());
      alert('Projeto salvo com sucesso!');
    }
  };

  const handleDelete = () => {
    if (activeCaravan && confirm('Tem certeza que deseja excluir este projeto?')) {
      deleteCaravan(activeCaravan.id);
      const updated = getCaravans();
      setCaravans(updated);
      if (updated.length > 0) {
        setActiveCaravan(updated[0]);
      } else if (settings) {
        createNewCaravan(settings);
      }
    }
  };

  const handleDuplicate = () => {
    if (activeCaravan) {
      const duplicated = {
        ...activeCaravan,
        id: uuidv4(),
        name: `${activeCaravan.name} (Cópia)`,
        creationDate: new Date().toISOString().split('T')[0],
      };
      saveCaravan(duplicated);
      setCaravans(getCaravans());
      setActiveCaravan(duplicated);
      alert('Projeto duplicado!');
    }
  };

  const updateCaravanField = (field: keyof CaravanData, value: any) => {
    setActiveCaravan(prev => prev ? { ...prev, [field]: value } : prev);
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('pdf-content');
    if (!element || !activeCaravan) return;
    
    try {
      setIsExporting(true);
      // Salva estilos originais
      const originalDisplay = element.style.display;
      const originalPosition = element.style.position;
      const originalTop = element.style.top;
      
      // Força a exibição para o html2canvas
      element.style.display = 'block';
      element.style.position = 'absolute';
      element.style.top = '-9999px';
      
      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Proposta_${activeCaravan.name || 'Caravana'}.pdf`);
      
      // Restaura
      element.style.display = originalDisplay;
      element.style.position = originalPosition;
      element.style.top = originalTop;
    } catch (e) {
      console.error(e);
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!settings || !activeCaravan) return <div className="p-8 text-center">Carregando...</div>;

  const result = calculateCaravan(activeCaravan);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 flex flex-col font-sans print:hidden selection:bg-red-500/30 selection:text-red-200">
        {/* Header */}
        <header className="bg-white/5 backdrop-blur-lg border-b border-white/10 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <img 
                src="/logo.png" 
                alt="Ultravel Logo" 
                className="h-10 sm:h-12 w-auto object-contain" 
              />
              <div className="flex items-center space-x-2 bg-slate-800/60 border border-white/10 rounded-xl p-1.5 shadow-inner ml-2">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider pl-2 pr-1 hidden sm:block">Projeto:</span>
                <select 
                  className="bg-white/5 hover:bg-white/10 text-white rounded-lg px-3 py-1.5 text-sm border border-transparent focus:border-red-500/50 outline-none w-[160px] sm:w-[200px] truncate transition-all duration-300 font-medium cursor-pointer appearance-none"
                  value={activeCaravan.id}
                  onChange={(e) => {
                    const selected = caravans.find(c => c.id === e.target.value);
                    if (selected) setActiveCaravan(selected);
                  }}
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                >
                  {caravans.map(c => (
                    <option key={c.id} value={c.id} className="bg-slate-800 text-white font-medium">{c.name || '(Sem Nome)'}</option>
                  ))}
                </select>
                <div className="w-px h-6 bg-white/10 mx-1"></div>
                <button onClick={() => createNewCaravan(settings)} className="flex items-center space-x-1.5 bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/30 transition-all duration-300 shrink-0 font-medium" title="Criar nova caravana vazia">
                  <Plus size={16} /> <span className="text-sm">Novo</span>
                </button>
              </div>
            </div>
            
            <div className="flex space-x-3 w-full sm:w-auto justify-end overflow-x-auto pb-1 sm:pb-0">
              <button onClick={() => setIsMemoryOpen(true)} className="flex items-center space-x-2 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-300 shrink-0">
                <History size={16} /> <span className="hidden sm:inline text-sm font-medium">Memória</span>
              </button>
              <button 
                onClick={handleExportPDF} 
                disabled={isExporting}
                className="flex items-center space-x-2 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-300 shrink-0 disabled:opacity-50"
              >
                {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                <span className="hidden sm:inline text-sm font-medium">{isExporting ? 'Gerando...' : 'Exportar PDF'}</span>
              </button>
              <button onClick={() => setIsSettingsOpen(true)} className="flex items-center space-x-2 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-300 shrink-0">
                <SettingsIcon size={16} /> <span className="hidden lg:inline text-sm font-medium">Configurações</span>
              </button>
              <button onClick={handleSave} className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg shadow-lg shadow-red-600/20 hover:shadow-red-600/40 hover:-translate-y-0.5 transition-all duration-300 font-semibold shrink-0">
                <Save size={16} /> <span>Salvar</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
          {/* Left Column - Forms */}
          <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            
            <div className="border-b border-white/10 flex bg-white/5">
              <button 
                className={`flex-1 py-4 font-semibold text-sm text-center transition-all duration-300 ${activeTab === 'operation' ? 'border-b-2 border-red-500 text-red-400 bg-white/5' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
                onClick={() => setActiveTab('operation')}
              >
                Custo da Operação
              </button>
              <button 
                className={`flex-1 py-4 font-semibold text-sm text-center transition-all duration-300 ${activeTab === 'caravan' ? 'border-b-2 border-red-500 text-red-400 bg-white/5' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
                onClick={() => setActiveTab('caravan')}
              >
                Caravana
              </button>
            </div>

            <div className="p-8 overflow-y-auto">
              {activeTab === 'operation' ? (
                <OperationTab caravan={activeCaravan} updateCaravan={updateCaravanField} />
              ) : (
                <CaravanTab caravan={activeCaravan} updateCaravan={updateCaravanField} calculationResult={result} />
              )}
            </div>

            <div className="bg-slate-900/50 border-t border-white/10 p-5 flex justify-between items-center mt-auto">
              <button onClick={handleDelete} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center space-x-2 text-sm font-medium">
                <Trash2 size={16} /> <span>Excluir Projeto</span>
              </button>
              <button onClick={handleDuplicate} className="text-slate-300 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center space-x-2 text-sm font-medium">
                <Copy size={16} /> <span>Duplicar Projeto</span>
              </button>
            </div>
          </div>

          {/* Right Column - Summary Panel */}
          <div className="w-full md:w-80 lg:w-[380px] flex flex-col gap-6">
            <div className="sticky top-24 flex flex-col gap-6 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar pb-8">
              <div className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-blue-500/20 rounded-2xl shadow-2xl p-8">
                <h2 className="text-lg font-bold text-blue-100 mb-6 flex items-center space-x-2">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                <span>Resumo da Caravana</span>
              </h2>
              
              <div className="space-y-6">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-sm text-slate-400 font-medium mb-1">Custo da Operação (com remessa)</p>
                  <p className="text-xl font-semibold text-slate-200">{formatCurrencyBRL(result.custoOperacaoGrupoComRemessa)}</p>
                </div>
                
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-sm text-slate-400 font-medium mb-1">Valor de Venda (Total)</p>
                  <p className="text-2xl font-bold text-blue-400">{formatCurrencyBRL(result.valorVendaCaravana)}</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 rounded-xl p-6 border border-emerald-500/30 mt-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-all duration-500"></div>
                  <p className="text-sm text-emerald-200 font-medium mb-2 relative z-10">Valor Individual</p>
                  <p className="text-4xl font-black text-white relative z-10 tracking-tight">{formatCurrencyBRL(result.valorVendaIndividual)}</p>
                  <p className="text-xs text-emerald-300/80 mt-2 relative z-10 font-medium">por viajante ({activeCaravan.travelerQuantity} total)</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-blue-500/20 rounded-2xl shadow-2xl p-6">
              <h2 className="text-sm font-bold text-slate-300 mb-4 flex items-center space-x-2">
                <TrendingUp size={16} className="text-emerald-400" />
                <span>Simulação de Risco (Câmbio)</span>
              </h2>

              {currencyVolatility !== null && (
                <div className={`mt-3 mb-4 p-3 rounded-lg border flex items-start space-x-2 text-sm ${currencyVolatility > 3 ? 'bg-red-500/10 border-red-500/30 text-red-300' : currencyVolatility >= 1 ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'}`}>
                  {currencyVolatility > 3 ? <AlertTriangle size={16} className="mt-0.5 shrink-0" /> : currencyVolatility >= 1 ? <AlertCircle size={16} className="mt-0.5 shrink-0" /> : <CheckCircle2 size={16} className="mt-0.5 shrink-0" />}
                  <div>
                    <p className="font-bold">Volatilidade (15 dias): {currencyVolatility.toFixed(2)}%</p>
                    <p className="opacity-80 text-xs mt-1">
                      {currencyVolatility > 3 ? 'Moeda altamente instável. Suba a margem de segurança.' : currencyVolatility >= 1 ? 'Oscilação moderada. Acompanhe as notícias internacionais.' : 'Moeda estável e segura para precificação a longo prazo.'}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                {/* Cenário Otimista */}
                <div className="bg-white/5 p-3 rounded-lg border border-emerald-500/20">
                  <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                    <span>Otimista (-5%)</span>
                    <span>R$ {(Number(activeCaravan.exchangeRate) * 0.95).toFixed(3)}</span>
                  </div>
                  <div className="text-emerald-400 font-bold">
                    {formatCurrencyBRL(calculateCaravan({ ...activeCaravan, exchangeRate: (Number(activeCaravan.exchangeRate) * 0.95).toString() }).valorVendaIndividual)} <span className="text-xs font-normal text-slate-500">/ pax</span>
                  </div>
                </div>
                {/* Cenário Atual */}
                <div className="bg-white/5 p-3 rounded-lg border border-blue-500/20">
                  <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                    <span>Atual</span>
                    <span>R$ {Number(activeCaravan.exchangeRate).toFixed(3)}</span>
                  </div>
                  <div className="text-blue-400 font-bold">
                    {formatCurrencyBRL(result.valorVendaIndividual)} <span className="text-xs font-normal text-slate-500">/ pax</span>
                  </div>
                </div>
                {/* Cenário Pessimista */}
                <div className="bg-white/5 p-3 rounded-lg border border-red-500/20">
                  <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                    <span>Pessimista (+5%)</span>
                    <span>R$ {(Number(activeCaravan.exchangeRate) * 1.05).toFixed(3)}</span>
                  </div>
                  <div className="text-red-400 font-bold">
                    {formatCurrencyBRL(calculateCaravan({ ...activeCaravan, exchangeRate: (Number(activeCaravan.exchangeRate) * 1.05).toString() }).valorVendaIndividual)} <span className="text-xs font-normal text-slate-500">/ pax</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Break-Even Chart */}
            <BreakEvenChart caravan={activeCaravan} result={result} />
            
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {isSettingsOpen && (
        <SettingsModal 
          onClose={() => setIsSettingsOpen(false)} 
          globalSettings={settings}
          onSaveGlobal={(s) => {
            setSettings(s);
            saveSettings(s);
          }}
          activeCaravan={activeCaravan}
          onUpdateCaravanSettings={() => {
            updateCaravanField('corporateCostsSnapshot', settings.corporateCosts);
            updateCaravanField('percentagesSnapshot', settings.defaultPercentages);
            alert('Projeto atualizado com as configurações vigentes!');
          }}
        />
      )}

      {isMemoryOpen && (
        <CalculationMemory 
          memory={result.memory} 
          onClose={() => setIsMemoryOpen(false)} 
        />
      )}
      <div id="pdf-content" className="hidden">
        <PrintView caravan={activeCaravan} result={result} />
      </div>
    </>
  );
}

export default App;
