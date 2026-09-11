import type { CaravanData, CaravanCalculationResult, CalculationMemoryItem } from '../features/caravan/types';
import { calculateCorporateCosts } from './corporateCosts';
import { calculateOperationCosts } from './operationCosts';
import { calculateCaravanPricing } from './caravanPricing';

export const calculateCaravan = (data: CaravanData): CaravanCalculationResult => {
  const memory: CalculationMemoryItem[] = [];

  const addMemory = (desc: string, formula: string, value: string, result: string, indent: number = 0) => {
    memory.push({ description: desc, formula, valueUsed: value, result, indentationLevel: indent });
  };

  // 1. Corporate Costs
  const corporateCosts = calculateCorporateCosts(data.corporateCostsSnapshot);
  
  addMemory(
    "Custo Mensal Ultravel", 
    "Fixo + Mkt + Sist + Outros1 + Outros2 + Outros3", 
    `R$ ${data.corporateCostsSnapshot.custoFixoMensal} + R$ ${data.corporateCostsSnapshot.marketing} + ...`,
    `R$ ${corporateCosts.totalCustoMensal.toFixed(2)}`
  );

  addMemory(
    "Custo Hora Ultravel", 
    "Total Mensal / Horas Mensais", 
    `R$ ${corporateCosts.totalCustoMensal.toFixed(2)} / ${data.corporateCostsSnapshot.horasMensais}h`,
    `R$ ${corporateCosts.custoHoraUltravel.toFixed(10)}`
  );

  // 2. Operation Costs
  const operationCosts = calculateOperationCosts(
    data.operationItems,
    data.travelerQuantity,
    data.exchangeRate,
    data.percentagesSnapshot.iof,
    data.percentagesSnapshot.impostoRendaRemessa,
    data.percentagesSnapshot.exchangeSpread
  );

  addMemory(
    "Total Operação em Moeda Estrangeira", 
    "Soma dos custos totais dos itens ativos", 
    `${data.currency} unitários somados`,
    `${data.currency} ${operationCosts.totalGrupoMoeda.toFixed(2)}`
  );

  addMemory(
    "Total Operação em Real (sem remessa)", 
    "Total Grupo Moeda × Cotação", 
    `${data.currency} ${operationCosts.totalGrupoMoeda.toFixed(2)} × R$ ${data.exchangeRate}`,
    `R$ ${operationCosts.totalGrupoRealSemRemessa.toFixed(2)}`
  );

  addMemory(
    "Custo de Remessa (IOF + IR)", 
    "Total Real × (IOF + IR)", 
    `R$ ${operationCosts.totalGrupoRealSemRemessa.toFixed(2)} × (${data.percentagesSnapshot.iof}% + ${data.percentagesSnapshot.impostoRendaRemessa}%)`,
    `R$ ${operationCosts.custoRemessaGrupo.toFixed(2)}`
  );

  addMemory(
    "Custo Operação (com Remessa)", 
    "Total Real + Custo Remessa", 
    `R$ ${operationCosts.totalGrupoRealSemRemessa.toFixed(2)} + R$ ${operationCosts.custoRemessaGrupo.toFixed(2)}`,
    `R$ ${operationCosts.custoOperacaoGrupoComRemessa.toFixed(2)}`
  );

  // 3. Caravan Pricing
  const pricing = calculateCaravanPricing(
    operationCosts.custoOperacaoGrupoComRemessa,
    data.projectHours,
    corporateCosts.custoHoraUltravel,
    data.percentagesSnapshot.imposto,
    data.designerFixed,
    data.otherFixed2,
    data.otherFixed3,
    data.percentagesSnapshot.comissaoUltravel,
    data.percentagesSnapshot.traderCaptador,
    data.tourLeaderCosts,
    data.mentorCost,
    data.travelerQuantity,
    data.freePassengers || '0',
    data.finalNetCosts
  );

  addMemory(
    "Custo Interno do Projeto (Horas)", 
    "Custo Hora × Horas do Projeto", 
    `R$ ${corporateCosts.custoHoraUltravel.toFixed(10)} × ${data.projectHours}h`,
    `R$ ${pricing.custoInternoProjeto.toFixed(2)}`
  );

  addMemory(
    "Imposto da Operação (Gross-up)", 
    "Custo Operação / (1 - Imposto%) - Custo Operação", 
    `R$ ${operationCosts.custoOperacaoGrupoComRemessa.toFixed(2)} com imposto de ${data.percentagesSnapshot.imposto}%`,
    `R$ ${pricing.valorImpostoOperacao.toFixed(2)}`
  );

  addMemory(
    "Designer", 
    "Valor Fixo", 
    `R$ ${data.designerFixed}`,
    `R$ ${pricing.designerEfetivo.toFixed(2)}`
  );

  addMemory(
    "Comissão Ultravel (Legada)", 
    "Base / (1 - %Comissão) - Base (parcial)", 
    `% = ${data.percentagesSnapshot.comissaoUltravel}%`,
    `R$ ${pricing.comissaoUltravel.toFixed(2)}`
  );

  addMemory(
    "Trader/Captador", 
    "Comissão Ultravel / (1 - %Captador) - Comissão Ultravel", 
    `% = ${data.percentagesSnapshot.traderCaptador}%`,
    `R$ ${pricing.traderCaptador.toFixed(2)}`
  );

  addMemory(
    "Total Operação Caravana", 
    "Soma dos custos base, impostos, taxas, designer e comissões", 
    `-`,
    `R$ ${pricing.totalOperacaoCaravana.toFixed(2)}`
  );

  addMemory(
    "Tour Leader (com imposto)", 
    "Soma Gastos TL / (1 - Imposto%)", 
    `-`,
    `R$ ${pricing.tourLeaderComImposto.toFixed(2)}`
  );

  addMemory(
    "Mentor (com imposto)", 
    "Custo Mentor / (1 - Imposto%)", 
    `R$ ${data.mentorCost} com imposto de ${data.percentagesSnapshot.imposto}%`,
    `R$ ${pricing.mentorComImposto.toFixed(2)}`
  );

  addMemory(
    "Valor de Venda (Total)", 
    "Total Operação + Tour Leader + Mentor", 
    `-`,
    `R$ ${pricing.valorVendaCaravana.toFixed(2)}`
  );

  addMemory(
    "Valor Individual (Por Viajante)", 
    "Valor de Venda / Quantidade de Viajantes", 
    `R$ ${pricing.valorVendaCaravana.toFixed(2)} / ${data.travelerQuantity}`,
    `R$ ${pricing.valorVendaIndividual.toFixed(2)}`
  );

  return {
    totalCustoMensal: corporateCosts.totalCustoMensal.toString(),
    custoHoraUltravel: corporateCosts.custoHoraUltravel.toString(),

    totalUnitarioMoeda: operationCosts.totalUnitarioMoeda.toString(),
    totalGrupoMoeda: operationCosts.totalGrupoMoeda.toString(),
    totalUnitarioRealSemRemessa: operationCosts.totalUnitarioRealSemRemessa.toString(),
    totalGrupoRealSemRemessa: operationCosts.totalGrupoRealSemRemessa.toString(),
    custoRemessaUnitario: operationCosts.custoRemessaUnitario.toString(),
    custoRemessaGrupo: operationCosts.custoRemessaGrupo.toString(),
    custoOperacaoUnitarioComRemessa: operationCosts.custoOperacaoUnitarioComRemessa.toString(),
    custoOperacaoGrupoComRemessa: operationCosts.custoOperacaoGrupoComRemessa.toString(),

    custoInternoProjeto: pricing.custoInternoProjeto.toString(),
    valorImpostoOperacao: pricing.valorImpostoOperacao.toString(),
    designerEfetivo: pricing.designerEfetivo.toString(),
    outros2Efetivo: pricing.outros2Efetivo.toString(),
    outros3Efetivo: pricing.outros3Efetivo.toString(),
    comissaoUltravel: pricing.comissaoUltravel.toString(),
    traderCaptador: pricing.traderCaptador.toString(),
    totalOperacaoCaravana: pricing.totalOperacaoCaravana.toString(),
    
    tourLeaderComImposto: pricing.tourLeaderComImposto.toString(),
    mentorComImposto: pricing.mentorComImposto.toString(),

    valorVendaCaravana: pricing.valorVendaCaravana.toString(),
    valorVendaIndividual: pricing.valorVendaIndividual.toString(),

    memory
  };
};
