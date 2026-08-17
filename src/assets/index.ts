import type { ImageSourcePropType } from 'react-native';
import type { BuildingId, EquipSlot, TerritoryId, WarriorClass } from '@shared/types';

export type NavIconName =
  | 'home'
  | 'battle'
  | 'world'
  | 'clan'
  | 'viking'
  | 'inventory'
  | 'shop'
  | 'settings';

export type ResourceIconName = 'silver' | 'gold' | 'food' | 'wood' | 'iron' | 'runes';

export type HudStatIconName = 'health' | 'energy' | 'stamina' | 'attack' | 'defense' | 'speed';

export type RankName = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'champion';

export const images = {
  logo: require('./brand/logo.png') as ImageSourcePropType,
  splash: require('./brand/splash.png') as ImageSourcePropType,
  bgAuthSignIn: require('./backgrounds/bg_auth_signin.png') as ImageSourcePropType,
  bgAuthRegister: require('./backgrounds/bg_auth_register.png') as ImageSourcePropType,
  bgCreateViking: require('./backgrounds/bg_create_viking.png') as ImageSourcePropType,
  portraitHud: require('./characters/player/portrait_hud.png') as ImageSourcePropType,
  characterFront: require('./characters/player/character_front.png') as ImageSourcePropType,
  portraitWolf: require('./characters/player/portrait_wolf.png') as ImageSourcePropType,
  portraitRaven: require('./characters/player/portrait_raven.png') as ImageSourcePropType,
  portraitBear: require('./characters/player/portrait_bear.png') as ImageSourcePropType,
  portraitSerpent: require('./characters/player/portrait_serpent.png') as ImageSourcePropType,
  warriorBerserker: require('./characters/warriors/warrior_berserker.png') as ImageSourcePropType,
  warriorShieldmaiden: require('./characters/warriors/warrior_shieldmaiden.png') as ImageSourcePropType,
  warriorArcher: require('./characters/warriors/warrior_archer.png') as ImageSourcePropType,
  buildingGreatHall: require('./buildings/building_great_hall.png') as ImageSourcePropType,
  buildingFarm: require('./buildings/building_farm.png') as ImageSourcePropType,
  buildingBlacksmith: require('./buildings/building_blacksmith.png') as ImageSourcePropType,
  buildingBarracks: require('./buildings/building_barracks.png') as ImageSourcePropType,
  buildingShipyard: require('./buildings/building_shipyard.png') as ImageSourcePropType,
  buildingTemple: require('./buildings/building_temple.png') as ImageSourcePropType,
  worldMap: require('./world/world_map.png') as ImageSourcePropType,
  battleStage: require('./world/battle_stage.png') as ImageSourcePropType,
  panoramaVillage: require('./world/panorama_village.png') as ImageSourcePropType,
  panoramaCoast: require('./world/panorama_coast.png') as ImageSourcePropType,
  panoramaForest: require('./world/panorama_forest.png') as ImageSourcePropType,
  panoramaMountains: require('./world/panorama_mountains.png') as ImageSourcePropType,
  panoramaKingdom: require('./world/panorama_kingdom.png') as ImageSourcePropType,
  panoramaLegendary: require('./world/panorama_legendary.png') as ImageSourcePropType,
  resourceSilver: require('./icons/resources/icon_resource_silver.png') as ImageSourcePropType,
  resourceWood: require('./icons/resources/icon_resource_wood.png') as ImageSourcePropType,
  resourceIron: require('./icons/resources/icon_resource_iron.png') as ImageSourcePropType,
  resourceRunes: require('./icons/resources/icon_resource_runes.png') as ImageSourcePropType,
  resourceFood: require('./icons/resources/icon_resource_food.png') as ImageSourcePropType,
  itemWeapon: require('./equipment/item_weapon.png') as ImageSourcePropType,
  itemHelmet: require('./equipment/item_helmet.png') as ImageSourcePropType,
  itemArmor: require('./equipment/item_armor.png') as ImageSourcePropType,
  itemShield: require('./equipment/item_shield.png') as ImageSourcePropType,
  itemRing: require('./equipment/item_ring.png') as ImageSourcePropType,
  itemAmulet: require('./equipment/item_amulet.png') as ImageSourcePropType,
  itemBoots: require('./equipment/item_boots.png') as ImageSourcePropType,
  itemIronAxe: require('./equipment/item_iron_axe.png') as ImageSourcePropType,
  itemOakSpear: require('./equipment/item_oak_spear.png') as ImageSourcePropType,
  itemSeaxBlade: require('./equipment/item_seax_blade.png') as ImageSourcePropType,
  itemDaneAxe: require('./equipment/item_dane_axe.png') as ImageSourcePropType,
  itemYewBow: require('./equipment/item_yew_bow.png') as ImageSourcePropType,
  itemIronHelm: require('./equipment/item_iron_helm.png') as ImageSourcePropType,
  itemMailShirt: require('./equipment/item_mail_shirt.png') as ImageSourcePropType,
  itemRoundShield: require('./equipment/item_round_shield.png') as ImageSourcePropType,
  itemRaiderBoots: require('./equipment/item_raider_boots.png') as ImageSourcePropType,
  itemWolfRing: require('./equipment/item_wolf_ring.png') as ImageSourcePropType,
  itemMjolnirShard: require('./equipment/item_mjolnir_shard.png') as ImageSourcePropType,
  itemOdinRaven: require('./equipment/item_odin_raven.png') as ImageSourcePropType,
  itemAncientRune: require('./equipment/item_ancient_rune.png') as ImageSourcePropType,
  itemVikingCrown: require('./equipment/item_viking_crown.png') as ImageSourcePropType,
  itemDragonShield: require('./equipment/item_dragon_shield.png') as ImageSourcePropType,
  itemSeason1CloakPin: require('./equipment/item_season1_cloak_pin.png') as ImageSourcePropType,
  navHome: require('./icons/navigation/icon_nav_home.png') as ImageSourcePropType,
  navBattle: require('./icons/navigation/icon_nav_battle.png') as ImageSourcePropType,
  navWorld: require('./icons/navigation/icon_nav_world.png') as ImageSourcePropType,
  navClan: require('./icons/navigation/icon_nav_clan.png') as ImageSourcePropType,
  navViking: require('./icons/navigation/icon_nav_viking.png') as ImageSourcePropType,
  navInventory: require('./icons/navigation/icon_nav_inventory.png') as ImageSourcePropType,
  navShop: require('./icons/navigation/icon_nav_shop.png') as ImageSourcePropType,
  navSettings: require('./icons/navigation/icon_nav_settings.png') as ImageSourcePropType,
  combatAttack: require('./icons/combat/icon_combat_attack.png') as ImageSourcePropType,
  combatSpecial: require('./icons/combat/icon_combat_special.png') as ImageSourcePropType,
  combatDefend: require('./icons/combat/icon_combat_defend.png') as ImageSourcePropType,
  combatPotion: require('./icons/combat/icon_combat_potion.png') as ImageSourcePropType,
  bannerKnot: require('./social/banner_knot.png') as ImageSourcePropType,
  bannerRaven: require('./social/banner_raven.png') as ImageSourcePropType,
  bannerBear: require('./social/banner_bear.png') as ImageSourcePropType,
  bannerRune: require('./social/banner_rune.png') as ImageSourcePropType,
  rankBronze: require('./social/rank_bronze.png') as ImageSourcePropType,
  rankSilver: require('./social/rank_silver.png') as ImageSourcePropType,
  rankGold: require('./social/rank_gold.png') as ImageSourcePropType,
  rankPlatinum: require('./social/rank_platinum.png') as ImageSourcePropType,
  rankDiamond: require('./social/rank_diamond.png') as ImageSourcePropType,
  rankChampion: require('./social/rank_champion.png') as ImageSourcePropType,
  chestWood: require('./ui/chest_wood.png') as ImageSourcePropType,
  chestIron: require('./ui/chest_iron.png') as ImageSourcePropType,
  chestGold: require('./ui/chest_gold.png') as ImageSourcePropType,
  iconMail: require('./icons/status/icon_mail.png') as ImageSourcePropType,
  iconFriends: require('./icons/status/icon_friends.png') as ImageSourcePropType,
  iconCrown: require('./icons/status/icon_crown.png') as ImageSourcePropType,
  iconTrophy: require('./icons/status/icon_trophy.png') as ImageSourcePropType,
  iconAlert: require('./icons/status/icon_alert.png') as ImageSourcePropType,
  iconCalendar: require('./icons/status/icon_calendar.png') as ImageSourcePropType,
  iconGift: require('./icons/status/icon_gift.png') as ImageSourcePropType,
  iconHandshake: require('./icons/status/icon_handshake.png') as ImageSourcePropType,
  hudHealth: require('./icons/hud/icon_hud_health.png') as ImageSourcePropType,
  hudEnergy: require('./icons/hud/icon_hud_energy.png') as ImageSourcePropType,
  hudStamina: require('./icons/hud/icon_hud_stamina.png') as ImageSourcePropType,
  hudAttack: require('./icons/hud/icon_hud_attack.png') as ImageSourcePropType,
  hudDefense: require('./icons/hud/icon_hud_defense.png') as ImageSourcePropType,
  hudSpeed: require('./icons/hud/icon_hud_speed.png') as ImageSourcePropType,
  hudChevronDown: require('./icons/hud/icon_hud_chevron_down.png') as ImageSourcePropType,
  hudSettings: require('./icons/hud/icon_hud_settings.png') as ImageSourcePropType,
  hudClock: require('./icons/hud/icon_hud_clock.png') as ImageSourcePropType,
  hudPortraitFrame: require('./icons/hud/icon_hud_portrait_frame.png') as ImageSourcePropType,
  hudLevelBadge: require('./icons/hud/icon_hud_level_badge.png') as ImageSourcePropType,
};

