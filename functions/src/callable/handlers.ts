import { HttpsError, onCall, type CallableRequest } from 'firebase-functions/v2/https';
import type {
  BossDef,
  BuildingId,
  Clan,
  CombatAction,
  DailyLoginDef,
  EnemyDef,
  EventDef,
  Player,
  ShopProductDef,
  TerritoryDef,
  TerritoryId,
  WarriorDef,
} from '../../../shared/types';
import { CATALOG_DOC_IDS, FIRESTORE_COLLECTIONS } from '../../../shared/ids';
import { db } from '../lib/admin';
import {
  loadCatalog,
  loadGameData,
  loadLiveOps,
  loadPlayer,
  newId,
  playerRef,
  requireUid,
  savePlayer,
  utcDateString,
} from '../lib/context';
import {
  accrueResources,
  completeUpgradeIfDue,
  isBuildingBusy,
  upgradeCost,
  upgradeDurationMs,
} from '../game/buildings';
import {
  createBattleCombatant,
  createBattleSession,
  startBattle,
  submitPlayerAction,
} from '../game/combat';
import { createNewPlayer } from '../game/createPlayer';
import { addCurrencies, subtractCurrencies } from '../game/economy';
import {
  applyProgression,
  eventContributionGrant,
} from '../game/progression';
import { pvpEligibility, resetDailyAttacks } from '../game/pvp';
import { questUnlockState } from '../game/quests';
import { ENERGY_INTERVAL_MS, STAMINA_INTERVAL_MS, spendPool } from '../game/regen';
import { createRandomRng } from '../game/rng';
import { applyShopProduct, isEmulatorFulfillmentAllowed } from '../game/shop';
import { applyCombatStats, computeCombatStats } from '../game/stats';
import { nextTerritoryStatus } from '../game/territory';
import { emptyCombatResponse, grantLoot, settleIfComplete } from './battleRewards';
import type { BattleEvent, BattlePending } from '../../../shared/types';

function fail(
  code:
    | 'invalid-argument'
    | 'already-exists'
    | 'permission-denied'
    | 'failed-precondition'
    | 'not-found'
    | 'unauthenticated',
  message: string,
): never {
  throw new HttpsError(code, message);
}

function beginBattle(
  player: Player,
  input: {
    title: string;
    opponentName: string;
    playerStats: { attack: number; defense: number; health: number; speed: number };
    enemyStats: { attack: number; defense: number; health: number; speed: number };
    pending: BattlePending;
  },
): BattleEvent[] {
  player.activeBattle = null;
  const session = createBattleSession({
    id: newId(),
    title: input.title,
    opponentName: input.opponentName,
    player: createBattleCombatant({
      name: player.vikingName,
      ...input.playerStats,
    }),
    enemy: createBattleCombatant({
      name: input.opponentName,
      ...input.enemyStats,
    }),
    pending: input.pending,
  });
  const events = startBattle(session, createRandomRng());
  player.activeBattle = session;
  return events;
}

function refreshBuildings(player: Player, nowMs: number): Player {
  (Object.keys(player.buildings) as BuildingId[]).forEach((id) => {
    const before = player.buildings[id].level;
    player.buildings[id] = completeUpgradeIfDue(player.buildings[id], nowMs);
    if (player.buildings[id].level >= 3 && before < 3) {
      player.achievements = { ...player.achievements, builder: true };
    }
  });
  return player;
}

export const createViking = onCall(async (request) => {
  const uid = requireUid(request);
  const vikingName = String(request.data?.vikingName ?? '').trim();
  const avatarId = String(request.data?.avatarId ?? 'wolf');
  if (vikingName.length < 2 || vikingName.length > 20) {
    fail('invalid-argument', 'Viking name must be 2–20 characters.');
  }
  const existing = await playerRef(uid).get();
  if (existing.exists) {
    fail('already-exists', 'Viking already created.');
  }
  const liveOps = await loadLiveOps();
  if (liveOps.featureFlags.alphaGate) {
    const allow = await db.collection(FIRESTORE_COLLECTIONS.config).doc('allowlist').get();
    const emails: string[] = allow.data()?.emails ?? [];
    const email = request.auth?.token.email;
    if (!email || !emails.includes(email)) {
      fail('permission-denied', 'Closed alpha: this account is not allowlisted.');
    }
  }
  const player = createNewPlayer(uid, vikingName, avatarId, Date.now());
  await savePlayer(player);
  return { player };
});

