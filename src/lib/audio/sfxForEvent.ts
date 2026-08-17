import type { BattleEvent } from '@shared/types';
import type { SfxId } from './audioTypes';

export function sfxForEvent(event: BattleEvent): SfxId[] {
  if (event.type !== 'action') {
    return [];
  }

  const ids: SfxId[] = [];
  if (
    event.action === 'attack' ||
    event.action === 'special' ||
    event.action === 'defend' ||
    event.action === 'potion'
  ) {
    ids.push(event.action);
  }
  if (event.hit && event.damage > 0) {
    ids.push('hit');
  }
  return ids;
}
