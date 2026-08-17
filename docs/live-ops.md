# Live operations

New content ships as Firestore catalog documents. Do not wait for an app binary.

## Catalogs

Collection `catalogs`, documents:

- quests
- enemies
- items
- lootTables
- buildings
- warriors
- territories
- bosses
- collections
- events
- achievements
- shopProducts
- dailyLogin

Each document is `{ items: [...] }` matching the TypeScript types in `shared/types.ts`.

## Feature flags

Document `config/liveOps`:

- `featureFlags.pvp`, `clans`, `events`, `shop`, `worldBoss`, `alphaGate`
- `tunables` for PvP band, daily attack limit, cooldown, protection, warrior cap

## Adding a season

1. Insert quest/item/event docs (see seed `season1_ragnarok_scout` and `season1_cloak_pin`).
2. Set event `startsAt` / `endsAt`.
3. No app store release required.

## Cadence

- Every few weeks: quests, equipment, events, bosses, cosmetics
- Every few months: new territory, clan feature, story chapter