export const claimDailyLogin = onCall(async (request) => {
  const uid = requireUid(request);
  const now = Date.now();
  const player = await loadPlayer(uid);
  const today = utcDateString(now);
  if (player.dailyLogin.lastClaimDate === today) {
    fail('failed-precondition', 'Already claimed today.');
  }
  const rewards = await loadCatalog<DailyLoginDef>(CATALOG_DOC_IDS.dailyLogin);
  const yesterday = utcDateString(now - 24 * 60 * 60 * 1000);
  const streak =
    player.dailyLogin.lastClaimDate === yesterday ? player.dailyLogin.streak + 1 : 1;
  const day = ((streak - 1) % 7) + 1;
  const reward = rewards.find((entry) => entry.day === day) ?? { day, silver: 50 };
  player.currencies = addCurrencies(player.currencies, {
    silver: reward.silver,
    food: reward.food,
    runes: reward.runes,
  });
  player.dailyLogin = { lastClaimDate: today, streak };
  player.updatedAt = now;
  await savePlayer(player);
  return { player, reward };
});

export const completeQuest = onCall(async (request) => {
  const uid = requireUid(request);
  const questId = String(request.data?.questId ?? '');
  const now = Date.now();
  const player = refreshBuildings(await loadPlayer(uid), now);
  const { quests, itemsById, collections } = await loadGameData();
  const quest = quests.find((entry) => entry.id === questId);
  if (!quest) {
    fail('not-found', 'Unknown quest.');
  }
  const lock = questUnlockState(player, quest);
  if (lock === 'level') {
    fail('failed-precondition', 'Level too low.');
  }
  if (lock === 'chapter') {
    fail('failed-precondition', 'Chapter still locked.');
  }
  let enemy: EnemyDef | undefined;
  if (quest.enemyId) {
    const enemies = await loadCatalog<EnemyDef>(CATALOG_DOC_IDS.enemies);
    enemy = enemies.find((entry) => entry.id === quest.enemyId);
    if (!enemy) {
      fail('not-found', 'Quest enemy is missing.');
    }
  }
  try {
    player.energy = spendPool(player.energy, quest.energyCost, now, ENERGY_INTERVAL_MS);
  } catch {
    fail('failed-precondition', 'Not enough energy.');
  }

  if (enemy) {
    const stats = computeCombatStats(player, itemsById, collections);
    const events = beginBattle(player, {
      title: quest.name,
      opponentName: enemy.name,
      playerStats: stats,
      enemyStats: {
        attack: enemy.attack,
        defense: enemy.defense,
        health: enemy.health,
        speed: enemy.speed,
      },
      pending: {
        kind: 'quest',
        questId: quest.id,
        rewards: quest.rewards,
        lootTableId: quest.lootTableId,
      },
    });
    return settleIfComplete(player, events, now);
  }

  applyProgression(player, quest.rewards.xp, now, itemsById, collections);
  player.currencies = addCurrencies(player.currencies, quest.rewards);
  const loot = await grantLoot(player, quest.lootTableId, itemsById);
  player.questProgress[quest.id] = {
    completions: (player.questProgress[quest.id]?.completions ?? 0) + 1,
  };
  player.achievements = { ...player.achievements, first_blood: true };
  player.updatedAt = now;
  applyCombatStats(player, itemsById, collections);
  player.health = player.maxHealth;
  await savePlayer(player);
  return emptyCombatResponse(player, { rewards: quest.rewards, loot });
});