const HUD_STAT_ICONS: Record<HudStatIconName, ImageSourcePropType> = {
  health: images.hudHealth,
  energy: images.hudEnergy,
  stamina: images.hudStamina,
  attack: images.hudAttack,
  defense: images.hudDefense,
  speed: images.hudSpeed,
};

const RESOURCE_ICONS: Record<ResourceIconName, ImageSourcePropType> = {
  silver: images.resourceSilver,
  gold: images.rankGold,
  food: images.resourceFood,
  wood: images.resourceWood,
  iron: images.resourceIron,
  runes: images.resourceRunes,
};

const BUILDING_ART: Record<BuildingId, ImageSourcePropType> = {
  greatHall: images.buildingGreatHall,
  farm: images.buildingFarm,
  lumberCamp: images.buildingFarm,
  ironMine: images.buildingBlacksmith,
  blacksmith: images.buildingBlacksmith,
  barracks: images.buildingBarracks,
  shipyard: images.buildingShipyard,
  tradingPost: images.buildingGreatHall,
  temple: images.buildingTemple,
};

const WARRIOR_ART: Record<WarriorClass, ImageSourcePropType> = {
  berserker: images.warriorBerserker,
  shieldmaiden: images.warriorShieldmaiden,
  archer: images.warriorArcher,
  raider: images.warriorBerserker,
};

