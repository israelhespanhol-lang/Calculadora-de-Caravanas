import Decimal from 'decimal.js';
import type { OperationItem } from '../features/caravan/types';
import { parsePercentage, toDecimal } from './decimal';

export interface OperationCostsResult {
  totalUnitarioMoeda: Decimal;
  totalGrupoMoeda: Decimal;
  totalUnitarioRealSemRemessa: Decimal;
  totalGrupoRealSemRemessa: Decimal;
  custoRemessaUnitario: Decimal;
  custoRemessaGrupo: Decimal;
  custoOperacaoUnitarioComRemessa: Decimal;
  custoOperacaoGrupoComRemessa: Decimal;
}

export const calculateOperationCosts = (
  items: OperationItem[],
  defaultTravelers: string | number,
  exchangeRate: string | number,
  iofPercentage: string | number,
  irRemittancePercentage: string | number
): OperationCostsResult => {
  const defaultQuantity = toDecimal(defaultTravelers);
  const cotacao = toDecimal(exchangeRate);
  
  const percentualIOF = parsePercentage(iofPercentage);
  const percentualIR = parsePercentage(irRemittancePercentage);
  const percentualTotalRemessa = percentualIOF.plus(percentualIR);

  let totalUnitarioMoeda = toDecimal(0);
  let totalGrupoMoeda = toDecimal(0);

  items.forEach(item => {
    if (item.isActive) {
      // Se quantidade for null ou string vazia (assumindo checkbox marcado para usar padrão)
      const qty = item.quantity !== null && item.quantity !== '' 
        ? toDecimal(item.quantity) 
        : defaultQuantity;
      
      const unitCost = toDecimal(item.unitCost);
      const totalItem = qty.times(unitCost);

      totalUnitarioMoeda = totalUnitarioMoeda.plus(unitCost);
      totalGrupoMoeda = totalGrupoMoeda.plus(totalItem);
    }
  });

  const totalUnitarioRealSemRemessa = totalUnitarioMoeda.times(cotacao);
  const totalGrupoRealSemRemessa = totalGrupoMoeda.times(cotacao);

  const custoRemessaUnitario = totalUnitarioRealSemRemessa.times(percentualTotalRemessa);
  const custoRemessaGrupo = totalGrupoRealSemRemessa.times(percentualTotalRemessa);

  const custoOperacaoUnitarioComRemessa = totalUnitarioRealSemRemessa.plus(custoRemessaUnitario);
  const custoOperacaoGrupoComRemessa = totalGrupoRealSemRemessa.plus(custoRemessaGrupo);

  return {
    totalUnitarioMoeda,
    totalGrupoMoeda,
    totalUnitarioRealSemRemessa,
    totalGrupoRealSemRemessa,
    custoRemessaUnitario,
    custoRemessaGrupo,
    custoOperacaoUnitarioComRemessa,
    custoOperacaoGrupoComRemessa
  };
};
