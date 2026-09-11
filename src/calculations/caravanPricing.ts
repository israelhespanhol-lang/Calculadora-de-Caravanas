import Decimal from 'decimal.js';
import type { TourLeaderCosts, FinalNetCosts } from '../features/caravan/types';
import { parsePercentage, toDecimal } from './decimal';
import { LEGACY_ULTRAVEL_COMMISSION } from './legacyCommission';

export interface CaravanPricingResult {
  custoInternoProjeto: Decimal;
  valorImpostoOperacao: Decimal;
  designerEfetivo: Decimal;
  outros2Efetivo: Decimal;
  outros3Efetivo: Decimal;
  comissaoUltravel: Decimal;
  traderCaptador: Decimal;
  totalOperacaoCaravana: Decimal;
  
  tourLeaderComImposto: Decimal;
  mentorComImposto: Decimal;

  valorVendaCaravana: Decimal;
  valorVendaIndividual: Decimal;
}



export const calculateCaravanPricing = (
  custoOperacao: Decimal,
  horasProjeto: string | number,
  custoHoraUltravel: Decimal,
  impostoPercentage: string | number,
  designerFixed: string | number,
  // O percentual não foi especificado nos exemplos de Designer/Outros 2/Outros 3 
  // exceto que pode ser fixo ou percentual de gross-up. 
  // Na planilha só tem fixo para esses no exemplo. Vamos assumir 0% se houver fixo.
  // Como o usuário só preenche um ou outro, deixaremos a variável de percentual = 0 para eles por enquanto.
  outros2Fixed: string | number,
  outros3Fixed: string | number,
  comissaoUltravelPercentage: string | number,
  traderCaptadorPercentage: string | number,
  tourLeaderCosts: TourLeaderCosts,
  mentorCost: string | number,
  travelerQuantity: string | number,
  freePassengers: string | number,
  finalNetCosts?: FinalNetCosts
): CaravanPricingResult => {
  
  const impostoPerc = parsePercentage(impostoPercentage);
  const comissaoUltravelPerc = parsePercentage(comissaoUltravelPercentage);
  const captadorPerc = parsePercentage(traderCaptadorPercentage);
  
  // 6.3 Horas do projeto
  const hProjeto = toDecimal(horasProjeto);
  const custoInternoProjeto = custoHoraUltravel.times(hProjeto);

  // 6.4 Imposto da operação (gross-up em cima do custo da operação apenas, conforme instrução)
  const divisorImposto = new Decimal(1).minus(impostoPerc);
  const valorImpostoOperacao = divisorImposto.isZero() ? new Decimal(0) : custoOperacao.dividedBy(divisorImposto).minus(custoOperacao);

  // 6.5 Designer e outros custos
  // Para fins do exemplo fornecido pelo usuário, todos esses foram passados como valor fixo.
  // O requisito diz: "se valorFixo > 0 ... senao: novoTotal = totalAnterior / (1 - percentual)".
  // Como não temos percentual pra eles no payload básico, passaremos 0.
  const dFixed = toDecimal(designerFixed);
  const o2Fixed = toDecimal(outros2Fixed);
  const o3Fixed = toDecimal(outros3Fixed);

  // Nota: O exemplo não deixa claro se esses "totalAnterior" se acumulam linha a linha, 
  // mas como só pediu fixo com prioridade, e a regra de gross-up para eles não 
  // está explícita de sobre qual base incide, no exemplo "Designer = R$ 500,00" é direto 500.
  const designerEfetivo = dFixed;
  const outros2Efetivo = o2Fixed;
  const outros3Efetivo = o3Fixed;

  // 6.6 Comissão Ultravel — modo legado
  const comissaoUltravel = LEGACY_ULTRAVEL_COMMISSION(
    custoOperacao,
    custoInternoProjeto,
    valorImpostoOperacao,
    designerEfetivo,
    outros2Efetivo,
    outros3Efetivo,
    comissaoUltravelPerc
  );

  // 6.7 Trader ou captador
  const divisorCaptador = new Decimal(1).minus(captadorPerc);
  const traderCaptador = divisorCaptador.isZero() ? new Decimal(0) : comissaoUltravel.dividedBy(divisorCaptador).minus(comissaoUltravel);

  // 6.8 Total da operação da caravana
  const totalOperacaoCaravana = custoOperacao
    .plus(custoInternoProjeto)
    .plus(valorImpostoOperacao)
    .plus(designerEfetivo)
    .plus(outros2Efetivo)
    .plus(outros3Efetivo)
    .plus(comissaoUltravel)
    .plus(traderCaptador);

  // 7.1 Tour leader
  const tlTotalSemImposto = toDecimal(tourLeaderCosts.aereo)
    .plus(toDecimal(tourLeaderCosts.hotel))
    .plus(toDecimal(tourLeaderCosts.seguro))
    .plus(toDecimal(tourLeaderCosts.outros));
  
  const tourLeaderComImposto = divisorImposto.isZero() ? new Decimal(0) : tlTotalSemImposto.dividedBy(divisorImposto);

  // 7.2 Mentor
  const mentorSemImposto = toDecimal(mentorCost);
  const mentorComImposto = divisorImposto.isZero() ? new Decimal(0) : mentorSemImposto.dividedBy(divisorImposto);

  // 8. PREÇO FINAL BASE
  let valorVendaCaravanaBase = totalOperacaoCaravana
    .plus(tourLeaderComImposto)
    .plus(mentorComImposto);

  const travelers = toDecimal(travelerQuantity);
  const frees = toDecimal(freePassengers);
  const payingTravelers = travelers.minus(frees);
  
  // Rateio inteligente das cortesias: O custo total do grupo continua sendo para todos, 
  // mas o valor individual de venda é rateado apenas entre os pagantes.
  let valorVendaIndividualBase = payingTravelers.greaterThan(0) 
    ? valorVendaCaravanaBase.dividedBy(payingTravelers)
    : new Decimal(0);

  // 9. CUSTOS LÍQUIDOS ADICIONAIS (Por pessoa)
  let totalAdicionaisLiquidosUnitario = new Decimal(0);
  if (finalNetCosts) {
    totalAdicionaisLiquidosUnitario = toDecimal(finalNetCosts.seguroViagem)
      .plus(toDecimal(finalNetCosts.brinde))
      .plus(toDecimal(finalNetCosts.aereo))
      .plus(toDecimal(finalNetCosts.fee));
  }

  // O custo dos adicionais líquidos se aplica a TODOS os passageiros (inclusive os frees que precisam de aéreo/seguro)
  const totalCustoLiquidoCaravana = totalAdicionaisLiquidosUnitario.times(travelers);

  // Esse custo total dos adicionais é rateado entre os PAGANTES
  const rateioCustoLiquido = payingTravelers.greaterThan(0)
    ? totalCustoLiquidoCaravana.dividedBy(payingTravelers)
    : new Decimal(0);

  const valorVendaIndividual = valorVendaIndividualBase.plus(rateioCustoLiquido);
  
  // O valor total de venda da caravana soma o custo de todos
  const valorVendaCaravana = valorVendaCaravanaBase.plus(totalCustoLiquidoCaravana);

  return {
    custoInternoProjeto,
    valorImpostoOperacao,
    designerEfetivo,
    outros2Efetivo,
    outros3Efetivo,
    comissaoUltravel,
    traderCaptador,
    totalOperacaoCaravana,
    tourLeaderComImposto,
    mentorComImposto,
    valorVendaCaravana,
    valorVendaIndividual
  };
};
