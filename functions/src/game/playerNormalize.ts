import type { Player } from '../../../shared/types';
import { emptyEquipment } from '../../../shared/types';
import { normalizeCurrencies } from './economy';

export function normalizePlayer(raw: Player): Player {
  return {
    ...raw,
    speed: raw.speed ?? 0,
    equipment: { ...emptyEquipment(), ...(raw.equipment ?? {}) },
    activeBattle: raw.activeBattle ?? null,
    currencies: normalizeCurrencies(raw.currencies),
  };
}
