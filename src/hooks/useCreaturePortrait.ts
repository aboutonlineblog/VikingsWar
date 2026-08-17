import { useEffect, useState } from 'react';
import type { EnemyDef } from '@shared/types';
import { resolveCreaturePortraitUrl } from '@/lib/storage/creaturePortrait';

export function useCreaturePortrait(enemy: Pick<EnemyDef, 'id' | 'portraitUrl'> | undefined) {
  const [uri, setUri] = useState<string | undefined>(
    enemy?.portraitUrl?.startsWith('http') ? enemy.portraitUrl : undefined,
  );

  useEffect(() => {
    let active = true;
    if (!enemy) {
      setUri(undefined);
      return () => {
        active = false;
      };
    }
    if (enemy.portraitUrl?.startsWith('http')) {
      setUri(enemy.portraitUrl);
      return () => {
        active = false;
      };
    }
    resolveCreaturePortraitUrl(enemy).then((next) => {
      if (active) {
        setUri(next);
      }
    });
    return () => {
      active = false;
    };
  }, [enemy]);

  return uri;
}
