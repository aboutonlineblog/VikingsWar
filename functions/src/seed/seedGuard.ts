export interface SeedEnv {
  FIRESTORE_EMULATOR_HOST?: string;
  FIREBASE_AUTH_EMULATOR_HOST?: string;
  SEED_LIVE?: string;
}

export function isEmulatorSeed(env: SeedEnv): boolean {
  return Boolean(env.FIRESTORE_EMULATOR_HOST || env.FIREBASE_AUTH_EMULATOR_HOST);
}

export function assertSeedTargetAllowed(env: SeedEnv): void {
  if (isEmulatorSeed(env) || env.SEED_LIVE === 'true') {
    return;
  }

  throw new Error(
    'Refusing to seed live Firebase. Set FIRESTORE_EMULATOR_HOST and FIREBASE_AUTH_EMULATOR_HOST for emulators, or SEED_LIVE=true to write catalogs to the live project.',
  );
}
