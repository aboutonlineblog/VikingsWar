# Viking Game — Complete Development Roadmap

A mobile-first Viking social RPG inspired by the gameplay loop of Mafia Wars, but with its own mechanics, economy, art direction, and progression.

## Phase 0 — Game Vision & Rules

**Goal:** Lock down what we're building before writing code.

Define:

- Game title / working title
- Viking setting and lore
- Target audience
- Core gameplay loop
- Monetization philosophy
- Single-player vs. PvP emphasis
- Session length
- Art direction
- Platform: iOS + Android
- Technology stack

### Core Loop

```text
Log in
   ↓
Collect village resources
   ↓
Complete quests / raids
   ↓
Earn XP + Silver + Loot
   ↓
Upgrade Viking
   ↓
Recruit warriors
   ↓
Upgrade village
   ↓
Fight enemies / players
   ↓
Unlock new territories
   ↓
Repeat
```

**Deliverable:** Game Design Document (GDD)

---

## Phase 1 — Technical Foundation

**Goal:** Build the foundation that everything else will use.

### Mobile

- React Native
- TypeScript
- React Navigation
- State management
- API client
- Secure authentication
- Local caching
- Push notifications
- Analytics
- Crash reporting

### Backend

Recommended starting stack:

- Firebase
- Firestore database
- Cloud object storage for assets (Firebase storage)
- Background job system in Firebase Functions

### Core Backend Systems

- Authentication
- Players
- Characters
- Inventory
- Currencies
- Equipment
- Quests
- Combat
- Buildings
- Resources
- Clans
- Notifications
- Leaderboards

### Security

The client should never determine:

- How much money the player receives
- Whether an attack succeeds
- Damage dealt
- XP awarded
- Items received
- Building completion
- PvP results

Those calculations should happen on the server.

**Deliverable:** Running mobile app + functioning backend + database.

---

## Phase 2 — Player Account & Character

Build the player's basic identity.

### Player

- Account
- Viking name
- Avatar
- Level
- XP
- Health
- Attack
- Defense
- Stamina
- Energy
- Silver
- Food
- Wood
- Iron

### Progression

```text
Level 1
   ↓
XP
   ↓
Level 2
   ↓
New equipment
   ↓
New quest
   ↓
New building
```

Implement:

- XP system
- Level-up rewards
- Stat calculation
- Resource storage
- Daily login

**Deliverable:** A functional Viking character that can level up.

---

## Phase 3 — Energy & Stamina System

This becomes one of the major foundations of the game.

### Energy

Used for:

- Quests
- Hunting
- Exploration
- Gathering

Example:

```text
Maximum Energy: 100

Quest:
Cost = 10 Energy

Regeneration:
+1 every 5 minutes
```

### Stamina

Used for:

- Raids
- PvP
- Battles

Example:

```text
Maximum Stamina: 20

Raid:
Cost = 2 Stamina

Regeneration:
+1 every 15 minutes
```

Important:

Don't store regeneration by constantly updating the database. Store the current amount, maximum amount, and last update timestamp, then calculate regeneration from elapsed time.

**Deliverable:** Reliable server-authoritative energy and stamina system.

---

## Phase 4 — Quest & Job System

This is where the Mafia Wars-style gameplay starts becoming fun.

Create a data-driven quest system.

Example:

### Raid the Coastal Village

```text
Energy Cost: 8

Requirements:
Level 3

Rewards:
XP: 50
Silver: 125
Wood: 10
Chance of Axe: 3%
```

### Quest Categories

- Hunting
- Gathering
- Raiding
- Exploration
- Trading
- Warfare
- Mythology
- Boss quests

### Quest Progression

```text
Chapter 1
The First Raid

Chapter 2
Blood on the Coast

Chapter 3
The Enemy Jarl

Chapter 4
Across the Sea

Chapter 5
The Northern Kingdom
```

Make quests data-driven rather than hardcoding every quest into React Native. This allows hundreds of quests to be added later without requiring a new app release.

**Deliverable:** Data-driven quest engine.

---

## Phase 5 — Combat System

