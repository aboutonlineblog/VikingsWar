import React from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';
import { Button } from '@/components/ui/Button';
import { SettingsProvider, useSettings } from '../hooks/useSettings';
import { audioService } from '@/lib/audio';

jest.mock('react-native/Libraries/Modal/Modal', () => {
  function MockModal({
    visible,
    children,
  }: {
    visible: boolean;
    children: React.ReactNode;
  }) {
    return visible ? children : null;
  }
  MockModal.displayName = 'Modal';
  return { __esModule: true, default: MockModal };
});

function OpenButton() {
  const { openSettings } = useSettings();
  return <Button label="Open" onPress={openSettings} />;
}

describe('SettingsModal', () => {
  it('lets the player mute music and sounds', async () => {
    const setPrefs = jest.spyOn(audioService, 'setPrefs');
    const { getByText, getByTestId, getByLabelText } = await render(
      <SettingsProvider>
        <OpenButton />
      </SettingsProvider>,
    );

    await act(async () => {
      fireEvent.press(getByText('Open'));
    });
    expect(getByText('Settings')).toBeTruthy();
    expect(getByLabelText('Music volume')).toBeTruthy();
    expect(getByLabelText('Sounds volume')).toBeTruthy();

    await act(async () => {
      fireEvent.press(getByTestId('settings-music-mute'));
      fireEvent.press(getByTestId('settings-sfx-mute'));
    });

    expect(setPrefs).toHaveBeenCalledWith(
      expect.objectContaining({ musicMuted: true }),
    );
    expect(setPrefs).toHaveBeenCalledWith(
      expect.objectContaining({ sfxMuted: true }),
    );

    await act(async () => {
      fireEvent(getByTestId('settings-music-volume'), 'valueChange', 40);
    });
    expect(setPrefs).toHaveBeenCalledWith(
      expect.objectContaining({ musicVolume: 0.4, musicMuted: true }),
    );
  });
});