const SLOT_ART: Record<EquipSlot, ImageSourcePropType> = {
  weapon: images.itemWeapon,
  helmet: images.itemHelmet,
  armor: images.itemArmor,
  shield: images.itemShield,
  boots: images.itemBoots,
  ring: images.itemRing,
  amulet: images.itemAmulet,
  necklace: images.itemAmulet,
  bracelet: images.itemRing,
  earrings: images.itemRing,
  headband: images.itemHelmet,
};

export const CATALOG_ITEM_IDS = [
  'iron_axe',
  'oak_spear',
  'seax_blade',
  'dane_axe',
  'yew_bow',
  'iron_helm',
  'mail_shirt',
  'round_shield',
  'raider_boots',
  'wolf_ring',
  'mjolnir_shard',
  'odin_raven',
  'ancient_rune',
  'viking_crown',
  'dragon_shield',
  'season1_cloak_pin',
  'amber_necklace',
  'iron_bracelet',
  'silver_bracelet',
  'raven_earrings',
  'leather_headband',
  'storm_headband',
] as const;

const ITEM_ART: Record<string, ImageSourcePropType> = {
  iron_axe: images.itemIronAxe,
  oak_spear: images.itemOakSpear,
  seax_blade: images.itemSeaxBlade,
  dane_axe: images.itemDaneAxe,
  yew_bow: images.itemYewBow,
  iron_helm: images.itemIronHelm,
  mail_shirt: images.itemMailShirt,
  round_shield: images.itemRoundShield,
  raider_boots: images.itemRaiderBoots,
  wolf_ring: images.itemWolfRing,
  mjolnir_shard: images.itemMjolnirShard,
  odin_raven: images.itemOdinRaven,
  ancient_rune: images.itemAncientRune,
  viking_crown: images.itemVikingCrown,
  dragon_shield: images.itemDragonShield,
  season1_cloak_pin: images.itemSeason1CloakPin,
};

