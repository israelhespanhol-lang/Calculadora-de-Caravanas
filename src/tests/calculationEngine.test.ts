import { describe, it, expect } from 'vitest';
import { calculateCaravan } from '../calculations/calculationEngine';
import type { CaravanData } from '../features/caravan/types';
import Decimal from 'decimal.js';

describe('Calculation Engine - Mandatory Regression Scenario', () => {
  it('should match the spreadsheet exact values', () => {
    const input: CaravanData = {
      id: 'test-1',
      name: 'Caravana Teste',
      travelerQuantity: '20',
      freePassengerRule: 'manual',
      freePassengerRatio: '15',
      freePassengers: '0',
      responsible: 'Admin',
      creationDate: '2026-09-11',
      quoteDate: '2026-09-11',
      observations: '',
      currency: 'USD',
      exchangeRate: '5.26',
      projectHours: '3',
      designerFixed: '500',
      otherFixed2: '0',
      otherFixed3: '0',
      mentorCost: '20000',
      calculationVersion: 'legacy-v1',
      corporateCostsSnapshot: {
        custoFixoMensal: '158920.10',
        marketing: '4000',
        sistema: '1000',
        outrosCorporativos1: '0',
        outrosCorporativos2: '0',
        outrosCorporativos3: '0',
        horasMensais: '220',
      },
      percentagesSnapshot: {
        imposto: '5',
        comissaoUltravel: '20',
        traderCaptador: '15',
        iof: '3.5',
        impostoRendaRemessa: '7',
        exchangeSpread: '0',
        exchangeIOF: '0',
      },
      operationItems: [
        { id: '1', description: 'Hotelaria', quantity: null, unitCost: '600', isActive: true },
        { id: '2', description: 'Transfer', quantity: null, unitCost: '180', isActive: true },
        { id: '3', description: 'Guias', quantity: null, unitCost: '100', isActive: true },
        { id: '4', description: 'Tickets', quantity: null, unitCost: '200', isActive: true },
      ],
      tourLeaderCosts: {
        aereo: '2000',
        hotel: '1000',
        seguro: '300',
        outros: '1000',
      },
      finalNetCosts: {
        seguroViagem: '0',
        brinde: '0',
        aereo: '0',
        fee: '0'
      }
    };

    const result = calculateCaravan(input);

    // 1. Corporate costs
    expect(result.totalCustoMensal).toBe('163920.1');
    expect(new Decimal(result.custoHoraUltravel).toFixed(10)).toBe('745.0913636364');

    // 2. Operation Costs
    expect(result.totalGrupoMoeda).toBe('21600');
    expect(result.totalGrupoRealSemRemessa).toBe('113616');
    expect(result.custoRemessaGrupo).toBe('11929.68');
    expect(result.custoOperacaoGrupoComRemessa).toBe('125545.68');

    // 3. Caravan Pricing
    expect(Number(result.custoInternoProjeto)).toBeCloseTo(2235.2740909091, 8);
    expect(Number(result.valorImpostoOperacao)).toBeCloseTo(6607.6673684211, 8);
    expect(Number(result.comissaoUltravel)).toBeCloseTo(34222.1553648325, 8);
    expect(Number(result.traderCaptador)).toBeCloseTo(6039.2038879116, 8);

    expect(Number(result.totalOperacaoCaravana)).toBeCloseTo(175149.9807120743, 8);
    expect(Number(result.tourLeaderComImposto)).toBeCloseTo(4526.3157894737, 8);
    expect(Number(result.mentorComImposto)).toBeCloseTo(21052.6315789474, 8);

    expect(Number(result.valorVendaCaravana)).toBeCloseTo(200728.9280804953, 8);
    expect(Number(result.valorVendaIndividual)).toBeCloseTo(10036.4464040248, 8);

    // Test presentation rounding specifically requested in the prompt
    expect(new Decimal(result.totalOperacaoCaravana).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toString()).toBe('175149.98');
    expect(new Decimal(result.tourLeaderComImposto).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toString()).toBe('4526.32');
    expect(new Decimal(result.mentorComImposto).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toString()).toBe('21052.63');
    expect(new Decimal(result.valorVendaCaravana).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toString()).toBe('200728.93');
    expect(new Decimal(result.valorVendaIndividual).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toString()).toBe('10036.45');
  });

  it('should handle zero travelers safely', () => {
    const input: CaravanData = {
      // ... same data but 0 travelers
      id: 'test-2',
      name: 'Caravana Zero',
      travelerQuantity: '0',
      freePassengerRule: 'manual',
      freePassengerRatio: '15',
      freePassengers: '0',
      responsible: '',
      creationDate: '',
      quoteDate: '',
      observations: '',
      currency: 'USD',
      exchangeRate: '5',
      projectHours: '0',
      designerFixed: '0',
      otherFixed2: '0',
      otherFixed3: '0',
      mentorCost: '0',
      calculationVersion: 'legacy-v1',
      corporateCostsSnapshot: { custoFixoMensal: '0', marketing: '0', sistema: '0', outrosCorporativos1: '0', outrosCorporativos2: '0', outrosCorporativos3: '0', horasMensais: '220' },
      percentagesSnapshot: { imposto: '0', comissaoUltravel: '0', traderCaptador: '0', iof: '0', impostoRendaRemessa: '0', exchangeSpread: '0', exchangeIOF: '0' },
      operationItems: [],
      tourLeaderCosts: { aereo: '0', hotel: '0', seguro: '0', outros: '0' },
      finalNetCosts: { seguroViagem: '0', brinde: '0', aereo: '0', fee: '0' }
    };

    const result = calculateCaravan(input);
    expect(result.valorVendaIndividual).toBe('0');
  });
});
