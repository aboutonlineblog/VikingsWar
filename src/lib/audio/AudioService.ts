import { Image, type ImageSourcePropType } from 'react-native';
import Sound from 'react-native-sound';
import { audio } from '@/assets/audio';
import {
  DEFAULT_AUDIO_SETTINGS,
  type AudioSettings,
  type SfxId,
} from './audioTypes';
import { effectiveVolume } from './effectiveVolume';

const SFX_ASSETS: Record<SfxId, number> = {
  attack: audio.attack,
  special: audio.special,
  defend: audio.defend,
  potion: audio.potion,
  hit: audio.hit,
};

function resolveAssetUri(asset: number): string | null {
  const resolved = Image.resolveAssetSource(asset as ImageSourcePropType);
  return resolved?.uri ?? null;
}

function loadSound(uri: string): Promise<Sound> {
  return new Promise((resolve, reject) => {
    const sound = new Sound(uri, '', (error) => {
      if (error) {
        reject(error);
        return;
      }
      void Promise.resolve().then(() => resolve(sound));
    });
  });
}

export class AudioService {
  private prefs: AudioSettings = DEFAULT_AUDIO_SETTINGS;
  private music: Sound | null = null;
  private readonly sfx = new Map<SfxId, Sound>();
  private musicWanted = false;
  private preloadPromise: Promise<void> | null = null;

  setPrefs(prefs: AudioSettings): void {
    this.prefs = prefs;
    this.applyMusicState();
    this.applySfxVolumes();
  }

  async preload(): Promise<void> {
    if (this.preloadPromise) {
      return this.preloadPromise;
    }
    this.preloadPromise = this.loadAssets();
    return this.preloadPromise;
  }

  playSfx(id: SfxId): void {
    const volume = effectiveVolume(this.prefs.sfxVolume, this.prefs.sfxMuted);
    if (volume <= 0) {
      return;
    }
    const sound = this.sfx.get(id);
    if (!sound) {
      return;
    }
    sound.stop(() => {
      sound.setVolume(volume);
      sound.play();
    });
  }

  playMusic(): void {
    this.musicWanted = true;
    if (this.music) {
      this.applyMusicState();
      return;
    }
    void this.preload().then(() => {
      this.applyMusicState();
    });
  }

  stopMusic(): void {
    this.musicWanted = false;
    this.applyMusicState();
  }

  private async loadAssets(): Promise<void> {
    try {
      Sound.setCategory('Ambient', true);
      Sound.setActive(true);
    } catch {
      return;
    }

    const musicUri = resolveAssetUri(audio.battleTheme);
    if (musicUri) {
      try {
        this.music = await loadSound(musicUri);
        this.music.setNumberOfLoops(-1);
      } catch {
        this.music = null;
      }
    }

    await Promise.all(
      (Object.keys(SFX_ASSETS) as SfxId[]).map(async (id) => {
        const uri = resolveAssetUri(SFX_ASSETS[id]);
        if (!uri) {
          return;
        }
        try {
          const sound = await loadSound(uri);
          this.sfx.set(id, sound);
        } catch {
          this.sfx.delete(id);
        }
      }),
    );

    this.applyMusicState();
    this.applySfxVolumes();
  }

  private applyMusicState(): void {
    const music = this.music;
    if (!music) {
      return;
    }
    const volume = effectiveVolume(this.prefs.musicVolume, this.prefs.musicMuted);
    music.setVolume(volume);
    if (!this.musicWanted || volume <= 0) {
      music.stop();
      return;
    }
    music.setNumberOfLoops(-1);
    if (!music.isPlaying()) {
      music.play();
    }
  }

  private applySfxVolumes(): void {
    const volume = effectiveVolume(this.prefs.sfxVolume, this.prefs.sfxMuted);
    this.sfx.forEach((sound) => {
      if (sound) {
        sound.setVolume(volume);
      }
    });
  }
}

export const audioService = new AudioService();
