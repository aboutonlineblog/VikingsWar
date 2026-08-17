import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth';
import { playerKeys } from '@/lib/query/keys';
import { createViking, fetchPlayer } from '../api/playerApi';

export function usePlayer() {
  const { user } = useAuth();
  const uid = user?.uid ?? '';
  return useQuery({
    queryKey: playerKeys.me(uid),
    queryFn: () => fetchPlayer(uid),
    enabled: Boolean(uid),
  });
}

export function useCreateViking() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: ({ name, avatarId }: { name: string; avatarId: string }) =>
      createViking(name, avatarId),
    onSuccess: (player) => {
      if (user?.uid) {
        queryClient.setQueryData(playerKeys.me(user.uid), player);
      }
    },
  });
}
