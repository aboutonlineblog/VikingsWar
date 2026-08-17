# Viking Game — Complete UI/UX Development Plan

## 1. UI/UX Vision
Create a modern, mobile-first Viking social RPG UI inspired by the addictive loop of classic social RPGs, while maintaining an original Viking identity.

Core principles:
- Mobile-first
- One-handed friendly
- Minimal taps for common actions
- Clear resources and progression
- Strong visual feedback
- Short sessions
- Consistent Viking visual identity
- Fast navigation
- Data-driven content

## 2. UX Architecture

Recommended persistent navigation:

```text
┌───────────────────────────────┐
│ ❤️ Health  ⚡ Energy  🪙 Silver│
├───────────────────────────────┤
│          CURRENT SCREEN       │
├───────────────────────────────┤
│ 🏠 Home  ⚔️ Battle  🗺️ World  │
│ 🛡️ Clan  👤 Viking            │
└───────────────────────────────┘
```

Primary screens:
1. Home / Village
2. Quests
3. Combat
4. World Map
5. Clan
6. Viking Profile
7. Equipment
8. Inventory
9. Buildings
10. Collections
11. Events
12. Store
13. Notifications
14. Settings
15. Tutorial / Help

## 3. Visual Identity

### Art Direction
Dark Nordic fantasy + premium mobile RPG.

Visual themes:
- Wood
- Iron
- Leather
- Stone
- Runes
- Norse carvings
- Viking shields
- Longships
- Snow
- Fire
- Mountains
- Fog
- Ancient ruins

### Color System
- Primary: deep Nordic blue
- Secondary: dark brown
- Accent: gold
- Positive: green
- Warning: orange
- Danger: red
- Premium: rune/purple
- Background: dark stone/wood
- Surface: dark slate
- Text: warm white

### Typography
Use a decorative display font for major headings and a highly readable sans-serif for body text. Use large bold numerals for resources and combat values. Avoid decorative Viking fonts for long text.

## 4. Design System

Create reusable:
- Buttons
- Tabs
- Cards
- Modals
- Bottom sheets
- Tooltips
- Badges
- Resource counters
- Health/energy/stamina bars
- XP bars
- Timers
- Item cards
- Character cards
- Warrior cards
- Quest cards
- Building cards
- Reward panels
- Notification banners
- Toasts
- Loading states
- Empty states
- Error states

Every component should support appropriate default, pressed, disabled, loading, error, accessibility, and haptic states.

## 5. Onboarding

First-session flow:

```text
Install → Account → Create Viking → Name Viking
→ Village → First Quest → First Battle → Loot
→ Equip Weapon → Upgrade Building → Level Up → World Map
```

Teach systems through actions rather than long explanations.

## 6. Home / Village

The Home screen is the main hub.

It must clearly answer:
- Who am I?
- What can I do?
- What can I collect?
- What should I upgrade?
- What is my next objective?

Buildings should be interactive, not purely decorative.

## 7. Quest UI

Quest cards should clearly show:
- Quest name
- Level requirement
- Energy cost
- Rewards
- Requirements
- Action button
- Completion result

Routine quests should be repeatable with very few taps.

## 8. Combat UI

Combat should be exciting but fast.

Include:
- Health bars
- Attack actions
- Special abilities
- Damage numbers
- Critical-hit feedback
- Hit reactions
- Victory/defeat states
- Loot reveal
- Optional haptics

Later, repetitive combat should support quick resolution/skip functionality.

## 9. Character UI

Show:
- Viking artwork
- Level
- XP progress
- Attack
- Defense
- Health
- Equipment
- Stats
- Warriors

The player should immediately feel that their Viking is becoming stronger.

## 10. Equipment UI

Use a visual equipment layout with:
- Helmet
- Weapon
- Shield
- Armor
- Boots
- Rings
- Amulet

Item details should show current stats, comparison, upgrade result, cost, and equip/upgrade actions.

## 11. Village Building UI

Every building detail view should show:
- Building name
- Current level
- Production
- Storage
- Upgrade cost
- Upgrade benefit
- Upgrade duration
- Upgrade action

## 12. World Map

