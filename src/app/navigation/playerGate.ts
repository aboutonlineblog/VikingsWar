import type { Player } from '@shared/types';

export type PlayerGate = 'loading' | 'unauthenticated' | 'error' | 'create' | 'ready';

export interface PlayerGateInput {
  initializing: boolean;
  hasUser: boolean;
  playerPending: boolean;
  playerError: boolean;
  player: Player | null | undefined;
}

export function resolvePlayerGate(input: PlayerGateInput): PlayerGate {
  if (input.initializing) {
    return 'loading';
  }
  if (!input.hasUser) {
    return 'unauthenticated';
  }
  if (input.playerPending) {
    return 'loading';
  }
  if (input.playerError) {
    return 'error';
  }
  if (!input.player) {
    return 'create';
  }
  return 'ready';
}