export const fightEnemy = onCall(async (request) => {
  const uid = requireUid(request);
  const enemyId = String(request.data?.enemyId ?? '');
  const now = Date.now();
  const player = await loadPlayer(uid);
  const { itemsById, collections } = await loadGameData();
  const enemies = await loadCatalog<EnemyDef>(CATALOG_DOC_IDS.enemies);
  const enemy = enemies.find((entry) => entry.id === enemyId);
  if (!enemy) {
    fail('not-found', 'Unknown enemy.');
  }
  try {
    player.stamina = spendPool(player.stamina, enemy.staminaCost, now, STAMINA_INTERVAL_MS);
  } catch {
    fail('failed-precondition', 'Not enough stamina.');
  }
  const stats = computeCombatStats(player, itemsById, collections);
  const events = beginBattle(player, {
    title: enemy.name,
    opponentName: enemy.name,
    playerStats: stats,
    enemyStats: {
      attack: enemy.attack,
      defense: enemy.defense,
      health: enemy.health,
      speed: enemy.speed,
    },
    pending: { kind: 'pve', enemyId: enemy.id, enemyLevel: enemy.level, lootTableId: enemy.lootTableId },
  });
  const result = await settleIfComplete(player, events, now);
  return { ...result, enemy };
});

export const submitCombatAction = onCall(async (request) => {
  const uid = requireUid(request);
  const action = String(request.data?.action ?? '') as CombatAction;
  if (!['attack', 'special', 'defend', 'potion', 'auto'].includes(action)) {
    fail('invalid-argument', 'Unknown combat action.');
  }
  const now = Date.now();
  const player = await loadPlayer(uid);
  if (!player.activeBattle) {
    fail('failed-precondition', 'No active battle.');
  }
  try {
    const events = submitPlayerAction(player.activeBattle, action, createRandomRng());
    return settleIfComplete(player, events, now);
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message === 'NOT_PLAYER_TURN') {
      fail('failed-precondition', 'It is not your turn.');
    }
    if (message === 'ACTION_UNAVAILABLE') {
      fail('failed-precondition', 'That action is not available.');
    }
    throw error;
  }
});

export const collectResources = onCall(async (request) => {
  const uid = requireUid(request);
  const now = Date.now();
  const player = await loadPlayer(uid);
  const { buildings } = await loadGameData();
  const gained = accrueResources(
    player.buildings,
    buildings,
    player.resourcesLastCollectedAt,
    now,
  );
  player.currencies = addCurrencies(player.currencies, gained);
  player.resourcesLastCollectedAt = now;
  refreshBuildings(player, now);
  player.updatedAt = now;
  await savePlayer(player);
  return { player, gained };
});

export const upgradeBuilding = onCall(async (request) => {
  const uid = requireUid(request);
  const buildingId = String(request.data?.buildingId ?? '') as BuildingId;
  const now = Date.now();
  const player = refreshBuildings(await loadPlayer(uid), now);
  const building = player.buildings[buildingId];
  if (!building) {
    fail('not-found', 'Unknown building.');
  }
  if (isBuildingBusy(building, now)) {
    fail('failed-precondition', 'Upgrade already in progress.');
  }
  const defs = (await loadGameData()).buildings;
  const def = defs.find((entry) => entry.id === buildingId);
  if (!def || building.level >= def.maxLevel) {
    fail('failed-precondition', 'Max level reached.');
  }
  try {
    player.currencies = subtractCurrencies(player.currencies, upgradeCost(building.level));
  } catch {
    fail('failed-precondition', 'Not enough resources.');
  }
  building.upgradeCompletesAt = now + upgradeDurationMs(building.level);
  player.updatedAt = now;
  await savePlayer(player);
  return { player };
});

export const speedUpBuilding = onCall(async (request) => {
  const uid = requireUid(request);
  const buildingId = String(request.data?.buildingId ?? '') as BuildingId;
  const now = Date.now();
  const player = refreshBuildings(await loadPlayer(uid), now);
  const building = player.buildings[buildingId];
  if (!building || !isBuildingBusy(building, now)) {
    fail('failed-precondition', 'Nothing to speed up.');
  }
  try {
    player.currencies = subtractCurrencies(player.currencies, { runes: 15 });
  } catch {
    fail('failed-precondition', 'Not enough Runes.');
  }
  building.level += 1;
  building.upgradeCompletesAt = null;
  if (building.level >= 3) {
    player.achievements = { ...player.achievements, builder: true };
  }
  player.updatedAt = now;
  await savePlayer(player);
  return { player };
});

