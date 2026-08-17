import type { ReactElement } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Body, Title } from '@/components/ui/Typography';
import { colors, spacing } from '@/theme/theme';
import type { AudioSettings } from '../types';
import { AudioCheckbox } from './AudioCheckbox';

interface VolumeSliderProps {
  testID: string;
  accessibilityLabel: string;
  minimumValue: number;
  maximumValue: number;
  value: number;
  onValueChange: (value: number) => void;
  minimumTrackTintColor: string;
  maximumTrackTintColor: string;
  thumbTintColor: string;
}

const VolumeSlider = Slider as unknown as (props: VolumeSliderProps) => ReactElement;

interface SettingsModalProps {
  visible: boolean;
  settings: AudioSettings;
  onClose: () => void;
  onMusicVolume: (volume: number) => void;
  onSfxVolume: (volume: number) => void;
  onMusicMuted: (muted: boolean) => void;
  onSfxMuted: (muted: boolean) => void;
}

export function SettingsModal({
  visible,
  settings,
  onClose,
  onMusicVolume,
  onSfxVolume,
  onMusicMuted,
  onSfxMuted,
}: SettingsModalProps): ReactElement {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.scrim}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss settings"
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />
        <Card style={styles.panel}>
          <Title>Settings</Title>
          <Body muted style={styles.section}>
            Music
          </Body>
          <VolumeSlider
            testID="settings-music-volume"
            accessibilityLabel="Music volume"
            minimumValue={0}
            maximumValue={100}
            value={settings.musicVolume * 100}
            onValueChange={(value) => onMusicVolume(value / 100)}
            minimumTrackTintColor={colors.gold}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.gold}
          />
          <AudioCheckbox
            label="Mute music"
            checked={settings.musicMuted}
            onChange={onMusicMuted}
            testID="settings-music-mute"
          />
          <Body muted style={styles.section}>
            Sounds
          </Body>
          <VolumeSlider
            testID="settings-sfx-volume"
            accessibilityLabel="Sounds volume"
            minimumValue={0}
            maximumValue={100}
            value={settings.sfxVolume * 100}
            onValueChange={(value) => onSfxVolume(value / 100)}
            minimumTrackTintColor={colors.gold}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.gold}
          />
          <AudioCheckbox
            label="Mute sounds"
            checked={settings.sfxMuted}
            onChange={onSfxMuted}
            testID="settings-sfx-mute"
          />
          <Button label="Close" variant="secondary" onPress={onClose} />
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: 'rgba(18, 16, 14, 0.86)',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  panel: {
    marginBottom: 0,
    zIndex: 1,
  },
  section: {
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
