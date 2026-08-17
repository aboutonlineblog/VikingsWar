export type SfxId = 'attack' | 'special' | 'defend' | 'potion' | 'hit';

export interface AudioSettings {
  musicVolume: number;
  sfxVolume: number;
  musicMuted: boolean;
  sfxMuted: boolean;
}

export const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  musicVolume: 0.7,
  sfxVolume: 1,
  musicMuted: false,
  sfxMuted: false,
};
