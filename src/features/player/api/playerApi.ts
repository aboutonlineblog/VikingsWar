import type { Player } from '@shared/types';
import { FIRESTORE_COLLECTIONS } from '@shared/ids';
import { callGameFunction } from '@/lib/firebase/callGameFunction';
import { getDocData } from '@/lib/firebase/firestore';

export async function fetchPlayer(uid: string): Promise<Player | null> {
  return getDocData<Player>(FIRESTORE_COLLECTIONS.players, uid);
}

export async function createViking(vikingName: string, avatarId: string): Promise<Player> {
  const result = await callGameFunction<{ player: Player }>('createViking', {
    vikingName,
    avatarId,
  });
  return result.player;
}
