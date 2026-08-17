import type {
  BattleEvent,
  BattleRecord,
  BattleSession,
  BossDef,
  CollectionDef,
  CombatCallableResult,
  CombatResult,
  EnemyDef,
  HuntingRewards,
  ItemDef,
  LootTableDef,
  Player,
  QuestDef,
} from '../../../shared/types';
import { CATALOG_DOC_IDS, FIRESTORE_COLLECTIONS } from '../../../shared/ids';
import { db } from '../lib/admin';
import { loadCatalog, loadGameData, loadLiveOps, loadPlayer, newId, savePlayer } from '../lib/context';
import {
  isBattleOver,
  toCombatResult,
} from '../game/combat';
import { addCurrencies, subtractCurrencies } from '../game/economy';
import { recordItemInCollections, rollLootTable } from '../game/loot';
import {
  applyProgression,
  CLAN_RAID_KILL_REWARDS,
  SOLO_BOSS_REWARDS,
} from '../game/progression';
import { huntingRewardsToCurrencies, rollHuntingDrops } from '../game/huntingDrops';
import { silverStolen } from '../game/pvp';
import { createRandomRng } from '../game/rng';
import { applyCombatStats } from '../game/stats';

export async function grantLoot(
  player: Player,
  lootTableId: string | undefined,
  itemsById: Record<string, ItemDef>,
): Promise<ItemDef | null> {
  if (!lootTableId) {
    return null;
  }
  const tables = await loadCatalog<LootTableDef>(CATALOG_DOC_IDS.lootTables);
  const table = tables.find((entry) => entry.id === lootTableId);
  if (!table) {
    return null;
  }
  const dropped = rollLootTable(table, itemsById, createRandomRng());
  if (!dropped) {
    return null;
  }
  player.inventory.push({
    instanceId: newId(),
    itemId: dropped.id,
    equippedSlot: null,
  });
  const collections = (await loadGameData()).collections;
  player.collections = recordItemInCollections(
    player.inventory.map((item) => item.itemId),
    collections,
  );
  return dropped;
}

export async function persistBattle(record: BattleRecord): Promise<void> {
  await db
    .collection(FIRESTORE_COLLECTIONS.players)
    .doc(record.attackerUid)
    .collection(FIRESTORE_COLLECTIONS.battles)
    .doc(record.id)
    .set(record);
  if (record.defenderUid !== 'pve' && record.defenderUid !== 'boss') {
    await db
      .collection(FIRESTORE_COLLECTIONS.players)
      .doc(record.defenderUid)
      .collection(FIRESTORE_COLLECTIONS.battles)
      .doc(record.id)
      .set(record);
  }
}

export function completedBattleSnapshot(battle: BattleSession): BattleSession {
  return { ...battle, waitingFor: 'done' };
}

export function emptyCombatResponse(
  player: Player,
  extras?: Partial<CombatCallableResult>,
): CombatCallableResult {
  return {
    player,
    battle: null,
    events: [],
    combat: null,
    loot: null,
    rewards: null,
    ...extras,
  };
}

export async function settleIfComplete(
  player: Player,
  events: BattleEvent[],
  now: number,
): Promise<CombatCallableResult> {
  const battle = player.activeBattle;
  if (!battle || !isBattleOver(battle)) {
    player.activeBattle = battle;
    player.updatedAt = now;
    await savePlayer(player);
    return {
      player,
      battle,
      events,
      combat: null,
      loot: null,
      rewards: null,
    };
  }
  return settleCompletedBattle(player, battle, events, now);
}

async function settleCompletedBattle(
  player: Player,
  battle: BattleSession,
  events: BattleEvent[],
  now: number,
): Promise<CombatCallableResult> {
  const combat = toCombatResult(battle);
  const { itemsById, collections } = await loadGameData();
  let loot: ItemDef | null = null;
  let rewards: QuestDef['rewards'] | HuntingRewards | null = null;
  let stolen = 0;

  if (combat.attackerWon) {
    if (battle.pending.kind === 'pve') {
      const pending = battle.pending;
      const enemies = await loadCatalog<EnemyDef>(CATALOG_DOC_IDS.enemies);
      const enemy = enemies.find((entry) => entry.id === pending.enemyId);
      if (enemy?.drops) {
        rewards = rollHuntingDrops(enemy.drops, createRandomRng());
        applyProgression(player, rewards.xp, now, itemsById, collections);
        player.currencies = addCurrencies(
          player.currencies,
          huntingRewardsToCurrencies(rewards),
        );
      }
      loot = await grantLoot(player, pending.lootTableId, itemsById);
    } else if (battle.pending.kind === 'quest') {
      rewards = battle.pending.rewards;
      applyProgression(player, rewards.xp, now, itemsById, collections);
      player.currencies = addCurrencies(player.currencies, rewards);
      loot = await grantLoot(player, battle.pending.lootTableId, itemsById);
      player.questProgress[battle.pending.questId] = {
        completions: (player.questProgress[battle.pending.questId]?.completions ?? 0) + 1,
      };
      player.achievements = { ...player.achievements, first_blood: true };
    } else if (battle.pending.kind === 'boss') {
      rewards = { ...SOLO_BOSS_REWARDS };
      applyProgression(player, rewards.xp, now, itemsById, collections);
      player.currencies = addCurrencies(player.currencies, { silver: rewards.silver });
      loot = await grantLoot(player, battle.pending.lootTableId, itemsById);
    } else if (battle.pending.kind === 'clanRaid') {
      const raidResult = await applyClanRaidDamage(player, battle, combat, now, itemsById, collections);
      loot = raidResult.loot;
      rewards = raidResult.rewards;
    } else if (battle.pending.kind === 'pvp') {
      stolen = await settlePvp(player, battle, combat, now);
      rewards = { xp: 0, silver: stolen };
    }
  } else if (battle.pending.kind === 'clanRaid') {
    await applyClanRaidDamage(player, battle, combat, now, itemsById, collections);
  } else if (battle.pending.kind === 'pvp') {
    stolen = await settlePvp(player, battle, combat, now);
  }

  applyCombatStats(player, itemsById, collections);
  if (combat.attackerWon && battle.pending.kind === 'quest') {
    player.health = player.maxHealth;
  }
  const battleSnapshot = completedBattleSnapshot(battle);
  player.activeBattle = null;
  player.updatedAt = now;
  await savePlayer(player);
  return {
    player,
    battle: battleSnapshot,
    events,
    combat,
    loot,
    rewards,
    stolen,
  };
}

