import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clanKeys, playerKeys, socialKeys } from '@/lib/query/keys';
import { FIRESTORE_COLLECTIONS } from '@shared/ids';
import { useAuth } from '@/features/auth';
import { callGameFunction } from '@/lib/firebase/callGameFunction';
import {
  addSubcollectionDoc,
  getCollectionData,
  getDocData,
  getOrderedSubcollection,
} from '@/lib/firebase/firestore';
import type { Clan, ClanChatMessage, Player } from '@shared/types';
import { track, AnalyticsEvents } from '@/lib/analytics/analytics';

export function useClans() {
  return useQuery({
    queryKey: clanKeys.list,
    queryFn: () => getCollectionData<Clan>(FIRESTORE_COLLECTIONS.clans),
  });
}

export function useClan(clanId: string | null) {
  return useQuery({
    queryKey: clanKeys.detail(clanId ?? 'none'),
    enabled: Boolean(clanId),
    queryFn: () => getDocData<Clan>(FIRESTORE_COLLECTIONS.clans, clanId ?? ''),
  });
}

export function useClanChat(clanId: string | null) {
  return useQuery({
    queryKey: clanKeys.chat(clanId ?? 'none'),
    enabled: Boolean(clanId),
    queryFn: () =>
      getOrderedSubcollection<ClanChatMessage>(
        FIRESTORE_COLLECTIONS.clans,
        clanId ?? '',
        FIRESTORE_COLLECTIONS.clanChat,
        'createdAt',
        40,
      ),
  });
}

export function useCreateClan() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (name: string) => callGameFunction<{ player: Player; clan: Clan }>('createClan', { name }),
    onSuccess: (data) => {
      if (user?.uid) {
        queryClient.setQueryData(playerKeys.me(user.uid), data.player);
      }
      queryClient.invalidateQueries({ queryKey: clanKeys.all });
      track(AnalyticsEvents.clanJoin);
    },
  });
}

export function useJoinClan() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (clanId: string) => callGameFunction<{ player: Player }>('joinClan', { clanId }),
    onSuccess: (data) => {
      if (user?.uid) {
        queryClient.setQueryData(playerKeys.me(user.uid), data.player);
      }
      queryClient.invalidateQueries({ queryKey: clanKeys.all });
    },
  });
}

export function useLeaveClan() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: () => callGameFunction<{ player: Player }>('leaveClan'),
    onSuccess: (data) => {
      if (user?.uid) {
        queryClient.setQueryData(playerKeys.me(user.uid), data.player);
      }
      queryClient.invalidateQueries({ queryKey: clanKeys.all });
    },
  });
}

export function useDonateTreasury() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (silver: number) => callGameFunction<{ player: Player }>('donateTreasury', { silver }),
    onSuccess: (data) => {
      if (user?.uid) {
        queryClient.setQueryData(playerKeys.me(user.uid), data.player);
      }
      queryClient.invalidateQueries({ queryKey: clanKeys.all });
    },
  });
}

export function useClanRaid(clanId: string | null) {
  return useQuery({
    queryKey: socialKeys.raid(clanId ?? 'none'),
    enabled: Boolean(clanId),
    queryFn: () =>
      getDocData<{ hp: number; maxHp: number; bossId: string }>(FIRESTORE_COLLECTIONS.raids, clanId ?? ''),
  });
}

export async function postClanChat(
  clanId: string,
  payload: ClanChatMessage,
): Promise<void> {
  await addSubcollectionDoc(
    FIRESTORE_COLLECTIONS.clans,
    clanId,
    FIRESTORE_COLLECTIONS.clanChat,
    payload,
  );
}
