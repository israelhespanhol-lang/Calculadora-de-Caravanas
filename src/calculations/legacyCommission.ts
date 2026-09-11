import Decimal from 'decimal.js';

/**
 * Calculates the legacy Ultravel Commission based on the exact formula from the spreadsheet.
 * 
 * IMPORTANT: This formula purposefully includes fixed values (designer, outros2, outros3)
 * into the commission base, but does NOT subtract them at the end. This is a known
 * quirk from the original spreadsheet ("SIMULADOR CARAVANA - ULTRAVELrev1.xlsx") 
 * that must be preserved as per requirements.
 */
export const LEGACY_ULTRAVEL_COMMISSION = (
  custoOperacao: Decimal,
  custoInternoProjeto: Decimal,
  valorImpostoOperacao: Decimal,
  designerValorFixo: Decimal,
  outros2ValorFixo: Decimal,
  outros3ValorFixo: Decimal,
  percentualComissaoUltravel: Decimal
): Decimal => {
  // baseComissao = custoOperacao + custoInternoProjeto + valorImpostoOperacao + designerValorFixo + outros2ValorFixo + outros3ValorFixo
  const baseComissao = custoOperacao
    .plus(custoInternoProjeto)
    .plus(valorImpostoOperacao)
    .plus(designerValorFixo)
    .plus(outros2ValorFixo)
    .plus(outros3ValorFixo);

  const divisor = new Decimal(1).minus(percentualComissaoUltravel);
  
  if (divisor.isZero()) {
    // Evitar divisão por zero se a comissão for 100%
    return new Decimal(0);
  }

  // comissaoUltravelLegada = baseComissao / (1 - percentualComissaoUltravel) - custoOperacao - custoInternoProjeto - valorImpostoOperacao
  const comissaoUltravelLegada = baseComissao.dividedBy(divisor)
    .minus(custoOperacao)
    .minus(custoInternoProjeto)
    .minus(valorImpostoOperacao);

  return comissaoUltravelLegada;
};