async function applyClanRaidDamage(
  player: Player,
  battle: BattleSession,
  combat: CombatResult,
  now: number,
  itemsById: Record<string, ItemDef>,
  collections: CollectionDef[],
): Promise<{ loot: ItemDef | null; rewards: QuestDef['rewards'] | null }> {
  if (!player.clanId || battle.pending.kind !== 'clanRaid') {
    return { loot: null, rewards: null };
  }
  const pending = battle.pending;
  const raidRef = db.collection(FIRESTORE_COLLECTIONS.raids).doc(player.clanId);
  const raidSnap = await raidRef.get();
  const existingRaid = raidSnap.exists
    ? (raidSnap.data() as {
        bossId: string;
        hp: number;
        maxHp: number;
        contributions: Record<string, number>;
      })
    : null;
  const bosses = await loadCatalog<BossDef>(CATALOG_DOC_IDS.bosses);
  const boss = bosses.find((entry) => entry.id === pending.bossId);
  const raid = existingRaid ?? {
    bossId: pending.bossId,
    hp: boss?.health ?? combat.defenderHpRemaining + combat.attackerDamage,
    maxHp: boss?.health ?? combat.defenderHpRemaining + combat.attackerDamage,
    contributions: {} as Record<string, number>,
  };
  raid.hp = Math.max(0, raid.hp - combat.attackerDamage);
  raid.contributions[player.uid] = (raid.contributions[player.uid] ?? 0) + combat.attackerDamage;
  let loot: ItemDef | null = null;
  let rewards: QuestDef['rewards'] | null = null;
  if (raid.hp === 0 && boss) {
    rewards = { ...CLAN_RAID_KILL_REWARDS };
    applyProgression(player, rewards.xp, now, itemsById, collections);
    player.currencies = addCurrencies(player.currencies, { silver: rewards.silver });
    loot = await grantLoot(player, pending.lootTableId, itemsById);
    raid.hp = boss.health;
    raid.bossId = boss.id;
    raid.maxHp = boss.health;
    raid.contributions = {};
  }
  await raidRef.set(raid);
  return { loot, rewards };
}

async function settlePvp(
  attacker: Player,
  battle: BattleSession,
  combat: CombatResult,
  now: number,
): Promise<number> {
  if (battle.pending.kind !== 'pvp') {
    return 0;
  }
  const defenderUid = battle.pending.defenderUid;
  const [defender, liveOps] = await Promise.all([loadPlayer(defenderUid), loadLiveOps()]);
  let stolen = 0;
  if (combat.attackerWon) {
    stolen = silverStolen(defender.currencies.silver);
    attacker.currencies = addCurrencies(attacker.currencies, { silver: stolen });
    defender.currencies = subtractCurrencies(defender.currencies, { silver: stolen });
    attacker.pvp.prestige += 10;
    attacker.pvp.warPoints += 5;
    attacker.achievements = { ...attacker.achievements, warlord: true };
  }
  defender.pvp.protectionUntil = now + liveOps.tunables.pvpProtectionMs;
  attacker.pvp.revengeFrom = attacker.pvp.revengeFrom.filter((id) => id !== defenderUid);
  if (!defender.pvp.revengeFrom.includes(attacker.uid)) {
    defender.pvp.revengeFrom = [...defender.pvp.revengeFrom, attacker.uid];
  }
  defender.updatedAt = now;
  await savePlayer(defender);
  const record: BattleRecord = {
    id: newId(),
    attackerUid: attacker.uid,
    defenderUid,
    attackerName: attacker.vikingName,
    defenderName: defender.vikingName,
    attackerWon: combat.attackerWon,
    silverStolen: stolen,
    createdAt: now,
    kind: 'pvp',
  };
  await persistBattle(record);
  return stolen;
}