One of the most important phases.

Start with PvE.

### Basic Combat

```text
Player Attack
vs
Enemy Defense
```

Possible calculation:

```text
Base Damage
+ Weapon Bonus
+ Warrior Bonus
+ Buffs
- Enemy Defense
```

Then introduce:

- Critical hits
- Damage variance
- Special abilities
- Enemy types
- Bosses

Example:

```text
Viking Attack: 420
Enemy Defense: 300

Base Damage: 120
Critical Chance: 10%

Result:
Enemy takes 120–180 damage
```

Keep the actual formula server-side.

**Deliverable:** Fun, server-authoritative PvE combat.

---

## Phase 6 — Equipment & Loot

Introduce the RPG layer.

### Equipment Slots

- Weapon
- Helmet
- Armor
- Shield
- Boots
- Ring
- Amulet

### Equipment Rarity

```text
Common
Uncommon
Rare
Epic
Legendary
Mythic
```

### Viking Weapons

- Axe
- Sword
- Spear
- Bow
- Dane axe
- Seax

### Loot System

```text
Quest
  ↓
Loot table
  ↓
Server roll
  ↓
Item
```

Example:

```text
Iron Axe
Attack +18

Drop chance:
Common: 15%
Rare: 3%
Epic: 0.5%
```

This provides the foundation for a long-term collection system.

**Deliverable:** Inventory, equipment, rarity, and loot-table systems.

---

## Phase 7 — Viking Clan / Warband

This replaces the Mafia system conceptually.

Players can recruit warriors.

Example:

```text
Your Warband

8/20 Warriors

Berserker
Attack: 80

Shieldmaiden
Defense: 70

Archer
Attack: 60

Raider
Attack: 50
```

Warriors can have:

- Level
- Class
- Rarity
- Attack
- Defense
- Abilities
- Equipment

**Deliverable:** Recruitable and upgradeable Viking warrior system.

---

## Phase 8 — Village / Settlement

A major game system.

The player gets a Viking settlement.

### Buildings

**Great Hall**
- Controls overall progression.

**Farm**
- Produces Food.

**Lumber Camp**
- Produces Wood.

**Iron Mine**
- Produces Iron.

**Blacksmith**
- Crafts equipment.

**Barracks**
- Trains warriors.

**Shipyard**
- Builds longships.

**Trading Post**
- Generates Silver.

**Temple**
- Provides Norse blessings/buffs.

### Building Progression

```text
Farm Level 1
     ↓
Farm Level 2
     ↓
Farm Level 3
     ↓
Farm Level 4
     ↓
...
```

Each upgrade can require:

- Wood
- Iron
- Silver
- Time

This creates a second major gameplay loop:

**Play → collect → build → wait → return**

**Deliverable:** Functional Viking settlement with upgradeable buildings.

---

## Phase 9 — Resource Economy

Balance the game's economy.

### Primary Resources

| Resource | Purpose |
|---|---|
| Silver | General purchases |
| Food | Warriors / activities |
| Wood | Construction |
| Iron | Equipment |
| Rune | Premium/special currency |

### Premium Currency

**Runes**

Potential uses:

- Speed-ups
- Special equipment
- Extra attempts
- Cosmetic items
- Event purchases

Be careful to make the economy rewarding without making the game aggressively pay-to-win.

**Deliverable:** Balanced resource generation and spending model.

---

## Phase 10 — PvP

Introduce PvP only after PvE and the economy are stable.

### Viking Raid

```text
ATTACKER
    ↓
Battle calculation
    ↓
DEFENDER
    ↓
Result
```

Possible rewards:

- Silver
- Prestige
- Loot
- War Points

Possible consequences:

- Protection period
- Revenge attacks
- Battle history

### Anti-Abuse Systems

Implement:

- Level-based matchmaking
- Attack limits
- Cooldowns
- Protection
- Daily PvP limits
- Suspicious activity detection

**Deliverable:** Fair, server-authoritative asynchronous PvP.

---

## Phase 11 — Clan System

Expand Warbands into actual social clans.

