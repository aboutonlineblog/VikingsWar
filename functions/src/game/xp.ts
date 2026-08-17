export const MAX_LEVEL = 100;

export function xpToNextLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}

export interface XpApplication {
  level: number;
  xp: number;
  levelsGained: number;
}

export function applyXp(
  level: number,
  xp: number,
  gained: number,
): XpApplication {
  let newXp = xp + Math.max(0, gained);
  let newLevel = level;
  let levelsGained = 0;

  while (newLevel < MAX_LEVEL && newXp >= xpToNextLevel(newLevel)) {
    newXp -= xpToNextLevel(newLevel);
    newLevel += 1;
    levelsGained += 1;
  }

  return { level: newLevel, xp: newXp, levelsGained };
}

export function levelUpSilverReward(newLevel: number): number {
  return 50 * newLevel;
}

export function baseStatsForLevel(level: number): {
  health: number;
  attack: number;
  defense: number;
  speed: number;
} {
  return {
    health: 80 + level * 20,
    attack: 10 + level * 4,
    defense: 8 + level * 3,
    speed: 8 + level * 2,
  };
}
