import type { Currencies } from '../../../shared/types';

export const EMPTY_CURRENCIES: Currencies = {
  silver: 0,
  gold: 0,
  food: 0,
  wood: 0,
  iron: 0,
  meat: 0,
  herbs: 0,
  ironPlate: 0,
  bronzePlate: 0,
  silverPlate: 0,
  goldPlate: 0,
  runes: 0,
  eventCurrency: 0,
};

export function normalizeCurrencies(raw: Partial<Currencies> | undefined): Currencies {
  return {
    silver: raw?.silver ?? 0,
    gold: raw?.gold ?? 0,
    food: raw?.food ?? 0,
    wood: raw?.wood ?? 0,
    iron: raw?.iron ?? 0,
    meat: raw?.meat ?? 0,
    herbs: raw?.herbs ?? 0,
    ironPlate: raw?.ironPlate ?? 0,
    bronzePlate: raw?.bronzePlate ?? 0,
    silverPlate: raw?.silverPlate ?? 0,
    goldPlate: raw?.goldPlate ?? 0,
    runes: raw?.runes ?? 0,
    eventCurrency: raw?.eventCurrency ?? 0,
  };
}

export function addCurrencies(
  base: Currencies,
  delta: Partial<Currencies>,
): Currencies {
  return {
    silver: base.silver + (delta.silver ?? 0),
    gold: base.gold + (delta.gold ?? 0),
    food: base.food + (delta.food ?? 0),
    wood: base.wood + (delta.wood ?? 0),
    iron: base.iron + (delta.iron ?? 0),
    meat: base.meat + (delta.meat ?? 0),
    herbs: base.herbs + (delta.herbs ?? 0),
    ironPlate: base.ironPlate + (delta.ironPlate ?? 0),
    bronzePlate: base.bronzePlate + (delta.bronzePlate ?? 0),
    silverPlate: base.silverPlate + (delta.silverPlate ?? 0),
    goldPlate: base.goldPlate + (delta.goldPlate ?? 0),
    runes: base.runes + (delta.runes ?? 0),
    eventCurrency: base.eventCurrency + (delta.eventCurrency ?? 0),
  };
}

export function subtractCurrencies(
  base: Currencies,
  delta: Partial<Currencies>,
): Currencies {
  const next = addCurrencies(base, {
    silver: -(delta.silver ?? 0),
    gold: -(delta.gold ?? 0),
    food: -(delta.food ?? 0),
    wood: -(delta.wood ?? 0),
    iron: -(delta.iron ?? 0),
    meat: -(delta.meat ?? 0),
    herbs: -(delta.herbs ?? 0),
    ironPlate: -(delta.ironPlate ?? 0),
    bronzePlate: -(delta.bronzePlate ?? 0),
    silverPlate: -(delta.silverPlate ?? 0),
    goldPlate: -(delta.goldPlate ?? 0),
    runes: -(delta.runes ?? 0),
    eventCurrency: -(delta.eventCurrency ?? 0),
  });
  if (Object.values(next).some((value) => value < 0)) {
    throw new Error('INSUFFICIENT_CURRENCY');
  }
  return next;
}

export function canAfford(base: Currencies, cost: Partial<Currencies>): boolean {
  try {
    subtractCurrencies(base, cost);
    return true;
  } catch {
    return false;
  }
}
