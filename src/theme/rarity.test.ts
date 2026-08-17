import type { Rarity } from '@shared/types';
import { RARITY_STYLES, rarityStyle } from './rarity';

describe('rarityStyle', () => {
  it('maps every rarity to a dark border and light fill', () => {
    const expected: Record<Rarity, { border: string; fill: string }> = {
      common: { border: '#3F3F3F', fill: '#D0D0D0' },
      uncommon: { border: '#1B5E2A', fill: '#B7E0BE' },
      rare: { border: '#163A78', fill: '#B4CDEE' },
      epic: { border: '#4A1A6B', fill: '#D2B8E8' },
      legendary: { border: '#8A6A12', fill: '#E8D48A' },
      mythic: { border: '#6B1212', fill: '#E8A3A3' },
      celestial: { border: '#5C6570', fill: '#C5CDD6' },
    };

    (Object.keys(expected) as Rarity[]).forEach((rarity) => {
      const style = rarityStyle(rarity);
      expect(style.border).toBe(expected[rarity].border);
      expect(style.fill).toBe(expected[rarity].fill);
    });
  });

  it('uses a silver highlight and shade for celestial frames', () => {
    const style = rarityStyle('celestial');
    expect(style.highlight).toBe('#EEF2F6');
    expect(style.shade).toBe('#8A93A0');
  });

  it('falls back to common when rarity is missing', () => {
    expect(rarityStyle(undefined)).toEqual(RARITY_STYLES.common);
    expect(rarityStyle(null)).toEqual(RARITY_STYLES.common);
  });
});
