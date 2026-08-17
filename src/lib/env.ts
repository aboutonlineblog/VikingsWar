import type { AppEnv } from '@shared/types';

export function usesEmulators(env: AppEnv): boolean {
  return env === 'development';
}

export const APP_ENV: AppEnv = 'alpha';

export const USE_EMULATORS = usesEmulators(APP_ENV);

export const APP_VERSION = '1.0.0';

export const BUILD_NUMBER = '1';