export const equipItem = onCall(async (request) => {
  const uid = requireUid(request);
  const instanceId = String(request.data?.instanceId ?? '');
  const player = await loadPlayer(uid);
  const { itemsById, collections } = await loadGameData();
  const instance = player.inventory.find((item) => item.instanceId === instanceId);
  if (!instance) {
    fail('not-found', 'Item not in inventory.');
  }
  const def = itemsById[instance.itemId];
  if (!def) {
    fail('not-found', 'Unknown item.');
  }
  const currently = player.equipment[def.slot];
  if (currently) {
    const prev = player.inventory.find((item) => item.instanceId === currently);
    if (prev) {
      prev.equippedSlot = null;
    }
  }
  player.equipment[def.slot] = instanceId;
  instance.equippedSlot = def.slot;
  applyCombatStats(player, itemsById, collections);
  player.updatedAt = Date.now();
  await savePlayer(player);
  return { player };
});

export const recruitWarrior = onCall(async (request) => {
  const uid = requireUid(request);
  const warriorId = String(request.data?.warriorId ?? '');
  const player = await loadPlayer(uid);
  const liveOps = await loadLiveOps();
  if (player.warriors.length >= liveOps.tunables.warriorCap) {
    fail('failed-precondition', 'Warband is full.');
  }
  const defs = await loadCatalog<WarriorDef>(CATALOG_DOC_IDS.warriors);
  const def = defs.find((entry) => entry.id === warriorId);
  if (!def) {
    fail('not-found', 'Unknown warrior.');
  }
  try {
    player.currencies = subtractCurrencies(player.currencies, def.recruitCost);
  } catch {
    fail('failed-precondition', 'Not enough resources.');
  }
  player.warriors.push({
    instanceId: newId(),
    warriorId: def.id,
    level: 1,
    class: def.class,
    rarity: def.rarity,
    attack: def.baseAttack,
    defense: def.baseDefense,
  });
  player.updatedAt = Date.now();
  await savePlayer(player);
  return { player };
});

export const upgradeWarrior = onCall(async (request) => {
  const uid = requireUid(request);
  const instanceId = String(request.data?.instanceId ?? '');
  const player = await loadPlayer(uid);
  const warrior = player.warriors.find((entry) => entry.instanceId === instanceId);
  if (!warrior) {
    fail('not-found', 'Warrior not found.');
  }
  try {
    player.currencies = subtractCurrencies(player.currencies, {
      silver: 80 * warrior.level,
      food: 15 * warrior.level,
    });
  } catch {
    fail('failed-precondition', 'Not enough resources.');
  }
  warrior.level += 1;
  warrior.attack += 6;
  warrior.defense += 4;
  player.updatedAt = Date.now();
  await savePlayer(player);
  return { player };
});

