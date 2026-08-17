import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { catalogKeys, playerKeys } from '@/lib/query/keys';
import { useAuth } from '@/features/auth';
import { fetchQuests } from '../api/catalogApi';
import { callGameFunction } from '@/lib/firebase/callGameFunction';
import type { CombatCallableResult } from '@shared/types';
import { track, AnalyticsEvents } from '@/lib/analytics/analytics';

export function useQuests() {
  return useQuery({
    queryKey: catalogKeys.doc('quests'),
    queryFn: fetchQuests,
  });
}

export function useCompleteQuest() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (questId: string) =>
      callGameFunction<CombatCallableResult>('completeQuest', { questId }),
    onSuccess: (data) => {
      if (user?.uid) {
        queryClient.setQueryData(playerKeys.me(user.uid), data.player);
      }
      track(AnalyticsEvents.questComplete, { loot: data.loot?.id });
    },
  });
}
