import Decimal from 'decimal.js';
import type { CorporateCosts } from '../features/caravan/types';
import { toDecimal } from './decimal';

export interface CorporateCostsResult {
  totalCustoMensal: Decimal;
  custoHoraUltravel: Decimal;
}

export const calculateCorporateCosts = (costs: CorporateCosts): CorporateCostsResult => {
  const custoFixoMensal = toDecimal(costs.custoFixoMensal);
  const marketing = toDecimal(costs.marketing);
  const sistema = toDecimal(costs.sistema);
  const outros1 = toDecimal(costs.outrosCorporativos1);
  const outros2 = toDecimal(costs.outrosCorporativos2);
  const outros3 = toDecimal(costs.outrosCorporativos3);
  const horasMensais = toDecimal(costs.horasMensais);

  const totalCustoMensal = custoFixoMensal
    .plus(marketing)
    .plus(sistema)
    .plus(outros1)
    .plus(outros2)
    .plus(outros3);

  const custoHoraUltravel = horasMensais.isZero() 
    ? toDecimal(0) 
    : totalCustoMensal.dividedBy(horasMensais);

  return {
    totalCustoMensal,
    custoHoraUltravel
  };
};
