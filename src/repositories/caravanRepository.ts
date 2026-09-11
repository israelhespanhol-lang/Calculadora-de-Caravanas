import { v4 as uuidv4 } from 'uuid';
import type { CaravanData, Settings } from '../features/caravan/types';

const CARAVANS_KEY = '@ultravel-caravanas:projects';
const SETTINGS_KEY = '@ultravel-caravanas:settings';

export const getCaravans = (): CaravanData[] => {
  try {
    const data = localStorage.getItem(CARAVANS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error loading caravans', e);
    return [];
  }
};

export const getCaravanById = (id: string): CaravanData | undefined => {
  return getCaravans().find(c => c.id === id);
};

export const saveCaravan = (caravan: CaravanData): void => {
  try {
    const caravans = getCaravans();
    const index = caravans.findIndex(c => c.id === caravan.id);
    
    if (index >= 0) {
      caravans[index] = caravan;
    } else {
      // It's new
      if (!caravan.id) {
        caravan.id = uuidv4();
      }
      caravans.push(caravan);
    }
    
    localStorage.setItem(CARAVANS_KEY, JSON.stringify(caravans));
  } catch (e) {
    console.error('Error saving caravan', e);
  }
};

export const deleteCaravan = (id: string): void => {
  try {
    const caravans = getCaravans().filter(c => c.id !== id);
    localStorage.setItem(CARAVANS_KEY, JSON.stringify(caravans));
  } catch (e) {
    console.error('Error deleting caravan', e);
  }
};

const defaultSettings: Settings = {
  corporateCosts: {
    custoFixoMensal: '158920.10',
    marketing: '4000',
    sistema: '1000',
    outrosCorporativos1: '0',
    outrosCorporativos2: '0',
    outrosCorporativos3: '0',
    horasMensais: '220',
  },
  defaultPercentages: {
    imposto: '5',
    comissaoUltravel: '20',
    traderCaptador: '15',
    iof: '3.5',
    impostoRendaRemessa: '7',
  }
};

export const getSettings = (): Settings => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : defaultSettings;
  } catch (e) {
    console.error('Error loading settings', e);
    return defaultSettings;
  }
};

export const saveSettings = (settings: Settings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings', e);
  }
};
