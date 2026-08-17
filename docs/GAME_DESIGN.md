# Vikings War — Game Design Document

## Title

**Vikings War**

Working title and shipping title.

## Setting and lore

Players are jarls of a coastal Norse settlement. They raid, gather, craft, and swear oaths under the old gods. The world stretches from a home village through coastal lands, northern forests, frozen mountains, rival kingdoms, and legendary realms. Mythology is a gameplay layer (temple blessings, relic collections, Ragnarok events), not a cutscene dump.

## Target audience

Casual and mid-core mobile RPG players, roughly 16–40, who want short sessions with visible progression. Sessions last **3–10 minutes**.

## Core gameplay loop

```text
Log in
  → Collect village resources
  → Complete quests / raids
  → Earn XP + Silver + Loot
  → Upgrade Viking
  → Recruit warriors
  → Upgrade village
  → Fight enemies / players
  → Unlock new territories
  → Repeat
```

## Monetization philosophy

Pay for convenience, customization, and extra attempts — never guaranteed victory.

- Free: quests, progression, PvP, village, clans
- Paid (Runes): speed-ups, cosmetics, battle/event passes, extra attempts
- Cosmetic and convenience products are flagged `powerAffecting: false`
- Combat outcomes, loot, XP, and currency grants are server-authoritative

## Single-player vs PvP

PvE (quests, village, bosses) is the foundation. Asynchronous PvP raids unlock after the player can complete early chapters. Clans add cooperative raids and social pressure without requiring real-time battles.

## Session length

3–10 minutes. Energy and stamina gate longer grinds. Village timers create a reason to return.

## Art direction

Dark Nordic UI: charcoal backgrounds, iron and gold metal, blood-red accents, parchment text, runic ornament. Stylized, readable, not photoreal.

## Platform

iOS and Android. Bundle ID: `com.atomicdevs.vikingswar`.

## Technology stack

- React Native CLI (not Expo) + TypeScript
- React Navigation
- TanStack Query for server state
- Firebase Auth, Firestore, Cloud Functions, Storage
- Local development against Firebase emulators
- Game rules live in Cloud Functions; catalogs live in Firestore

## Energy and stamina

| Pool    | Max | Used for                         | Regen          |
|---------|-----|----------------------------------|----------------|
| Energy  | 100 | Quests, hunting, exploration     | +1 / 5 minutes |
| Stamina | 20  | Raids, PvP, battles              | +1 / 15 minutes |

Stored as `{ current, max, lastUpdatedAt }`. Regeneration is computed from elapsed time on the server. The database is not ticked.

## Resources

| Resource | Purpose |
|----------|---------|
| Silver   | General purchases, warrior upkeep flavor, PvP spoils |
| Food     | Warriors, some activities |
| Wood     | Construction |
| Iron     | Equipment and buildings |
| Runes    | Premium / special currency |

## Server authority

The client never decides: money received, attack success, damage, XP, items, building completion, or PvP results. Those calculations run in Cloud Functions.
