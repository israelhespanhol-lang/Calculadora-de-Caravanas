import React, { useState } from 'react';
import type { CaravanData, CaravanCalculationResult } from '../types';
import { PrintView } from './PrintView';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Download, X, Loader2, FileEdit } from 'lucide-react';

interface Props {
  caravan: CaravanData;
  result: CaravanCalculationResult;
  onClose: () => void;
}

export const PdfEditorModal: React.FC<Props> = ({ caravan, result, onClose }) => {
  const [draftName, setDraftName] = useState(caravan.name);
  const [draftTravelerQuantity, setDraftTravelerQuantity] = useState(caravan.travelerQuantity);
  const [draftIndividualPrice, setDraftIndividualPrice] = useState<string | number>(Number(result.valorVendaIndividual).toFixed(2));
  const [draftTotalPrice, setDraftTotalPrice] = useState<string | number>(Number(result.valorVendaCaravana).toFixed(2));
  const [draftObservations, setDraftObservations] = useState(caravan.observations || '');
  
  const [isExporting, setIsExporting] = useState(false);

  const generatePDF = async () => {
    const element = document.getElementById('pdf-preview-content');
    if (!element) return;
    
    try {
      setIsExporting(true);
      
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
      pdf.save(`Proposta_${draftName || 'Caravana'}.pdf`);
      
    } catch (e) {
      console.error(e);
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-7xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
          <div className="flex items-center space-x-3">
            <FileEdit className="text-blue-400" size={24} />
            <h2 className="text-xl font-bold text-white">Editor de Proposta (PDF)</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Left Column: Form */}
          <div className="w-1/3 bg-slate-800/30 p-6 overflow-y-auto border-r border-slate-700 custom-scrollbar">
            <div className="space-y-6">
              <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-sm text-blue-200">
                <p>As alterações feitas aqui refletirão apenas no arquivo PDF final. Elas <strong>não alterarão</strong> os dados oficiais do projeto.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Nome do Projeto / Cliente</label>
                <input 
                  type="text" 
                  className="w-full rounded-lg bg-slate-800 border border-slate-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 p-2.5 transition-all"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Quantidade de Viajantes</label>
                <input 
                  type="text" 
                  className="w-full rounded-lg bg-slate-800 border border-slate-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 p-2.5 transition-all"
                  value={draftTravelerQuantity}
                  onChange={(e) => setDraftTravelerQuantity(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Investimento Individual (R$)</label>
                <input 
                  type="number" step="0.01"
                  className="w-full rounded-lg bg-slate-800 border border-slate-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 p-2.5 transition-all"
                  value={draftIndividualPrice}
                  onChange={(e) => setDraftIndividualPrice(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Investimento Total (R$)</label>
                <input 
                  type="number" step="0.01"
                  className="w-full rounded-lg bg-slate-800 border border-slate-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 p-2.5 transition-all"
                  value={draftTotalPrice}
                  onChange={(e) => setDraftTotalPrice(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Observações / Termos</label>
                <textarea 
                  className="w-full rounded-lg bg-slate-800 border border-slate-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 p-2.5 h-32 transition-all resize-none"
                  value={draftObservations}
                  onChange={(e) => setDraftObservations(e.target.value)}
                  placeholder="Incluso taxas, impostos, etc..."
                />
              </div>
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="w-2/3 bg-slate-900 overflow-y-auto flex justify-center p-8 custom-scrollbar">
            <div className="bg-white shadow-2xl shrink-0" id="pdf-preview-content" style={{ width: '794px', minHeight: '1123px' }}>
              <PrintView 
                caravan={caravan} 
                result={result} 
                draftName={draftName}
                draftTravelerQuantity={draftTravelerQuantity}
                draftIndividualPrice={String(draftIndividualPrice)}
                draftTotalPrice={String(draftTotalPrice)}
                draftObservations={draftObservations}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-700 bg-slate-800/80 flex justify-between items-center">
          <button onClick={onClose} className="px-6 py-2.5 text-slate-300 hover:text-white transition-colors font-medium">Cancelar</button>
          <button 
            onClick={generatePDF}
            disabled={isExporting}
            className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
            <span>{isExporting ? 'Gerando PDF...' : 'Baixar PDF Oficial'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
