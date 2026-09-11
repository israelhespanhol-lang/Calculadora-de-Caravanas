export interface CorporateCosts {
  custoFixoMensal: string;
  marketing: string;
  sistema: string;
  outrosCorporativos1: string;
  outrosCorporativos2: string;
  outrosCorporativos3: string;
  horasMensais: string;
}

export interface DefaultPercentages {
  imposto: string;
  comissaoUltravel: string;
  traderCaptador: string;
  iof: string;
  impostoRendaRemessa: string;
  exchangeSpread: string;
  exchangeIOF: string;
}

export interface Settings {
  corporateCosts: CorporateCosts;
  defaultPercentages: DefaultPercentages;
}

export interface OperationItem {
  id: string;
  description: string;
  quantity: string | null; // null means use group standard quantity
  unitCost: string;
  isActive: boolean;
}

export interface TourLeaderCosts {
  aereo: string;
  hotel: string;
  seguro: string;
  outros: string;
}

export interface FinalNetCosts {
  seguroViagem: string;
  brinde: string;
  aereo: string;
  fee: string;
}

export interface CaravanData {
  id: string;
  name: string;
  travelerQuantity: string;
  freePassengers: string;
  responsible: string;
  creationDate: string;
  quoteDate: string;
  observations: string;

  // Operation Costs Tab
  currency: string;
  exchangeRate: string;
  operationItems: OperationItem[];

  // Caravan Tab
  projectHours: string;
  designerFixed: string;
  otherFixed2: string;
  otherFixed3: string;
  
  tourLeaderCosts: TourLeaderCosts;
  mentorCost: string;
  
  finalNetCosts?: FinalNetCosts;

  // Snapshots of the settings used when the project was created/updated
  corporateCostsSnapshot: CorporateCosts;
  percentagesSnapshot: DefaultPercentages;
  
  calculationVersion: string;
}

export interface CalculationMemoryItem {
  description: string;
  formula: string;
  valueUsed: string;
  result: string;
  indentationLevel?: number;
}

export interface CaravanCalculationResult {
  // Corporate results
  totalCustoMensal: string;
  custoHoraUltravel: string;

  // Operation Costs results
  totalUnitarioMoeda: string;
  totalGrupoMoeda: string;
  totalUnitarioRealSemRemessa: string;
  totalGrupoRealSemRemessa: string;
  custoRemessaUnitario: string;
  custoRemessaGrupo: string;
  custoOperacaoUnitarioComRemessa: string;
  custoOperacaoGrupoComRemessa: string;

  // Caravan Pricing results
  custoInternoProjeto: string;
  valorImpostoOperacao: string;
  designerEfetivo: string;
  outros2Efetivo: string;
  outros3Efetivo: string;
  comissaoUltravel: string;
  traderCaptador: string;
  totalOperacaoCaravana: string;
  
  tourLeaderComImposto: string;
  mentorComImposto: string;

  // Final Pricing
  valorVendaCaravana: string;
  valorVendaIndividual: string;

  memory: CalculationMemoryItem[];
}
