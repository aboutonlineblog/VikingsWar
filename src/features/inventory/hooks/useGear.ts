import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { catalogKeys, playerKeys } from '@/lib/query/keys';
import { useAuth } from '@/features/auth';
import { callGameFunction } from '@/lib/firebase/callGameFunction';
import { fetchItems, fetchWarriors } from '@/features/quests/api/catalogApi';
import type { Player } from '@shared/types';

export function useItemsCatalog() {
  return useQuery({
    queryKey: catalogKeys.doc('items'),
    queryFn: fetchItems,
  });
}

export function useWarriorCatalog() {
  return useQuery({
    queryKey: catalogKeys.doc('warriors'),
    queryFn: fetchWarriors,
  });
}

export function useEquipItem() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (instanceId: string) =>
      callGameFunction<{ player: Player }>('equipItem', { instanceId }),
    onSuccess: (data) => {
      if (user?.uid) {
        queryClient.setQueryData(playerKeys.me(user.uid), data.player);
      }
    },
  });
}

export function useRecruitWarrior() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (warriorId: string) =>
      callGameFunction<{ player: Player }>('recruitWarrior', { warriorId }),
    onSuccess: (data) => {
      if (user?.uid) {
        queryClient.setQueryData(playerKeys.me(user.uid), data.player);
      }
    },
  });
}

export function useUpgradeWarrior() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (instanceId: string) =>
      callGameFunction<{ player: Player }>('upgradeWarrior', { instanceId }),
    onSuccess: (data) => {
      if (user?.uid) {
        queryClient.setQueryData(playerKeys.me(user.uid), data.player);
      }
    },
  });
}
