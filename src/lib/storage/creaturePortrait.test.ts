import { creatureStoragePath } from './creaturePortrait';
import type { EnemyDef } from '@shared/types';

describe('creaturePortrait', () => {
  it('uses portraitUrl when it is a storage path', () => {
    const enemy: Pick<EnemyDef, 'id' | 'portraitUrl'> = {
      id: 'creature_001_arctic_fox',
      portraitUrl: 'creatures/creature_001_arctic_fox.webp',
    };
    expect(creatureStoragePath(enemy)).toBe('creatures/creature_001_arctic_fox.webp');
  });

  it('falls back to creature id path', () => {
    const enemy: Pick<EnemyDef, 'id' | 'portraitUrl'> = {
      id: 'creature_002_arctic_wolf',
    };
    expect(creatureStoragePath(enemy)).toBe('creatures/creature_002_arctic_wolf.webp');
  });
});
