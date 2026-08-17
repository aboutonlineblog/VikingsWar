# Vikings War

React Native (CLI, not Expo) Viking social RPG for iOS and Android.

Bundle ID: `com.atomicdevs.vikingswar`

Firebase project: `vikings-war-5296b`

## Stack

- React Native 0.87 + TypeScript
- React Navigation + TanStack Query
- Firebase Auth, Firestore, Cloud Functions, Storage
- Server-authoritative combat, loot, XP, economy, and PvP

The app currently runs as **alpha** against the live Firebase project. Local emulators remain available when `APP_ENV` in `src/lib/env.ts` is set back to `development`.

## Setup

```bash
npm install
npm --prefix functions install
npm run functions:build
```

### Firebase console (one-time)

1. Enable **Email/Password** under Authentication → Sign-in method.
2. Confirm the Android app package is `com.atomicdevs.vikingswar` (`android/app/google-services.json` is already in the repo).
3. Confirm the iOS app bundle ID is `com.atomicdevs.vikingswar` (`ios/VikingsWar/GoogleService-Info.plist` is already in the repo).
4. Confirm the project is on the **Blaze** plan (required to deploy Cloud Functions).

### Deploy backend and seed catalogs

Login must be able to access `vikings-war-5296b`:

```bash
firebase login
firebase deploy --only firestore:rules,firestore:indexes,storage,functions
SEED_LIVE=true npm run seed
```

`npm run seed` refuses to write the live project unless `SEED_LIVE=true` is set. Live seed authenticates with the logged-in Firebase CLI account (`firebase login`).

## Emulators

For local game-logic work, set `APP_ENV` in `src/lib/env.ts` to `'development'` (that turns `USE_EMULATORS` on), then:

```bash
npm run emulators
```

In another terminal:

```bash
export FIRESTORE_EMULATOR_HOST=127.0.0.1:8080
export FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099
npm run seed
```

Then run the app:

```bash
npm run ios
# or
npm run android
```

Android emulator uses `10.0.2.2` to reach host emulators.

## Scripts

- `npm test` — Jest (game formulas + UI)
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint`
- `npm run emulators` — Auth, Firestore, Functions, Storage emulators
- `npm run seed` — seed catalogs (emulator hosts, or `SEED_LIVE=true` for live)

## Design

See `docs/GAME_DESIGN.md`, `docs/live-ops.md`, and `plans/viking_game_complete_development_plan.md`.
