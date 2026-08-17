import { assertSeedTargetAllowed, isEmulatorSeed } from './seedGuard';

describe('isEmulatorSeed', () => {
  it('detects emulator hosts', () => {
    expect(isEmulatorSeed({ FIRESTORE_EMULATOR_HOST: '127.0.0.1:8080' })).toBe(true);
    expect(isEmulatorSeed({ FIREBASE_AUTH_EMULATOR_HOST: '127.0.0.1:9099' })).toBe(true);
    expect(isEmulatorSeed({})).toBe(false);
  });
});

describe('assertSeedTargetAllowed', () => {
  it('allows emulator seeding', () => {
    expect(() =>
      assertSeedTargetAllowed({ FIRESTORE_EMULATOR_HOST: '127.0.0.1:8080' }),
    ).not.toThrow();
  });

  it('allows live seeding when SEED_LIVE=true', () => {
    expect(() => assertSeedTargetAllowed({ SEED_LIVE: 'true' })).not.toThrow();
  });

  it('refuses live seeding without an explicit flag', () => {
    expect(() => assertSeedTargetAllowed({})).toThrow(/Refusing to seed live Firebase/);
  });
});
