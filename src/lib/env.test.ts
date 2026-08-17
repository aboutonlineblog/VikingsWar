import { APP_ENV, USE_EMULATORS, usesEmulators } from './env';

describe('usesEmulators', () => {
  it('uses emulators only in development', () => {
    expect(usesEmulators('development')).toBe(true);
    expect(usesEmulators('alpha')).toBe(false);
    expect(usesEmulators('beta')).toBe(false);
    expect(usesEmulators('production')).toBe(false);
  });
});

describe('current app env', () => {
  it('points alpha builds at live Firebase', () => {
    expect(APP_ENV).toBe('alpha');
    expect(USE_EMULATORS).toBe(false);
  });
});