const TERRITORY_ART: Record<TerritoryId, ImageSourcePropType> = {
  village: images.panoramaVillage,
  coastalLands: images.panoramaCoast,
  northernForest: images.panoramaForest,
  frozenMountains: images.panoramaMountains,
  enemyKingdom: images.panoramaKingdom,
  legendaryLands: images.panoramaLegendary,
};

const NAV_ICONS: Record<NavIconName, ImageSourcePropType> = {
  home: images.navHome,
  battle: images.navBattle,
  world: images.navWorld,
  clan: images.navClan,
  viking: images.navViking,
  inventory: images.navInventory,
  shop: images.navShop,
  settings: images.navSettings,
};

const RANK_ART: Record<RankName, ImageSourcePropType> = {
  bronze: images.rankBronze,
  silver: images.rankSilver,
  gold: images.rankGold,
  platinum: images.rankPlatinum,
  diamond: images.rankDiamond,
  champion: images.rankChampion,
};

const AVATAR_ART: Record<string, ImageSourcePropType> = {
  wolf: images.portraitWolf,
  raven: images.portraitRaven,
  bear: images.portraitBear,
  serpent: images.portraitSerpent,
};

const BANNER_ART = [images.bannerKnot, images.bannerRaven, images.bannerBear, images.bannerRune];

export function resourceIcon(id: ResourceIconName): ImageSourcePropType {
  return RESOURCE_ICONS[id];
}

export function hudStatIcon(name: HudStatIconName): ImageSourcePropType {
  return HUD_STAT_ICONS[name];
}

export function buildingArt(id: BuildingId): ImageSourcePropType {
  return BUILDING_ART[id];
}

export function warriorArt(warriorClass: WarriorClass): ImageSourcePropType {
  return WARRIOR_ART[warriorClass];
}

export function itemSlotArt(slot: EquipSlot): ImageSourcePropType {
  return SLOT_ART[slot];
}

export function itemArt(itemId: string, fallbackSlot?: EquipSlot): ImageSourcePropType {
  return ITEM_ART[itemId] ?? (fallbackSlot ? SLOT_ART[fallbackSlot] : images.itemWeapon);
}

export function territoryArt(id: TerritoryId): ImageSourcePropType {
  return TERRITORY_ART[id];
}

export function navIcon(name: NavIconName): ImageSourcePropType {
  return NAV_ICONS[name];
}

export function rankArt(name: RankName): ImageSourcePropType {
  return RANK_ART[name];
}

export function avatarArt(avatarId: string): ImageSourcePropType {
  return AVATAR_ART[avatarId] ?? images.portraitHud;
}

export function clanBannerArt(bannerId: string): ImageSourcePropType {
  const index = Math.abs(hashString(bannerId)) % BANNER_ART.length;
  return BANNER_ART[index];
}

export function prestigeRank(prestige: number): RankName {
  if (prestige >= 1000) {
    return 'champion';
  }
  if (prestige >= 750) {
    return 'diamond';
  }
  if (prestige >= 500) {
    return 'platinum';
  }
  if (prestige >= 250) {
    return 'gold';
  }
  if (prestige >= 100) {
    return 'silver';
  }
  return 'bronze';
}

export function lootChestArt(lootName: string | null): ImageSourcePropType {
  if (!lootName) {
    return images.chestWood;
  }
  const lower = lootName.toLowerCase();
  if (lower.includes('legendary') || lower.includes('mythic') || lower.includes('dragon') || lower.includes('crown')) {
    return images.chestGold;
  }
  if (lower.includes('epic') || lower.includes('rare') || lower.includes('rune') || lower.includes('mjolnir')) {
    return images.chestIron;
  }
  return images.chestWood;
}

function hashString(value: string): number {
  return value.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
}
