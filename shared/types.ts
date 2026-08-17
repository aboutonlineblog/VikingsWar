export type Rarity =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'
  | 'mythic'
  | 'celestial';

export type EquipSlot =
  | 'weapon'
  | 'helmet'
  | 'armor'
  | 'shield'
  | 'boots'
  | 'ring'
  | 'amulet'
  | 'necklace'
  | 'bracelet'
  | 'earrings'
  | 'headband';

export const EQUIP_SLOTS: EquipSlot[] = [
  'weapon',
  'helmet',
  'armor',
  'shield',
  'boots',
  'ring',
  'amulet',
  'necklace',
  'bracelet',
  'earrings',
  'headband',
];

export const SPEED_ACCESSORY_SLOTS: EquipSlot[] = [
  'ring',
  'necklace',
  'bracelet',
  'earrings',
  'headband',
];

export function emptyEquipment(): Record<EquipSlot, string | null> {
  return {
    weapon: null,
    helmet: null,
    armor: null,
    shield: null,
    boots: null,
    ring: null,
    amulet: null,
    necklace: null,
    bracelet: null,
    earrings: null,
    headband: null,
  };
}

export type WeaponType = 'axe' | 'sword' | 'spear' | 'bow' | 'daneAxe' | 'seax';

export type QuestCategory =
  | 'hunting'
  | 'gathering'
  | 'raiding'
  | 'exploration'
  | 'trading'
  | 'warfare'
  | 'mythology'
  | 'boss';

export type WarriorClass = 'berserker' | 'shieldmaiden' | 'archer' | 'raider';

export type BuildingId =
  | 'greatHall'
  | 'farm'
  | 'lumberCamp'
  | 'ironMine'
  | 'blacksmith'
  | 'barracks'
  | 'shipyard'
  | 'tradingPost'
  | 'temple';

export type TerritoryId =
  | 'village'
  | 'coastalLands'
  | 'northernForest'
  | 'frozenMountains'
  | 'enemyKingdom'
  | 'legendaryLands';

export type TerritoryStatus = 'locked' | 'explored' | 'conquered';

export type AppEnv = 'development' | 'alpha' | 'beta' | 'production';

export interface RegeneratingPool {
  current: number;
  max: number;
  lastUpdatedAt: number;
}

export interface Currencies {
  silver: number;
  gold: number;
  food: number;
  wood: number;
  iron: number;
  meat: number;
  herbs: number;
  ironPlate: number;
  bronzePlate: number;
  silverPlate: number;
  goldPlate: number;
  runes: number;
  eventCurrency: number;
}

export interface InventoryItem {
  instanceId: string;
  itemId: string;
  equippedSlot: EquipSlot | null;
}

export interface Warrior {
  instanceId: string;
  warriorId: string;
  level: number;
  class: WarriorClass;
  rarity: Rarity;
  attack: number;
  defense: number;
}

export interface BuildingState {
  id: BuildingId;
  level: number;
  upgradeCompletesAt: number | null;
}

export interface PvpState {
  prestige: number;
  warPoints: number;
  protectionUntil: number;
  attacksToday: number;
  attacksResetAt: number;
  lastAttackAt: number;
  revengeFrom: string[];
}

export interface Player {
  uid: string;
  vikingName: string;
  avatarId: string;
  level: number;
  xp: number;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  speed: number;
  currencies: Currencies;
  energy: RegeneratingPool;
  stamina: RegeneratingPool;
  equipment: Record<EquipSlot, string | null>;
  inventory: InventoryItem[];
  warriors: Warrior[];
  warriorCap: number;
  buildings: Record<BuildingId, BuildingState>;
  resourcesLastCollectedAt: number;
  questProgress: Record<string, { completions: number }>;
  currentChapter: number;
  territories: Record<TerritoryId, TerritoryStatus>;
  collections: Record<string, string[]>;
  clanId: string | null;
  friends: string[];
  friendRequests: string[];
  giftedToday: string[];
  pvp: PvpState;
  cosmetics: { avatars: string[]; villageDecor: string[] };
  equippedCosmetics: { avatar: string | null; village: string | null };
  battlePass: { seasonId: string; xp: number; premium: boolean };
  eventPasses: string[];
  dailyLogin: { lastClaimDate: string; streak: number };
  achievements: Record<string, boolean>;
  helpedClanToday: string[];
  activeBattle: BattleSession | null;
  createdAt: number;
  updatedAt: number;
}

