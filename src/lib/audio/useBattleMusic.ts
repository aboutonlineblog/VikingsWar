import { useEffect } from 'react';
import { audioService } from './AudioService';

export function useBattleMusic(): void {
  useEffect(() => {
    audioService.playMusic();
    return () => {
      audioService.stopMusic();
    };
  }, []);
}