export const attackPlayer = onCall(async (request) => {
  const uid = requireUid(request);
  const defenderUid = String(request.data?.defenderUid ?? '');
  if (defenderUid === uid) {
    fail('invalid-argument', 'Cannot raid yourself.');
  }
  const liveOps = await loadLiveOps();
  if (!liveOps.featureFlags.pvp) {
    fail('failed-precondition', 'PvP is disabled.');
  }
  const now = Date.now();
  const [attacker, defender, game] = await Promise.all([
    loadPlayer(uid),
    loadPlayer(defenderUid),
    loadGameData(),
  ]);
  const daily = resetDailyAttacks(
    attacker.pvp.attacksToday,
    attacker.pvp.attacksResetAt,
    now,
  );
  attacker.pvp.attacksToday = daily.attacksToday;
  attacker.pvp.attacksResetAt = daily.attacksResetAt;
  const eligibility = pvpEligibility({
    attackerLevel: attacker.level,
    defenderLevel: defender.level,
    nowMs: now,
    protectionUntil: defender.pvp.protectionUntil,
    attacksToday: attacker.pvp.attacksToday,
    attacksResetAt: attacker.pvp.attacksResetAt,
    lastAttackAt: attacker.pvp.lastAttackAt,
    dailyLimit: liveOps.tunables.pvpDailyAttackLimit,
    cooldownMs: liveOps.tunables.pvpCooldownMs,
    levelBand: liveOps.tunables.pvpLevelBand,
    defenderUid,
    attackerRevengeFrom: attacker.pvp.revengeFrom,
  });
  if (!eligibility.ok) {
    fail('failed-precondition', `PvP blocked: ${eligibility.reason}`);
  }
  try {
    attacker.stamina = spendPool(attacker.stamina, 2, now, STAMINA_INTERVAL_MS);
  } catch {
    fail('failed-precondition', 'Not enough stamina.');
  }
  const aStats = computeCombatStats(attacker, game.itemsById, game.collections);
  const dStats = computeCombatStats(defender, game.itemsById, game.collections);
  attacker.pvp.attacksToday += 1;
  attacker.pvp.lastAttackAt = now;
  const events = beginBattle(attacker, {
    title: `Raid on ${defender.vikingName}`,
    opponentName: defender.vikingName,
    playerStats: aStats,
    enemyStats: dStats,
    pending: { kind: 'pvp', defenderUid },
  });
  return settleIfComplete(attacker, events, now);
});

export const createClan = onCall(async (request) => {
  const uid = requireUid(request);
  const name = String(request.data?.name ?? '').trim();
  const bannerId = String(request.data?.bannerId ?? 'raven');
  if (name.length < 3) {
    fail('invalid-argument', 'Clan name too short.');
  }
  const player = await loadPlayer(uid);
  if (player.clanId) {
    fail('failed-precondition', 'Already in a clan.');
  }
  const clan: Clan = {
    id: newId(),
    name,
    bannerId,
    level: 1,
    xp: 0,
    leaderUid: uid,
    memberUids: [uid],
    treasury: {
      silver: 0,
      gold: 0,
      food: 0,
      wood: 0,
      iron: 0,
      meat: 0,
      herbs: 0,
      ironPlate: 0,
      bronzePlate: 0,
      silverPlate: 0,
      goldPlate: 0,
      runes: 0,
      eventCurrency: 0,
    },
    upgrades: {},
    createdAt: Date.now(),
  };
  await db.collection(FIRESTORE_COLLECTIONS.clans).doc(clan.id).set(clan);
  player.clanId = clan.id;
  player.updatedAt = Date.now();
  await savePlayer(player);
  return { player, clan };
});

export const joinClan = onCall(async (request) => {
  const uid = requireUid(request);
  const clanId = String(request.data?.clanId ?? '');
  const player = await loadPlayer(uid);
  if (player.clanId) {
    fail('failed-precondition', 'Already in a clan.');
  }
  const ref = db.collection(FIRESTORE_COLLECTIONS.clans).doc(clanId);
  const snap = await ref.get();
  if (!snap.exists) {
    fail('not-found', 'Clan not found.');
  }
  const clan = snap.data() as Clan;
  if (clan.memberUids.length >= 30) {
    fail('failed-precondition', 'Clan is full.');
  }
  clan.memberUids = [...clan.memberUids, uid];
  await ref.set(clan);
  player.clanId = clan.id;
  player.updatedAt = Date.now();
  await savePlayer(player);
  return { player, clan };
});