export interface QuestDef {
  id: string;
  name: string;
  description: string;
  category: QuestCategory;
  chapter: number;
  energyCost: number;
  requiredLevel: number;
  enemyId?: string;
  rewards: { xp: number; silver: number; food?: number; wood?: number; iron?: number };
  lootTableId?: string;
}

export type CreatureType = 'animal' | 'monster';

export type HuntingMaterialId =
  | 'meat'
  | 'herbs'
  | 'wood'
  | 'ironPlate'
  | 'bronzePlate'
  | 'silverPlate'
  | 'goldPlate';

export interface DropRange {
  min: number;
  max: number;
}

export interface HuntingDrops {
  experience: DropRange;
  silver: DropRange;
  gold: DropRange;
  materials: { pool: HuntingMaterialId[] };
}

export interface HuntingRewards {
  xp: number;
  silver: number;
  gold?: number;
  meat?: number;
  herbs?: number;
  wood?: number;
  ironPlate?: number;
  bronzePlate?: number;
  silverPlate?: number;
  goldPlate?: number;
}

export interface EnemyDef {
  id: string;
  name: string;
  type: CreatureType;
  level: number;
  attack: number;
  defense: number;
  health: number;
  speed: number;
  lootTableId: string;
  staminaCost: number;
  drops: HuntingDrops;
  portraitUrl?: string;
}

export interface ItemDef {
  id: string;
  name: string;
  slot: EquipSlot;
  rarity: Rarity;
  weaponType?: WeaponType;
  attack: number;
  defense: number;
  health: number;
  speed: number;
  description?: string;
  bound?: boolean;
}

export interface LootEntry {
  itemId: string;
  weight: number;
}

export interface LootTableDef {
  id: string;
  entries: LootEntry[];
  dropChance: number;
}

export interface BuildingDef {
  id: BuildingId;
  name: string;
  description: string;
  maxLevel: number;
  produces?: Partial<Pick<Currencies, 'food' | 'wood' | 'iron' | 'silver'>>;
  perLevelRate: number;
}

export interface WarriorDef {
  id: string;
  name: string;
  class: WarriorClass;
  rarity: Rarity;
  baseAttack: number;
  baseDefense: number;
  recruitCost: Partial<Currencies>;
}

export interface TerritoryDef {
  id: TerritoryId;
  name: string;
  requiredLevel: number;
  requiredChapter: number;
  energyCost: number;
}

export interface BossDef {
  id: string;
  name: string;
  health: number;
  attack: number;
  defense: number;
  speed: number;
  staminaCost: number;
  clanRaid: boolean;
  lootTableId: string;
}

export interface CollectionDef {
  id: string;
  name: string;
  itemIds: string[];
  bonus: { attackPercent?: number; defensePercent?: number };
}

export interface EventDef {
  id: string;
  name: string;
  description: string;
  startsAt: number;
  endsAt: number;
  currencyName: string;
  rewards: string[];
}

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
}

export interface ShopProductDef {
  id: string;
  name: string;
  description: string;
  productType: 'runes' | 'cosmetic' | 'decoration' | 'battlePass' | 'eventPass' | 'speedup';
  runeCost?: number;
  runesGranted?: number;
  cosmeticId?: string;
  powerAffecting: boolean;
  storeSku?: string;
}

export interface DailyLoginDef {
  day: number;
  silver: number;
  food?: number;
  runes?: number;
}

