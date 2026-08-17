import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DEFAULT_AUDIO_SETTINGS,
  type AudioSettings,
} from '@/lib/audio/audioTypes';
import { clampVolume } from '@/lib/audio/effectiveVolume';

export const AUDIO_SETTINGS_KEY = 'vikingswar.settings.audio';

function asBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function asVolume(value: unknown, fallback: number): number {
  return typeof value === 'number' ? clampVolume(value) : fallback;
}

export function parseAudioSettings(raw: unknown): AudioSettings {
  if (!raw || typeof raw !== 'object') {
    return { ...DEFAULT_AUDIO_SETTINGS };
  }
  const record = raw as Record<string, unknown>;
  return {
    musicVolume: asVolume(record.musicVolume, DEFAULT_AUDIO_SETTINGS.musicVolume),
    sfxVolume: asVolume(record.sfxVolume, DEFAULT_AUDIO_SETTINGS.sfxVolume),
    musicMuted: asBoolean(record.musicMuted, DEFAULT_AUDIO_SETTINGS.musicMuted),
    sfxMuted: asBoolean(record.sfxMuted, DEFAULT_AUDIO_SETTINGS.sfxMuted),
  };
}

export async function loadAudioSettings(): Promise<AudioSettings> {
  try {
    const stored = await AsyncStorage.getItem(AUDIO_SETTINGS_KEY);
    if (!stored) {
      return { ...DEFAULT_AUDIO_SETTINGS };
    }
    return parseAudioSettings(JSON.parse(stored) as unknown);
  } catch {
    return { ...DEFAULT_AUDIO_SETTINGS };
  }
}

export async function saveAudioSettings(settings: AudioSettings): Promise<void> {
  await AsyncStorage.setItem(AUDIO_SETTINGS_KEY, JSON.stringify(settings));
}