### Viking Clan Features

- Clan name
- Clan banner
- Clan level
- Members
- Clan chat
- Clan treasury
- Clan quests
- Clan upgrades
- Clan leaderboard

**Deliverable:** Fully functional social clan system.

---

## Phase 12 — Territory & World Map

Introduce the larger world.

Example:

```text
Your Village
      ↓
Coastal Lands
      ↓
Northern Forest
      ↓
Frozen Mountains
      ↓
Enemy Kingdom
      ↓
Legendary Lands
```

Players can:

- Explore
- Raid
- Conquer
- Establish settlements
- Discover treasures
- Fight bosses

**Deliverable:** Expandable world map and territory progression.

---

## Phase 13 — Bosses & Raids

Introduce major PvE encounters.

Examples:

- Enemy Jarl
- Frost Giant
- Berserker King
- Sea Serpent
- Draugr
- Legendary Warrior

### Clan Raid Example

```text
Frost Giant

HP: 10,000,000

Clan members attack
       ↓
Damage accumulates
       ↓
Boss defeated
       ↓
Everyone receives rewards
```

**Deliverable:** Individual and cooperative boss/raid systems.

---

## Phase 14 — Collections

A Mafia Wars-style collection mechanic can work very well here.

### Example: Viking Relics

Collect:

- Thor's Hammer fragment
- Odin's Raven
- Ancient Rune
- Viking Crown
- Dragon Shield

Complete:

```text
5/5 Relics
```

Reward:

**+10% Attack permanently**

Other collections:

- Weapons
- Ships
- Relics
- Armor
- Treasures
- Monster trophies

**Deliverable:** Collection sets with completion rewards.

---

## Phase 15 — Events

Critical for long-term retention.

### Ragnarok

30-day event.

Players fight monsters and earn:

- Event currency
- Exclusive equipment
- Avatar
- Village decoration

### Raid Week

PvP rewards are doubled.

### Viking Festival

Special quests and cosmetics.

### World Boss

All players cooperate to defeat a global boss.

Events should be server-controlled so new events and rewards can be configured without requiring a new app version.

**Deliverable:** Configurable live-event framework.

---

## Phase 16 — Social Features

Build:

- Friends
- Gifts
- Clan chat
- Player profiles
- Visiting villages
- Helping clan members
- Revenge system
- Leaderboards
- Achievements

Social interaction should provide meaningful rewards and reasons to return.

**Deliverable:** Complete social layer.

---

## Phase 17 — Monetization

Only after the core game is fun.

### Free Gameplay

- Normal quests
- Normal progression
- PvP
- Village building
- Clan participation

### Purchases

- Runes
- Cosmetic skins
- Viking outfits
- Village decorations
- Battle passes
- Event passes
- Convenience items

Recommended philosophy:

**Pay for convenience, customization, and additional opportunities — not guaranteed victory.**

**Deliverable:** In-app purchase and monetization system.

---

## Phase 18 — Analytics & Live Operations

Instrument everything before launch.

Track:

```text
DAU
MAU
Retention
Session length
Sessions/day
Quest completion
PvP participation
Level progression
Currency generation
Currency spending
Purchase conversion
Churn
```

Important retention measurements:

```text
D1
D3
D7
D14
D30
```

The objective is to understand exactly where players stop playing.

**Deliverable:** Analytics dashboard and live-operations controls.

---

## Phase 19 — Closed Alpha

Invite approximately **50–200 players**.

Test:

- Bugs
- Combat balance
- Economy
- Server performance
- Quest difficulty
- Tutorial
- Retention
- Device compatibility

Don't focus heavily on monetization optimization yet.

Primary question:

> Is this actually fun?

**Deliverable:** Alpha test report and prioritized fixes.

---

## Phase 20 — Beta

Expand to approximately **500–5,000 players**, depending on infrastructure and goals.

Test:

- Server scalability
- PvP
- Clan system
- Events
- Purchases
- App Store / Google Play flows
- Push notifications
- Customer support
- Abuse prevention

Start measuring retention seriously.