Use:
- Fog of war
- Level requirements
- Quest markers
- Boss markers
- Treasure markers
- Clan objectives
- Locked/unlocked territories

The map should visually communicate progress and future goals.

## 13. PvP UI

Opponent selection should show:
- Player level
- Attack
- Defense
- Potential risk
- Potential reward
- Raid action

Battle results should explain why the player won or lost.

## 14. Clan UI

Show:
- Clan name
- Banner
- Level
- Member count
- Clan power
- Rank
- Clan raids
- Chat
- Clan objectives

Important social actions should be immediately accessible.

## 15. Inventory UI

Use tabs:
- Weapons
- Armor
- Shields
- Relics
- Materials

Filters:
- All
- Common
- Rare
- Epic
- Legendary

Sorting:
- Power
- Level
- Rarity
- Newest

## 16. Collections UI

Show:
- Collection name
- Completion progress
- Collected/uncollected items
- Collection bonus
- Completion animation

Collections should feel like major achievements.

## 17. Events UI

Events should be visible from Home.

Always show:
- Event name
- Time remaining
- Progress
- Objective
- Rewards
- Next milestone

Examples:
- Ragnarok
- Raid Week
- Viking Festival
- World Boss

## 18. Notifications

Use useful, non-spam notifications such as:
- Warriors ready
- Farm full
- Clan under attack
- Event ending soon

Avoid manipulative urgency.

## 19. Reward UX

Rewards should be:
- Fast
- Satisfying
- Skippable
- Consistent
- Easy to understand

Important rewards should have strong visual feedback.

## 20. Loading & Error UX

Use contextual loading messages such as:
- Sailing to the Northern Coast...
- Gathering your warriors...
- Preparing the raid...

Connection errors should reassure players that progress is safe and provide a retry action.

## 21. Accessibility

Support:
- Dynamic text sizing where practical
- Color-independent indicators
- Large touch targets
- High contrast
- Reduced animation
- Screen-reader labels
- Haptic settings
- Sound/music controls

## 22. UI Asset Plan

### Brand
- App icon
- Logo
- Wordmark
- Splash artwork
- Loading artwork
- Store graphics

### Navigation
- Home
- Battle
- World
- Clan
- Viking
- Inventory
- Settings
- Back
- Close
- More

### Resources
- Silver
- Food
- Wood
- Iron
- Runes
- XP
- Health
- Energy
- Stamina

### Combat
- Attack
- Defense
- Critical
- Victory
- Defeat
- Damage effects
- Hit effects
- Block effects
- Status effects

### Equipment
- Weapons
- Helmets
- Armor
- Shields
- Boots
- Rings
- Amulets
- Rarity frames

### Warriors
- Berserker
- Shieldmaiden
- Archer
- Raider
- Spearman
- Warrior portraits
- Class icons
- Rarity frames

### Buildings
- Great Hall
- Farm
- Lumber Camp
- Iron Mine
- Blacksmith
- Barracks
- Shipyard
- Trading Post
- Temple
- Building level states

### World
- Map background
- Village marker
- Enemy marker
- Boss marker
- Treasure marker
- Quest marker
- Clan objective marker
- Locked territory
- Unlocked territory
- Fog of war

### Events
- Event banners
- Event logos
- Event currency
- Event badges
- Event reward frames
- Seasonal backgrounds

### Social
- Clan banners
- Clan badges
- Player avatars
- Rank badges
- Achievement badges
- Leaderboard icons

### Feedback
- Success
- Warning
- Error
- Information
- New item
- Level up
- Quest complete
- Achievement unlocked

## 23. Asset Specifications

Prefer scalable/vector assets for UI.

Recommended:
- SVG for icons where supported
- PNG/WebP for raster artwork
- High-resolution source illustrations
- Transparent character exports
- Lottie/Rive for suitable UI animation
- Sprite sheets for game effects where appropriate

Maintain editable originals in Figma/SVG/PSD/AI/Blender as applicable. Never treat exported PNGs as the only source of truth.

## 24. Asset Naming Convention

Use lowercase and underscores.

Examples:

```text
icon_resource_silver.png
icon_resource_food.png
icon_stat_attack.png
item_weapon_iron_axe.png
building_farm_level_01.png
warrior_berserker_common.png
```

