import Decimal from 'decimal.js';

// Configure Decimal to have high precision for internal calculations.
// The default precision is 20, which is generally enough, but we can set it to 50
// to be absolutely safe for intermediate multiplications/divisions.
const D = Decimal.clone({ precision: 50, rounding: Decimal.ROUND_HALF_UP });

/**
 * Creates a new Decimal instance from a string or number.
 * Returns 0 if the value is invalid or empty.
 */
export const toDecimal = (value: string | number | Decimal | null | undefined): Decimal => {
  if (value === null || value === undefined || value === '') {
    return new D(0);
  }
  try {
    return new D(value);
  } catch (e) {
    return new D(0);
  }
};

/**
 * Safely parses a percentage from a string (e.g., '5' or '5.00') to a decimal ratio (e.g., 0.05).
 */
export const parsePercentage = (value: string | number): Decimal => {
  return toDecimal(value).dividedBy(100);
};

export default D;
