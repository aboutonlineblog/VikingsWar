import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { catalogKeys, playerKeys } from '@/lib/query/keys';
import { useAuth } from '@/features/auth';
import { callGameFunction } from '@/lib/firebase/callGameFunction';
import { fetchBuildings } from '@/features/quests/api/catalogApi';
import type { BuildingId, Player } from '@shared/types';
import { track, AnalyticsEvents } from '@/lib/analytics/analytics';

export function useBuildingsCatalog() {
  return useQuery({
    queryKey: catalogKeys.doc('buildings'),
    queryFn: fetchBuildings,
  });
}

export function useCollectResources() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: () => callGameFunction<{ player: Player; gained: Record<string, number> }>('collectResources'),
    onSuccess: (data) => {
      if (user?.uid) {
        queryClient.setQueryData(playerKeys.me(user.uid), data.player);
      }
    },
  });
}

export function useUpgradeBuilding() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (buildingId: BuildingId) =>
      callGameFunction<{ player: Player }>('upgradeBuilding', { buildingId }),
    onSuccess: (data) => {
      if (user?.uid) {
        queryClient.setQueryData(playerKeys.me(user.uid), data.player);
      }
      track(AnalyticsEvents.buildingUpgrade);
    },
  });
}

export function useSpeedUpBuilding() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (buildingId: BuildingId) =>
      callGameFunction<{ player: Player }>('speedUpBuilding', { buildingId }),
    onSuccess: (data) => {
      if (user?.uid) {
        queryClient.setQueryData(playerKeys.me(user.uid), data.player);
      }
    },
  });
}

export function useClaimDailyLogin() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: () => callGameFunction<{ player: Player }>('claimDailyLogin'),
    onSuccess: (data) => {
      if (user?.uid) {
        queryClient.setQueryData(playerKeys.me(user.uid), data.player);
      }
    },
  });
}
