import type { Rarity } from '@shared/types';

export interface RarityStyle {
  border: string;
  fill: string;
  highlight?: string;
  shade?: string;
}

export const RARITY_STYLES: Record<Rarity, RarityStyle> = {
  common: {
    border: '#3F3F3F',
    fill: '#D0D0D0',
  },
  uncommon: {
    border: '#1B5E2A',
    fill: '#B7E0BE',
  },
  rare: {
    border: '#163A78',
    fill: '#B4CDEE',
  },
  epic: {
    border: '#4A1A6B',
    fill: '#D2B8E8',
  },
  legendary: {
    border: '#8A6A12',
    fill: '#E8D48A',
  },
  mythic: {
    border: '#6B1212',
    fill: '#E8A3A3',
  },
  celestial: {
    border: '#5C6570',
    fill: '#C5CDD6',
    highlight: '#EEF2F6',
    shade: '#8A93A0',
  },
};

export function rarityStyle(rarity: Rarity | null | undefined): RarityStyle {
  if (!rarity) {
    return RARITY_STYLES.common;
  }
  return RARITY_STYLES[rarity] ?? RARITY_STYLES.common;
}
