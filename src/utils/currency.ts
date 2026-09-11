import Decimal from "decimal.js";
import { toDecimal } from "../calculations/decimal";

export const formatCurrencyBRL = (value: string | number | Decimal): string => {
  const d = toDecimal(value);
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(d.toNumber());
};

export const formatCurrencyUSD = (value: string | number | Decimal): string => {
  const d = toDecimal(value);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(d.toNumber());
};

export const formatPercentage = (value: string | number | Decimal): string => {
  const d = toDecimal(value);
  return `${d.toFixed(2)}%`;
};

/**
 * Removes non-numeric characters for controlled inputs
 */
export const cleanNumberInput = (value: string): string => {
  return value.replace(/[^0-9.]/g, '');
};
