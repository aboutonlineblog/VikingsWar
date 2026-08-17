import { CATALOG_DOC_IDS, FIRESTORE_COLLECTIONS } from '@shared/ids';
import type {
  AchievementDef,
  BossDef,
  BuildingDef,
  CollectionDef,
  EnemyDef,
  EventDef,
  ItemDef,
  LiveOpsConfig,
  QuestDef,
  ShopProductDef,
  TerritoryDef,
  WarriorDef,
} from '@shared/types';
import { getDocData } from '@/lib/firebase/firestore';

async function fetchCatalog<T>(id: string): Promise<T[]> {
  const doc = await getDocData<{ items: T[] }>(FIRESTORE_COLLECTIONS.catalogs, id);
  return doc?.items ?? [];
}

export function fetchQuests(): Promise<QuestDef[]> {
  return fetchCatalog(CATALOG_DOC_IDS.quests);
}

export function fetchEnemies(): Promise<EnemyDef[]> {
  return fetchCatalog(CATALOG_DOC_IDS.enemies);
}

export function fetchItems(): Promise<ItemDef[]> {
  return fetchCatalog(CATALOG_DOC_IDS.items);
}

export function fetchBuildings(): Promise<BuildingDef[]> {
  return fetchCatalog(CATALOG_DOC_IDS.buildings);
}

export function fetchWarriors(): Promise<WarriorDef[]> {
  return fetchCatalog(CATALOG_DOC_IDS.warriors);
}

export function fetchTerritories(): Promise<TerritoryDef[]> {
  return fetchCatalog(CATALOG_DOC_IDS.territories);
}

export function fetchBosses(): Promise<BossDef[]> {
  return fetchCatalog(CATALOG_DOC_IDS.bosses);
}

export function fetchCollections(): Promise<CollectionDef[]> {
  return fetchCatalog(CATALOG_DOC_IDS.collections);
}

export function fetchEvents(): Promise<EventDef[]> {
  return fetchCatalog(CATALOG_DOC_IDS.events);
}

export function fetchAchievements(): Promise<AchievementDef[]> {
  return fetchCatalog(CATALOG_DOC_IDS.achievements);
}

export function fetchShopProducts(): Promise<ShopProductDef[]> {
  return fetchCatalog(CATALOG_DOC_IDS.shopProducts);
}

export async function fetchLiveOps(): Promise<LiveOpsConfig | null> {
  return getDocData<LiveOpsConfig>(FIRESTORE_COLLECTIONS.config, 'liveOps');
}
