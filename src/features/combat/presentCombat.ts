import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { CombatPayload, RootStackParamList } from '@/app/navigation/types';
import type { CombatCallableResult, EnemyDef } from '@shared/types';

export function combatPayloadFromResult(
  title: string,
  opponentName: string | undefined,
  result: CombatCallableResult,
  enemy?: Pick<EnemyDef, 'id' | 'name' | 'type' | 'portraitUrl'>,
): CombatPayload {
  return {
    title,
    opponentName,
    enemy,
    battle: result.battle,
    events: result.events ?? [],
    combat: result.combat,
    rewards: result.rewards,
    lootName: result.loot?.name ?? null,
  };
}

export function shouldPresentCombatStage(payload: CombatPayload): boolean {
  if (payload.battle?.waitingFor === 'player') {
    return true;
  }
  return Boolean(payload.events && payload.events.length > 0);
}

export function presentCombat(
  navigation: NativeStackNavigationProp<RootStackParamList>,
  payload: CombatPayload,
): void {
  if (shouldPresentCombatStage(payload)) {
    navigation.navigate('CombatStage', payload);
    return;
  }
  navigation.navigate('CombatResult', payload);
}
