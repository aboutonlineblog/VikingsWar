import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { audioService, DEFAULT_AUDIO_SETTINGS, type AudioSettings } from '@/lib/audio';
import { loadAudioSettings, saveAudioSettings } from '../storage/settingsStorage';
import { SettingsModal } from '../components/SettingsModal';

interface SettingsContextValue {
  settings: AudioSettings;
  settingsVisible: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  setMusicVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  setMusicMuted: (muted: boolean) => void;
  setSfxMuted: (muted: boolean) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: PropsWithChildren) {
  const [settings, setSettings] = useState<AudioSettings>(DEFAULT_AUDIO_SETTINGS);
  const [settingsVisible, setSettingsVisible] = useState(false);

  useEffect(() => {
    void loadAudioSettings().then((loaded) => {
      setSettings(loaded);
      audioService.setPrefs(loaded);
    });
    void audioService.preload();
  }, []);

  const commit = useCallback((patch: Partial<AudioSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      audioService.setPrefs(next);
      void saveAudioSettings(next);
      return next;
    });
  }, []);

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      settingsVisible,
      openSettings: () => setSettingsVisible(true),
      closeSettings: () => setSettingsVisible(false),
      setMusicVolume: (volume) => commit({ musicVolume: volume }),
      setSfxVolume: (volume) => commit({ sfxVolume: volume }),
      setMusicMuted: (muted) => commit({ musicMuted: muted }),
      setSfxMuted: (muted) => commit({ sfxMuted: muted }),
    }),
    [commit, settings, settingsVisible],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
      <SettingsModal
        visible={settingsVisible}
        settings={settings}
        onClose={() => setSettingsVisible(false)}
        onMusicVolume={(volume) => commit({ musicVolume: volume })}
        onSfxVolume={(volume) => commit({ sfxVolume: volume })}
        onMusicMuted={(muted) => commit({ musicMuted: muted })}
        onSfxMuted={(muted) => commit({ sfxMuted: muted })}
      />
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const value = useContext(SettingsContext);
  if (!value) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return value;
}
