import type { CreatureType } from '../../../shared/types';

export interface CreatureCombatStats {
  attack: number;
  defense: number;
  health: number;
  speed: number;
  staminaCost: number;
}

export function computeCreatureStats(
  level: number,
  type: CreatureType,
  name: string,
): CreatureCombatStats {
  let attack = 8 + level * 4;
  let defense = 3 + level * 3;
  let health = 25 + level * 13;
  let speed = 6 + Math.round(level * 1.2);

  if (type === 'monster') {
    attack = Math.round(attack * 1.1);
    defense = Math.round(defense * 1.05);
  }
  if (name.includes('Dire')) {
    attack = Math.round(attack * 1.15);
    defense = Math.round(defense * 1.15);
    health = Math.round(health * 1.15);
  }
  if (name.includes('Ancient')) {
    attack = Math.round(attack * 1.2);
    defense = Math.round(defense * 1.2);
    health = Math.round(health * 1.2);
  }
  if (name.includes('Armored')) {
    defense = Math.round(defense * 1.25);
  }

  return {
    attack,
    defense,
    health,
    speed,
    staminaCost: Math.min(8, 1 + Math.floor(level / 15)),
  };
}

export function legacyEnemyDrops(level: number): {
  experience: { min: number; max: number };
  silver: { min: number; max: number };
  gold: { min: number; max: number };
  materials: { pool: Array<'meat' | 'herbs' | 'wood'> };
} {
  const xp = 20 + level * 5;
  const silver = 20 + level * 8;
  return {
    experience: { min: xp, max: xp + 5 },
    silver: { min: silver, max: silver + 8 },
    gold: { min: 0, max: 0 },
    materials: { pool: ['meat', 'herbs', 'wood'] },
  };
}
