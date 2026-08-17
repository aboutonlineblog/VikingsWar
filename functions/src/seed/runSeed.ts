import { CATALOG_DOC_IDS, FIRESTORE_COLLECTIONS } from '../../../shared/ids';
import { DEFAULT_LIVE_OPS } from '../lib/context';
import {
  achievements,
  bosses,
  buildings,
  collections,
  dailyLogin,
  enemies,
  events,
  items,
  lootTables,
  quests,
  shopProducts,
  territories,
  warriors,
} from './catalogs';
import { assertSeedTargetAllowed, isEmulatorSeed } from './seedGuard';
import { loadSeedDb } from './loadSeedDb';

async function seed(): Promise<void> {
  assertSeedTargetAllowed(process.env);
  const db = await loadSeedDb();

  const catalogs: Record<string, unknown[]> = {
    [CATALOG_DOC_IDS.quests]: quests,
    [CATALOG_DOC_IDS.enemies]: enemies,
    [CATALOG_DOC_IDS.items]: items,
    [CATALOG_DOC_IDS.lootTables]: lootTables,
    [CATALOG_DOC_IDS.buildings]: buildings,
    [CATALOG_DOC_IDS.warriors]: warriors,
    [CATALOG_DOC_IDS.territories]: territories,
    [CATALOG_DOC_IDS.bosses]: bosses,
    [CATALOG_DOC_IDS.collections]: collections,
    [CATALOG_DOC_IDS.events]: events,
    [CATALOG_DOC_IDS.achievements]: achievements,
    [CATALOG_DOC_IDS.shopProducts]: shopProducts,
    [CATALOG_DOC_IDS.dailyLogin]: dailyLogin,
  };

  await Promise.all(
    Object.entries(catalogs).map(([id, itemsForDoc]) =>
      db.collection(FIRESTORE_COLLECTIONS.catalogs).doc(id).set({ items: itemsForDoc }),
    ),
  );

  await db.collection(FIRESTORE_COLLECTIONS.config).doc('liveOps').set(DEFAULT_LIVE_OPS);
  await db.collection(FIRESTORE_COLLECTIONS.config).doc('allowlist').set({ emails: [] });
  await db.collection(FIRESTORE_COLLECTIONS.world).doc('currentBoss').set({
    bossId: 'frost_giant',
    hp: 10_000_000,
    maxHp: 10_000_000,
    contributions: {},
  });
  console.log(isEmulatorSeed(process.env) ? 'Seed complete (emulator).' : 'Seed complete (live).');
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
