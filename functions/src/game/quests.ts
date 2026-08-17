import type { Player, QuestDef } from '../../../shared/types';

export type QuestLockReason = 'ok' | 'level' | 'chapter';

export function questUnlockState(player: Player, quest: QuestDef): QuestLockReason {
  if (player.level < quest.requiredLevel) {
    return 'level';
  }
  if (player.currentChapter < quest.chapter) {
    return 'chapter';
  }
  return 'ok';
}
