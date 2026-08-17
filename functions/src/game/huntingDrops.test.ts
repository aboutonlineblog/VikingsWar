import { huntingRewardsToCurrencies, rollHuntingDrops } from './huntingDrops';
import type { HuntingDrops } from '../../../shared/types';
import { createRng } from './rng';

const drops: HuntingDrops = {
  experience: { min: 22, max: 50 },
  silver: { min: 15, max: 36 },
  gold: { min: 0, max: 0 },
  materials: { pool: ['meat', 'herbs', 'wood'] },
};

describe('rollHuntingDrops', () => {
  const rng = createRng(7);

  it('rolls within configured ranges', () => {
    const rewards = rollHuntingDrops(drops, rng);
    expect(rewards.xp).toBeGreaterThanOrEqual(22);
    expect(rewards.xp).toBeLessThanOrEqual(50);
    expect(rewards.silver).toBeGreaterThanOrEqual(15);
    expect(rewards.silver).toBeLessThanOrEqual(36);
    expect(rewards.gold).toBeUndefined();
  });

  it('always grants one material from the pool', () => {
    const rewards = rollHuntingDrops(drops, createRng(1));
    const materialCount =
      (rewards.meat ?? 0) + (rewards.herbs ?? 0) + (rewards.wood ?? 0);
    expect(materialCount).toBe(1);
  });

  it('includes gold when range allows it', () => {
    const goldDrops: HuntingDrops = {
      ...drops,
      gold: { min: 8, max: 22 },
    };
    const rewards = rollHuntingDrops(goldDrops, createRng(3));
    expect(rewards.gold).toBeGreaterThanOrEqual(8);
    expect(rewards.gold).toBeLessThanOrEqual(22);
  });

  it('maps rewards into currency deltas', () => {
    const rewards = rollHuntingDrops(drops, createRng(5));
    const currencies = huntingRewardsToCurrencies(rewards);
    expect(currencies.silver).toBe(rewards.silver);
  });
});