export const leaveClan = onCall(async (request) => {
  const uid = requireUid(request);
  const player = await loadPlayer(uid);
  if (!player.clanId) {
    fail('failed-precondition', 'Not in a clan.');
  }
  const ref = db.collection(FIRESTORE_COLLECTIONS.clans).doc(player.clanId);
  const snap = await ref.get();
  if (snap.exists) {
    const clan = snap.data() as Clan;
    clan.memberUids = clan.memberUids.filter((id) => id !== uid);
    if (clan.leaderUid === uid) {
      clan.leaderUid = clan.memberUids[0] ?? '';
    }
    if (clan.memberUids.length === 0) {
      await ref.delete();
    } else {
      await ref.set(clan);
    }
  }
  player.clanId = null;
  player.updatedAt = Date.now();
  await savePlayer(player);
  return { player };
});

export const donateTreasury = onCall(async (request) => {
  const uid = requireUid(request);
  const silver = Number(request.data?.silver ?? 0);
  if (silver <= 0) {
    fail('invalid-argument', 'Donate a positive amount.');
  }
  const player = await loadPlayer(uid);
  if (!player.clanId) {
    fail('failed-precondition', 'Join a clan first.');
  }
  try {
    player.currencies = subtractCurrencies(player.currencies, { silver });
  } catch {
    fail('failed-precondition', 'Not enough silver.');
  }
  const ref = db.collection(FIRESTORE_COLLECTIONS.clans).doc(player.clanId);
  const snap = await ref.get();
  if (!snap.exists) {
    fail('not-found', 'Clan missing.');
  }
  const clan = snap.data() as Clan;
  clan.treasury = addCurrencies(clan.treasury, { silver });
  clan.xp += Math.floor(silver / 10);
  await ref.set(clan);
  player.updatedAt = Date.now();
  await savePlayer(player);
  return { player, clan };
});

export const exploreTerritory = onCall(async (request) => {
  const uid = requireUid(request);
  const territoryId = String(request.data?.territoryId ?? '') as TerritoryId;
  const now = Date.now();
  const player = await loadPlayer(uid);
  const defs = await loadCatalog<TerritoryDef>(CATALOG_DOC_IDS.territories);
  const def = defs.find((entry) => entry.id === territoryId);
  if (!def) {
    fail('not-found', 'Unknown territory.');
  }
  if (player.level < def.requiredLevel || player.currentChapter < def.requiredChapter) {
    fail('failed-precondition', 'Territory locked.');
  }
  const nextStatus = nextTerritoryStatus(player.territories[territoryId] ?? 'locked');
  if (!nextStatus) {
    fail('failed-precondition', 'Territory already conquered.');
  }
  if (def.energyCost > 0) {
    try {
      player.energy = spendPool(player.energy, def.energyCost, now, ENERGY_INTERVAL_MS);
    } catch {
      fail('failed-precondition', 'Not enough energy.');
    }
  }
  const { itemsById, collections } = await loadGameData();
  player.territories[territoryId] = nextStatus;
  applyProgression(player, 40, now, itemsById, collections);
  player.currencies = addCurrencies(player.currencies, { silver: 60 });
  player.updatedAt = now;
  await savePlayer(player);
  return { player };
});

export const attackBoss = onCall(async (request) => {
  const uid = requireUid(request);
  const bossId = String(request.data?.bossId ?? '');
  const now = Date.now();
  const player = await loadPlayer(uid);
  const bosses = await loadCatalog<BossDef>(CATALOG_DOC_IDS.bosses);
  const boss = bosses.find((entry) => entry.id === bossId && !entry.clanRaid);
  if (!boss) {
    fail('not-found', 'Unknown solo boss.');
  }
  try {
    player.stamina = spendPool(player.stamina, boss.staminaCost, now, STAMINA_INTERVAL_MS);
  } catch {
    fail('failed-precondition', 'Not enough stamina.');
  }
  const { itemsById, collections } = await loadGameData();
  const stats = computeCombatStats(player, itemsById, collections);
  const events = beginBattle(player, {
    title: boss.name,
    opponentName: boss.name,
    playerStats: stats,
    enemyStats: {
      attack: boss.attack,
      defense: boss.defense,
      health: boss.health,
      speed: boss.speed,
    },
    pending: { kind: 'boss', bossId: boss.id, lootTableId: boss.lootTableId },
  });
  return settleIfComplete(player, events, now);
});

