import { createNewPlayer } from './createPlayer';
import { questUnlockState } from './quests';
import type { QuestDef } from '../../../shared/types';

const quest: QuestDef = {
  id: 'season1_ragnarok_scout',
  name: 'Ragnarok Scouts',
  description: 'Season quest',
  category: 'mythology',
  chapter: 5,
  energyCost: 10,
  requiredLevel: 8,
  rewards: { xp: 80, silver: 100 },
};

describe('questUnlockState', () => {
  it('blocks chapter 5 content before the chapter is reached', () => {
    const player = createNewPlayer('uid', 'Erik', 'wolf', 0);
    player.level = 8;
    player.currentChapter = 3;
    expect(questUnlockState(player, quest)).toBe('chapter');
  });

  it('allows the quest once level and chapter are met', () => {
    const player = createNewPlayer('uid', 'Erik', 'wolf', 0);
    player.level = 8;
    player.currentChapter = 5;
    expect(questUnlockState(player, quest)).toBe('ok');
  });
});
