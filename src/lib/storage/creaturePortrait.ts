import type { EnemyDef } from '@shared/types';
import { getStorage, ref, getDownloadURL } from '@react-native-firebase/storage';

const urlCache = new Map<string, string>();

export function creatureStoragePath(enemy: Pick<EnemyDef, 'id' | 'portraitUrl'>): string {
  if (enemy.portraitUrl && !enemy.portraitUrl.startsWith('http')) {
    return enemy.portraitUrl;
  }
  return `creatures/${enemy.id}.webp`;
}

export async function resolveCreaturePortraitUrl(
  enemy: Pick<EnemyDef, 'id' | 'portraitUrl'>,
): Promise<string | undefined> {
  if (enemy.portraitUrl?.startsWith('http')) {
    return enemy.portraitUrl;
  }
  const storagePath = creatureStoragePath(enemy);
  const cached = urlCache.get(storagePath);
  if (cached) {
    return cached;
  }
  try {
    const url = await getDownloadURL(ref(getStorage(), storagePath));
    urlCache.set(storagePath, url);
    return url;
  } catch {
    return undefined;
  }
}

export function clearCreaturePortraitCache(): void {
  urlCache.clear();
}