**Deliverable:** Production-ready release candidate.

---

## Phase 21 — Soft Launch

Launch in a limited market first.

Use the soft launch to answer:

- Are players returning?
- Are they progressing too quickly?
- Are they progressing too slowly?
- Is the economy broken?
- Are whales dominating?
- Are non-paying players enjoying it?
- Are servers stable?
- Is onboarding effective?

Then iterate.

**Deliverable:** Validated game economy, onboarding, retention, and infrastructure.

---

## Phase 22 — Global Launch

At this point the game should have:

### Core

- Account system
- Viking character
- Quests
- Energy
- Stamina
- Combat
- Equipment
- Loot
- Village
- Resources
- Warriors
- PvP
- Clans
- World map
- Bosses
- Collections

### Live Systems

- Events
- Leaderboards
- Notifications
- Analytics
- Customer support
- Moderation
- Economy controls

Then launch globally.

**Deliverable:** Public iOS and Android release.

---

## Phase 23 — Post-Launch

Treat the game as a **live service**, not a finished product.

### Every few weeks

- New quests
- New equipment
- New events
- New bosses
- New territories
- New collections
- New cosmetics

### Every few months

- New region
- New gameplay mechanic
- New clan feature
- Major story chapter

**Deliverable:** Continuous content and live-operations roadmap.

---

# Recommended MVP

Do not build all 23 phases before allowing anyone to play.

The first playable version should be much smaller.

```text
             VIKING MVP

        ┌─────────────────┐
        │ Viking Character│
        └────────┬────────┘
                 │
       ┌─────────┼─────────┐
       ↓         ↓         ↓
     QUEST     VILLAGE    COMBAT
       │         │         │
       ↓         ↓         ↓
      XP       RESOURCES   LOOT
       │         │         │
       └─────────┼─────────┘
                 ↓
              LEVEL UP
                 ↓
           EQUIPMENT
                 ↓
             STRONGER
```

### MVP Systems

1. Authentication
2. Viking character
3. Energy/stamina
4. Quest system
5. PvE combat
6. Equipment/loot
7. Basic village
8. Basic progression

Then put it in front of real players.

---

# Recommended Development Milestones

## Milestone 1 — Foundation

React Native + backend + database + authentication

↓

## Milestone 2 — Core RPG

Character + stats + XP + energy + stamina

↓

## Milestone 3 — Gameplay

Quests + combat + enemies + rewards

↓

## Milestone 4 — RPG Depth

Equipment + inventory + loot + warriors

↓

## Milestone 5 — Village

Buildings + resources + upgrades

↓

## Milestone 6 — Social

Friends + clans + chat

↓

## Milestone 7 — PvP

Raids + matchmaking + battle history

↓

## Milestone 8 — World

Map + territories + bosses

↓

## Milestone 9 — Retention

Events + collections + achievements + notifications

↓

## Milestone 10 — Monetization

Runes + cosmetics + passes + purchases

↓

## Milestone 11 — Testing

Alpha → Beta → Soft Launch

↓

## Milestone 12 — Global Launch

App Store + Google Play + Live Operations

---

# Recommended Architecture Principle

Make almost the entire game **data-driven**.

Instead of hardcoding game rules into React Native:

```text
if player.level >= 10:
    unlock Viking Quest
```

Use backend data structures such as:

```text
quests
enemies
items
buildings
warriors
rewards
drop_tables
territories
events
```

The server determines what is available.

This allows a future update such as:

**Ragnarok Season 3**

to introduce new quests, equipment, enemies, and rewards without rebuilding the entire mobile application.

---

# Game Design Direction

The strongest version of this concept should preserve the psychological strengths of the Mafia Wars-style loop:

**Short sessions + constant progression + collection + social competition + asynchronous PvP + timers + events**

while using the Viking setting to add:

- Villages
- Ships
- Clans
- Exploration
- Norse mythology
- Territory conquest
- Cooperative raids
- Viking warriors
- Relics
- Seasonal events

The result should feel like a **modern Viking social RPG**, rather than a simple Mafia Wars reskin.