export const attackClanRaid = onCall(async (request) => {
  const uid = requireUid(request);
  const now = Date.now();
  const player = await loadPlayer(uid);
  if (!player.clanId) {
    fail('failed-precondition', 'Join a clan to raid.');
  }
  const bosses = await loadCatalog<BossDef>(CATALOG_DOC_IDS.bosses);
  const clanBosses = bosses.filter((entry) => entry.clanRaid);
  const requestedId = String(request.data?.bossId ?? '');
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
  const boss =
    clanBosses.find((entry) => entry.id === (existingRaid?.bossId || requestedId)) ??
    clanBosses[0];
  if (!boss) {
    fail('not-found', 'No clan raid boss.');
  }
  try {
    player.stamina = spendPool(player.stamina, boss.staminaCost, now, STAMINA_INTERVAL_MS);
  } catch {
    fail('failed-precondition', 'Not enough stamina.');
  }
  const { itemsById, collections } = await loadGameData();
  const stats = computeCombatStats(player, itemsById, collections);
  const events = beginBattle(player, {
    title: boss.name,
    opponentName: boss.name,
    playerStats: stats,
    enemyStats: {
      attack: boss.attack,
      defense: boss.defense,
      health: existingRaid?.hp ?? boss.health,
      speed: boss.speed,
    },
    pending: { kind: 'clanRaid', bossId: boss.id, lootTableId: boss.lootTableId },
  });
  return settleIfComplete(player, events, now);
});

export const sendFriendRequest = onCall(async (request) => {
  const uid = requireUid(request);
  const targetUid = String(request.data?.targetUid ?? '');
  if (targetUid === uid) {
    fail('invalid-argument', 'Cannot friend yourself.');
  }
  const target = await loadPlayer(targetUid);
  if (!target.friendRequests.includes(uid) && !target.friends.includes(uid)) {
    target.friendRequests = [...target.friendRequests, uid];
    await savePlayer(target);
  }
  return { ok: true };
});

export const acceptFriend = onCall(async (request) => {
  const uid = requireUid(request);
  const fromUid = String(request.data?.fromUid ?? '');
  const [player, other] = await Promise.all([loadPlayer(uid), loadPlayer(fromUid)]);
  if (!player.friendRequests.includes(fromUid)) {
    fail('failed-precondition', 'No request from that Viking.');
  }
  player.friendRequests = player.friendRequests.filter((id) => id !== fromUid);
  if (!player.friends.includes(fromUid)) {
    player.friends = [...player.friends, fromUid];
  }
  if (!other.friends.includes(uid)) {
    other.friends = [...other.friends, uid];
  }
  await savePlayer(player);
  await savePlayer(other);
  return { player };
});

export const sendGift = onCall(async (request) => {
  const uid = requireUid(request);
  const targetUid = String(request.data?.targetUid ?? '');
  const player = await loadPlayer(uid);
  if (!player.friends.includes(targetUid)) {
    fail('failed-precondition', 'Gifts are for friends.');
  }
  const today = utcDateString(Date.now());
  const key = `${targetUid}:${today}`;
  if (player.giftedToday.includes(key)) {
    fail('failed-precondition', 'Already gifted that friend today.');
  }
  try {
    player.currencies = subtractCurrencies(player.currencies, { food: 10 });
  } catch {
    fail('failed-precondition', 'Not enough food to gift.');
  }
  const target = await loadPlayer(targetUid);
  target.currencies = addCurrencies(target.currencies, { food: 10 });
  player.giftedToday = [...player.giftedToday.filter((entry) => entry.endsWith(today)), key];
  await savePlayer(player);
  await savePlayer(target);
  return { player };
});

