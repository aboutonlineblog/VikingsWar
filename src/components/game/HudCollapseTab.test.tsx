import React from 'react';
import { StyleSheet } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { HudCollapseTab } from './HudCollapseTab';

describe('HudCollapseTab', () => {
  it('points the ornate chevron down while the HUD is minimized', async () => {
    const { getByTestId, getByLabelText } = await render(
      <HudCollapseTab expanded={false} onPress={jest.fn()} />,
    );

    expect(getByLabelText('Expand HUD')).toBeTruthy();
    expect(StyleSheet.flatten(getByTestId('hud-chevron-icon').props.style).transform).toBeUndefined();
  });

  it('reverses the chevron to point up when the HUD is expanded', async () => {
    const onPress = jest.fn();
    const { getByTestId, getByLabelText } = await render(
      <HudCollapseTab expanded onPress={onPress} />,
    );

    expect(getByLabelText('Collapse HUD')).toBeTruthy();
    expect(StyleSheet.flatten(getByTestId('hud-chevron-icon').props.style).transform).toEqual([
      { rotate: '180deg' },
    ]);

    fireEvent.press(getByTestId('hud-chevron'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
