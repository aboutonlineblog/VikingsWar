import { APP_ENV } from '@/lib/env';

export function track(event: string, params?: Record<string, unknown>): void {
  if (__DEV__) {
    console.log(`[analytics:${APP_ENV}]`, event, params ?? {});
  }
}

export const AnalyticsEvents = {
  sessionStart: 'session_start',
  signUp: 'sign_up',
  questComplete: 'quest_complete',
  pvpAttack: 'pvp_attack',
  levelUp: 'level_up',
  purchase: 'purchase',
  buildingUpgrade: 'building_upgrade',
  clanJoin: 'clan_join',
} as const;