export const helpClanMember = onCall(async (request) => {
  const uid = requireUid(request);
  const targetUid = String(request.data?.targetUid ?? '');
  const today = utcDateString(Date.now());
  const player = await loadPlayer(uid);
  if (!player.clanId) {
    fail('failed-precondition', 'Join a clan first.');
  }
  const key = `${targetUid}:${today}`;
  if (player.helpedClanToday.includes(key)) {
    fail('failed-precondition', 'Already helped today.');
  }
  const target = await loadPlayer(targetUid);
  if (target.clanId !== player.clanId) {
    fail('failed-precondition', 'Not in your clan.');
  }
  target.currencies = addCurrencies(target.currencies, { wood: 15 });
  player.helpedClanToday = [...player.helpedClanToday.filter((entry) => entry.endsWith(today)), key];
  await savePlayer(player);
  await savePlayer(target);
  return { player };
});

export const fulfillDevPurchase = onCall(async (request) => {
  const uid = requireUid(request);
  if (!isEmulatorFulfillmentAllowed()) {
    fail('failed-precondition', 'Dev purchases are only available on emulators.');
  }
  const productId = String(request.data?.productId ?? '');
  const products = await loadCatalog<ShopProductDef>(CATALOG_DOC_IDS.shopProducts);
  const product = products.find((entry) => entry.id === productId);
  if (!product) {
    fail('not-found', 'Unknown product.');
  }
  const now = Date.now();
  const player = refreshBuildings(await loadPlayer(uid), now);
  try {
    applyShopProduct(player, product, now);
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message === 'POWER_AFFECTING') {
      fail('failed-precondition', 'Power-affecting products are not sold.');
    }
    if (message === 'INSUFFICIENT_CURRENCY') {
      fail('failed-precondition', 'Not enough Runes.');
    }
    if (message === 'NOTHING_TO_SPEED_UP') {
      fail('failed-precondition', 'No building upgrade to finish.');
    }
    throw error;
  }
  await savePlayer(player);
  return { player, product };
});

export const contributeEvent = onCall(async (request) => {
  const uid = requireUid(request);
  const now = Date.now();
  const player = await loadPlayer(uid);
  const events = await loadCatalog<EventDef>(CATALOG_DOC_IDS.events);
  const event = events.find((entry) => entry.startsAt <= now && entry.endsAt >= now);
  if (!event) {
    fail('failed-precondition', 'No active event.');
  }
  try {
    player.energy = spendPool(player.energy, 8, now, ENERGY_INTERVAL_MS);
  } catch {
    fail('failed-precondition', 'Not enough energy.');
  }
  const { itemsById, collections } = await loadGameData();
  const grant = eventContributionGrant((player.eventPasses ?? []).length > 0);
  player.currencies = addCurrencies(player.currencies, {
    eventCurrency: grant.eventCurrency,
    silver: grant.silver,
  });
  applyProgression(player, grant.xp, now, itemsById, collections);
  player.updatedAt = now;
  await savePlayer(player);
  return { player, eventId: event.id };
});

export const listPvpTargets = onCall(async (request: CallableRequest) => {
  const uid = requireUid(request);
  const player = await loadPlayer(uid);
  const liveOps = await loadLiveOps();
  const snap = await db.collection(FIRESTORE_COLLECTIONS.players).limit(25).get();
  const targets = snap.docs
    .map((doc) => doc.data() as Player)
    .filter((candidate) => {
      if (candidate.uid === uid) {
        return false;
      }
      const result = pvpEligibility({
        attackerLevel: player.level,
        defenderLevel: candidate.level,
        nowMs: Date.now(),
        protectionUntil: candidate.pvp.protectionUntil,
        attacksToday: player.pvp.attacksToday,
        attacksResetAt: player.pvp.attacksResetAt,
        lastAttackAt: player.pvp.lastAttackAt,
        dailyLimit: liveOps.tunables.pvpDailyAttackLimit,
        cooldownMs: liveOps.tunables.pvpCooldownMs,
        levelBand: liveOps.tunables.pvpLevelBand,
        defenderUid: candidate.uid,
        attackerRevengeFrom: player.pvp.revengeFrom,
      });
      return result.ok;
    })
    .slice(0, 8)
    .map((candidate) => ({
      uid: candidate.uid,
      vikingName: candidate.vikingName,
      level: candidate.level,
      prestige: candidate.pvp.prestige,
    }));
  return { targets };
});
