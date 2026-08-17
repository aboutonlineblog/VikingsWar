import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_AUDIO_SETTINGS } from '@/lib/audio/audioTypes';
import {
  AUDIO_SETTINGS_KEY,
  loadAudioSettings,
  parseAudioSettings,
  saveAudioSettings,
} from './settingsStorage';

describe('settingsStorage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('returns defaults for missing or invalid payloads', () => {
    expect(parseAudioSettings(null)).toEqual(DEFAULT_AUDIO_SETTINGS);
    expect(parseAudioSettings({ musicVolume: 4, sfxMuted: 'yes' })).toEqual({
      ...DEFAULT_AUDIO_SETTINGS,
      musicVolume: 1,
    });
  });

  it('persists and reloads audio settings', async () => {
    const settings = {
      musicVolume: 0.4,
      sfxVolume: 0.2,
      musicMuted: true,
      sfxMuted: false,
    };
    await saveAudioSettings(settings);
    expect(await AsyncStorage.getItem(AUDIO_SETTINGS_KEY)).toContain('0.4');
    expect(await loadAudioSettings()).toEqual(settings);
  });

  it('falls back to defaults when nothing is stored', async () => {
    expect(await loadAudioSettings()).toEqual(DEFAULT_AUDIO_SETTINGS);
  });
});
