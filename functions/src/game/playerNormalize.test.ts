import { createNewPlayer } from './createPlayer';
import { normalizePlayer } from './playerNormalize';

describe('normalizePlayer', () => {
  it('fills missing accessory slots, speed, and activeBattle', () => {
    const player = createNewPlayer('uid', 'Erik', 'wolf', 0);
    const legacy = {
      ...player,
      speed: undefined,
      activeBattle: undefined,
      equipment: {
        weapon: null,
        helmet: null,
        armor: null,
        shield: null,
        boots: null,
        ring: 'ring-1',
        amulet: null,
      },
    };
    const next = normalizePlayer(legacy as typeof player);
    expect(next.speed).toBe(0);
    expect(next.activeBattle).toBeNull();
    expect(next.equipment.necklace).toBeNull();
    expect(next.equipment.bracelet).toBeNull();
    expect(next.equipment.earrings).toBeNull();
    expect(next.equipment.headband).toBeNull();
    expect(next.equipment.ring).toBe('ring-1');
  });
});
