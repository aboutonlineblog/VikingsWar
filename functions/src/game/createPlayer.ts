import type { BuildingId, Player, TerritoryId } from '../../../shared/types';
import { emptyEquipment } from '../../../shared/types';
import { DEFAULT_ENERGY_MAX, DEFAULT_STAMINA_MAX } from './regen';
import { baseStatsForLevel } from './xp';

const BUILDING_IDS: BuildingId[] = [
  'greatHall',
  'farm',
  'lumberCamp',
  'ironMine',
  'blacksmith',
  'barracks',
  'shipyard',
  'tradingPost',
  'temple',
];

const TERRITORIES: TerritoryId[] = [
  'village',
  'coastalLands',
  'northernForest',
  'frozenMountains',
  'enemyKingdom',
  'legendaryLands',
];

export function createNewPlayer(
  uid: string,
  vikingName: string,
  avatarId: string,
  nowMs: number,
): Player {
  const stats = baseStatsForLevel(1);
  const buildings = Object.fromEntries(
    BUILDING_IDS.map((id) => [
      id,
      {
        id,
        level: id === 'greatHall' || id === 'farm' || id === 'lumberCamp' ? 1 : 0,
        upgradeCompletesAt: null,
      },
    ]),
  ) as Player['buildings'];

  const territories = Object.fromEntries(
    TERRITORIES.map((id) => [id, id === 'village' ? 'conquered' : 'locked']),
  ) as Player['territories'];

  return {
    uid,
    vikingName,
    avatarId,
    level: 1,
    xp: 0,
    health: stats.health,
    maxHealth: stats.health,
    attack: stats.attack,
    defense: stats.defense,
    speed: stats.speed,
    currencies: {
      silver: 100,
      gold: 0,
      food: 50,
      wood: 50,
      iron: 20,
      meat: 0,
      herbs: 0,
      ironPlate: 0,
      bronzePlate: 0,
      silverPlate: 0,
      goldPlate: 0,
      runes: 0,
      eventCurrency: 0,
    },
    energy: {
      current: DEFAULT_ENERGY_MAX,
      max: DEFAULT_ENERGY_MAX,
      lastUpdatedAt: nowMs,
    },
    stamina: {
      current: DEFAULT_STAMINA_MAX,
      max: DEFAULT_STAMINA_MAX,
      lastUpdatedAt: nowMs,
    },
    equipment: emptyEquipment(),
    inventory: [],
    warriors: [],
    warriorCap: 20,
    buildings,
    resourcesLastCollectedAt: nowMs,
    questProgress: {},
    currentChapter: 1,
    territories,
    collections: {},
    clanId: null,
    friends: [],
    friendRequests: [],
    giftedToday: [],
    pvp: {
      prestige: 0,
      warPoints: 0,
      protectionUntil: 0,
      attacksToday: 0,
      attacksResetAt: nowMs + 24 * 60 * 60 * 1000,
      lastAttackAt: 0,
      revengeFrom: [],
    },
    cosmetics: { avatars: [avatarId], villageDecor: [] },
    equippedCosmetics: { avatar: avatarId, village: null },
    battlePass: { seasonId: 'season1', xp: 0, premium: false },
    eventPasses: [],
    dailyLogin: { lastClaimDate: '', streak: 0 },
    achievements: {},
    helpedClanToday: [],
    activeBattle: null,
    createdAt: nowMs,
    updatedAt: nowMs,
  };
}
