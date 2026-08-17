import { Image } from 'react-native';
import Sound from 'react-native-sound';
import { AudioService } from './AudioService';

type MockSound = {
  filename: string;
  volume: number;
  loops: number;
  playing: boolean;
  isPlaying: () => boolean;
};

type SoundClass = typeof Sound & { instances: MockSound[] };

const MockSound = Sound as SoundClass;

describe('AudioService', () => {
  beforeEach(() => {
    MockSound.instances = [];
    jest.spyOn(Image, 'resolveAssetSource').mockReturnValue({
      uri: 'file://mock.wav',
      width: 0,
      height: 0,
      scale: 1,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  async function loadedService(): Promise<AudioService> {
    const service = new AudioService();
    await service.preload();
    return service;
  }

  it('plays looping music at the effective volume', async () => {
    const service = await loadedService();
    service.playMusic();
    const music = MockSound.instances[0];
    expect(music.playing).toBe(true);
    expect(music.loops).toBe(-1);
    expect(music.volume).toBe(0.7);
  });

  it('stops music when muted and does not play SFX when sounds are muted', async () => {
    const service = await loadedService();
    service.playMusic();
    expect(MockSound.instances[0].playing).toBe(true);

    service.setPrefs({
      musicVolume: 0.8,
      sfxVolume: 1,
      musicMuted: true,
      sfxMuted: true,
    });
    expect(MockSound.instances[0].playing).toBe(false);
    expect(MockSound.instances[0].volume).toBe(0);

    service.playSfx('attack');
    const attack = MockSound.instances.find((sound) => sound !== MockSound.instances[0]);
    expect(attack?.playing).toBe(false);
  });

  it('stops music on explicit stop', async () => {
    const service = await loadedService();
    service.playMusic();
    service.stopMusic();
    expect(MockSound.instances[0].playing).toBe(false);
  });
});
