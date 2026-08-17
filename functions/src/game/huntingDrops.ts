import type { HuntingDrops, HuntingMaterialId, HuntingRewards } from '../../../shared/types';
import type { Rng } from './rng';

function rollRange(min: number, max: number, rng: Rng): number {
  if (max <= min) {
    return min;
  }
  return min + Math.floor(rng.next() * (max - min + 1));
}

function pickMaterial(pool: HuntingMaterialId[], rng: Rng): HuntingMaterialId {
  const index = Math.floor(rng.next() * pool.length);
  return pool[index] ?? pool[0];
}

export function rollHuntingDrops(
  drops: HuntingDrops,
  rng: Rng,
): HuntingRewards {
  const xp = rollRange(drops.experience.min, drops.experience.max, rng);
  const silver = rollRange(drops.silver.min, drops.silver.max, rng);
  const gold = rollRange(drops.gold.min, drops.gold.max, rng);
  const material = pickMaterial(drops.materials.pool, rng);

  const rewards: HuntingRewards = { xp, silver };
  if (gold > 0) {
    rewards.gold = gold;
  }
  rewards[material] = 1;
  return rewards;
}

export function huntingRewardsToCurrencies(
  rewards: HuntingRewards,
): Partial<Record<keyof import('../../../shared/types').Currencies, number>> {
  return {
    silver: rewards.silver,
    gold: rewards.gold,
    meat: rewards.meat,
    herbs: rewards.herbs,
    wood: rewards.wood,
    ironPlate: rewards.ironPlate,
    bronzePlate: rewards.bronzePlate,
    silverPlate: rewards.silverPlate,
    goldPlate: rewards.goldPlate,
  };
}
