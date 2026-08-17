import type { HuntingMaterialId, HuntingRewards } from '@shared/types';

const MATERIAL_LABELS: Record<HuntingMaterialId, string> = {
  meat: 'Meat',
  herbs: 'Herbs',
  wood: 'Wood',
  ironPlate: 'Iron Plate',
  bronzePlate: 'Bronze Plate',
  silverPlate: 'Silver Plate',
  goldPlate: 'Gold Plate',
};

export function formatHuntingRewards(rewards: HuntingRewards): string {
  const parts = [`XP ${rewards.xp}`, `Silver ${rewards.silver}`];
  if (rewards.gold && rewards.gold > 0) {
    parts.push(`Gold ${rewards.gold}`);
  }
  for (const [key, label] of Object.entries(MATERIAL_LABELS) as Array<[HuntingMaterialId, string]>) {
    const amount = rewards[key];
    if (amount && amount > 0) {
      parts.push(`${label} ${amount}`);
    }
  }
  return parts.join(' · ');
}

export function isHuntingRewards(
  rewards: unknown,
): rewards is HuntingRewards {
  return (
    typeof rewards === 'object' &&
    rewards !== null &&
    'xp' in rewards &&
    'silver' in rewards
  );
}
