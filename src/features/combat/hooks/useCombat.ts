import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { catalogKeys, playerKeys, socialKeys } from '@/lib/query/keys';
import { useAuth } from '@/features/auth';
import { callGameFunction } from '@/lib/firebase/callGameFunction';
import { fetchEnemies } from '@/features/quests/api/catalogApi';
import type { CombatAction, CombatCallableResult } from '@shared/types';

function useCachedCombatMutation<TVariables>(
  name: string,
  toPayload: (variables: TVariables) => Record<string, unknown>,
  onSettled?: () => void,
) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (variables: TVariables) =>
      callGameFunction<CombatCallableResult>(name, toPayload(variables)),
    onSuccess: (data) => {
      if (user?.uid) {
        queryClient.setQueryData(playerKeys.me(user.uid), data.player);
      }
      onSettled?.();
    },
  });
}

export function useEnemies() {
  return useQuery({
    queryKey: catalogKeys.doc('enemies'),
    queryFn: fetchEnemies,
  });
}

export function useFightEnemy() {
  return useCachedCombatMutation<string>('fightEnemy', (enemyId) => ({ enemyId }));
}

export function usePvpTargets() {
  return useQuery({
    queryKey: socialKeys.pvpTargets,
    queryFn: () =>
      callGameFunction<{
        targets: Array<{ uid: string; vikingName: string; level: number; prestige: number }>;
      }>('listPvpTargets'),
  });
}

export function useAttackPlayer() {
  const queryClient = useQueryClient();
  return useCachedCombatMutation<string>(
    'attackPlayer',
    (defenderUid) => ({ defenderUid }),
    () => {
      queryClient.invalidateQueries({ queryKey: socialKeys.pvpTargets });
    },
  );
}

export function useAttackBoss() {
  return useCachedCombatMutation<string>('attackBoss', (bossId) => ({ bossId }));
}

export function useAttackClanRaid() {
  const queryClient = useQueryClient();
  return useCachedCombatMutation<string | undefined>(
    'attackClanRaid',
    (bossId) => (bossId ? { bossId } : {}),
    () => {
      queryClient.invalidateQueries({ queryKey: ['raid'] });
    },
  );
}

export function useSubmitCombatAction() {
  return useCachedCombatMutation<CombatAction>('submitCombatAction', (action) => ({ action }));
}