## 25. Asset Folder Structure

```text
assets/
├── brand/
├── icons/
│   ├── navigation/
│   ├── resources/
│   ├── stats/
│   ├── combat/
│   └── status/
├── characters/
│   ├── player/
│   └── warriors/
├── equipment/
│   ├── weapons/
│   ├── armor/
│   ├── shields/
│   ├── helmets/
│   ├── boots/
│   └── accessories/
├── buildings/
├── world/
├── events/
├── collections/
├── backgrounds/
├── illustrations/
├── animations/
├── audio/
└── store/
```

## 26. UX Testing

Test with real users without explaining the interface.

Ask users to:
1. Start a quest
2. Complete a battle
3. Equip a weapon
4. Upgrade a building
5. Find their next quest
6. Find their clan
7. Attack another Viking
8. Find a collection
9. Find an event
10. Earn/spend resources

Observe confusion rather than immediately helping.

## 27. UI Performance

For React Native:
- Use optimized lists
- Avoid unnecessary renders
- Cache remote assets
- Lazy-load screens
- Compress images
- Optimize animations
- Keep expensive calculations off the UI thread
- Avoid huge uncompressed textures
- Preload only priority assets
- Use appropriate loading states

## 28. Final UI/UX QA

### New Player
Install → Account → Character → Tutorial → Quest → Battle → Loot → Equipment → Village → Upgrade → Level Up

### Returning Player
Open → Collect resources → Check quests → Check events → Check clan → Fight → Upgrade → Exit

### Paying Player
Store → Product → Purchase → Confirmation → Reward → Inventory

Test all flows for usability, consistency, performance, error states, connectivity, accessibility, and analytics.

## 29. Recommended UI/UX Development Order

```text
UX architecture
↓
Navigation
↓
Design system
↓
Home / Village
↓
Quest
↓
Combat
↓
Character
↓
Equipment
↓
Inventory
↓
Buildings
↓
World Map
↓
PvP
↓
Clan
↓
Collections
↓
Events
↓
Store / Monetization
↓
Notifications
↓
Tutorial
↓
Accessibility
↓
Usability testing
↓
Final polish
```

## 30. Prototype Strategy

Do not begin with dozens of polished screens.

First build a clickable prototype for the first 10–15 minutes:

```text
Create Viking
↓
Village
↓
Quest
↓
Battle
↓
Loot
↓
Equipment
↓
Building Upgrade
↓
Level Up
↓
New Quest
```

Only expand the full UI system after this core loop feels satisfying.

## 31. Main Screen Strategy

Home/Village remains the central hub.

The player should never be more than 1–2 taps away from something useful to do.

Core loop:

**Quest → Reward → Upgrade → Become Stronger → Unlock → Fight → Collect → Repeat**

## 32. UI/UX Success Criteria

### Learnability
New players understand the basics without a manual.

### Efficiency
Returning players complete routine actions quickly.

### Clarity
Players always understand resources, strength, objectives, rewards, and next actions.

### Excitement
Combat, loot, leveling, collection completion, and upgrades feel rewarding.

### Retention
The interface makes quests, upgrades, clans, PvP, events, collections, and world progression easy to discover.

### Scalability
New content can be added without redesigning the entire UI.

## 33. Design Deliverables

Before full production, deliver:
- UX flow diagrams
- Information architecture
- Wireframes
- High-fidelity screens
- Interactive Figma prototype
- Design system
- Component library
- Typography specification
- Color specification
- Icon library
- Asset inventory
- Asset naming convention
- Animation specification
- Haptic specification
- Accessibility specification
- UI state specification
- Empty/error/loading designs
- Responsive/mobile layout rules
- Developer handoff documentation
- UI QA checklist

## 34. Final Product Philosophy

The interface should make the player feel:

> **"I always have something useful to do."**

The Viking theme should influence the entire experience rather than being a simple skin:
- Visual design
- Buildings
- Characters
- Equipment
- World map
- Animations
- Sound
- Events
- Progression
- Social identity

The final product should feel like a modern Viking social RPG, not a direct Mafia Wars reskin.
