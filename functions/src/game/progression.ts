import type { CollectionDef, ItemDef, Player } from '../../../shared/types';
import { addCurrencies } from './economy';
import { applyCombatStats } from './stats';
import { applyXp, levelUpSilverReward } from './xp';

export function applyProgression(
  player: Player,
  xp: number,
  nowMs: number,
  itemsById: Record<string, ItemDef>,
  collections: CollectionDef[],
): Player {
  const previousLevel = player.level;
  const result = applyXp(player.level, player.xp, xp);
  if (result.levelsGained > 0) {
    for (let level = previousLevel + 1; level <= result.level; level += 1) {
      player.currencies = addCurrencies(player.currencies, {
        silver: levelUpSilverReward(level),
      });
    }
    player.energy = { ...player.energy, current: player.energy.max, lastUpdatedAt: nowMs };
    player.achievements = {
      ...player.achievements,
      ...(result.level >= 10 ? { jarl: true } : {}),
    };
  }
  player.level = result.level;
  player.xp = result.xp;
  player.currentChapter = Math.max(
    player.currentChapter,
    Math.min(5, Math.ceil(player.level / 3)),
  );
  applyCombatStats(player, itemsById, collections);
  if (result.levelsGained > 0) {
    player.health = player.maxHealth;
  }
  return player;
}

export function pveEnemyRewards(enemyLevel: number): { xp: number; silver: number } {
  return { xp: 20 + enemyLevel * 5, silver: 20 + enemyLevel * 8 };
}

export const SOLO_BOSS_REWARDS = { xp: 200, silver: 400 } as const;

export const CLAN_RAID_KILL_REWARDS = { xp: 250, silver: 500 } as const;

export function eventContributionGrant(hasEventPass: boolean): {
  xp: number;
  silver: number;
  eventCurrency: number;
} {
  return {
    xp: 30,
    silver: 25,
    eventCurrency: hasEventPass ? 20 : 10,
  };
}
