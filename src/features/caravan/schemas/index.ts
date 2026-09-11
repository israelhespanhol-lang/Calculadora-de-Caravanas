import { z } from 'zod';

const decimalString = z.string().regex(/^\d+(\.\d+)?$/, { message: 'Must be a valid positive number (use dot for decimal)' });

export const corporateCostsSchema = z.object({
  custoFixoMensal: decimalString,
  marketing: decimalString,
  sistema: decimalString,
  outrosCorporativos1: decimalString,
  outrosCorporativos2: decimalString,
  outrosCorporativos3: decimalString,
  horasMensais: decimalString.refine(val => parseFloat(val) > 0, 'Must be greater than 0'),
});

export const defaultPercentagesSchema = z.object({
  imposto: decimalString,
  comissaoUltravel: decimalString,
  traderCaptador: decimalString,
  iof: decimalString,
  impostoRendaRemessa: decimalString,
});

export const settingsSchema = z.object({
  corporateCosts: corporateCostsSchema,
  defaultPercentages: defaultPercentagesSchema,
});

// Since the whole form can be massive, we will just use a generic one or rely on types and custom validations for now, 
// but Zod is here if we want to add strict validation.

export const caravanSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  travelerQuantity: z.string().refine(val => parseInt(val, 10) > 0, 'Must have at least 1 traveler'),
  responsible: z.string(),
  creationDate: z.string(),
  quoteDate: z.string(),
  observations: z.string(),

  currency: z.string(),
  exchangeRate: decimalString.refine(val => parseFloat(val) > 0, 'Exchange rate must be > 0'),

  projectHours: decimalString,
  designerFixed: decimalString,
  otherFixed2: decimalString,
  otherFixed3: decimalString,

  mentorCost: decimalString,

  tourLeaderCosts: z.object({
    aereo: decimalString,
    hotel: decimalString,
    seguro: decimalString,
    outros: decimalString,
  })
});