export interface CatalogMap {
  quests: QuestDef[];
  enemies: EnemyDef[];
  items: ItemDef[];
  lootTables: LootTableDef[];
  buildings: BuildingDef[];
  warriors: WarriorDef[];
  territories: TerritoryDef[];
  bosses: BossDef[];
  collections: CollectionDef[];
  events: EventDef[];
  achievements: AchievementDef[];
  shopProducts: ShopProductDef[];
  dailyLogin: DailyLoginDef[];
}

export type CombatAction = 'attack' | 'special' | 'defend' | 'potion' | 'auto';

export type BattleActor = 'player' | 'enemy';

export type BattleKind = 'pve' | 'pvp' | 'boss' | 'clanRaid' | 'quest';

export type PlayerCombatAction = Exclude<CombatAction, 'auto'>;

export interface BattleCombatant {
  name: string;
  attack: number;
  defense: number;
  health: number;
  maxHealth: number;
  speed: number;
  atb: number;
  guarding: boolean;
  specialReadyIn: number;
  potionsRemaining: number;
  accuracy?: number;
  dodge?: number;
  critChance?: number;
  critDamage?: number;
}

export interface AtbBattleEvent {
  type: 'atb';
  playerFrom: number;
  playerTo: number;
  enemyFrom: number;
  enemyTo: number;
  durationMs: number;
}

export interface ActionBattleEvent {
  type: 'action';
  actor: BattleActor;
  action: PlayerCombatAction;
  damage: number;
  heal: number;
  critical: boolean;
  hit: boolean;
  playerHp: number;
  enemyHp: number;
  playerAtb: number;
  enemyAtb: number;
}

export type BattleEvent = AtbBattleEvent | ActionBattleEvent;

export type BattlePending =
  | { kind: 'pve'; enemyId: string; enemyLevel: number; lootTableId: string }
  | {
      kind: 'quest';
      questId: string;
      rewards: QuestDef['rewards'];
      lootTableId?: string;
    }
  | { kind: 'pvp'; defenderUid: string }
  | { kind: 'boss'; bossId: string; lootTableId: string }
  | { kind: 'clanRaid'; bossId: string; lootTableId: string };

export interface BattleSession {
  id: string;
  kind: BattleKind;
  title: string;
  opponentName: string;
  player: BattleCombatant;
  enemy: BattleCombatant;
  waitingFor: 'player' | 'done';
  actionCount: number;
  attackerDamage: number;
  defenderDamage: number;
  critical: boolean;
  pending: BattlePending;
}

export interface CombatResult {
  attackerDamage: number;
  defenderDamage: number;
  critical: boolean;
  attackerWon: boolean;
  attackerHpRemaining: number;
  defenderHpRemaining: number;
}

export interface CombatCallableResult {
  player: Player;
  battle: BattleSession | null;
  events: BattleEvent[];
  combat: CombatResult | null;
  loot: ItemDef | null;
  rewards: QuestDef['rewards'] | HuntingRewards | null;
  stolen?: number;
}

export interface Clan {
  id: string;
  name: string;
  bannerId: string;
  level: number;
  xp: number;
  leaderUid: string;
  memberUids: string[];
  treasury: Currencies;
  upgrades: Record<string, number>;
  createdAt: number;
}

export interface ClanChatMessage {
  id: string;
  uid: string;
  vikingName: string;
  text: string;
  createdAt: number;
}

export interface BattleRecord {
  id: string;
  attackerUid: string;
  defenderUid: string;
  attackerName: string;
  defenderName: string;
  attackerWon: boolean;
  silverStolen: number;
  createdAt: number;
  kind: 'pvp' | 'pve' | 'boss' | 'clanRaid';
}

export interface LiveOpsConfig {
  featureFlags: {
    pvp: boolean;
    clans: boolean;
    events: boolean;
    shop: boolean;
    worldBoss: boolean;
    alphaGate: boolean;
  };
  tunables: {
    pvpLevelBand: number;
    pvpDailyAttackLimit: number;
    pvpCooldownMs: number;
    pvpProtectionMs: number;
    warriorCap: number;
  };
}

export interface AllowlistConfig {
  emails: string[];
}
