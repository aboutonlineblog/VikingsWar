import React from 'react';
import { render } from '@testing-library/react-native';
import { CombatProgressBar } from './CombatProgressBar';
import { colors } from '@/theme/theme';

describe('CombatProgressBar', () => {
  it('renders in-bar HP text with comma formatting', async () => {
    const { getByText, getByTestId, unmount } = await render(
      <CombatProgressBar
        variant="health"
        current={1250}
        max={1500}
        color={colors.success}
      />,
    );
    expect(getByText('1,250 / 1,500')).toBeTruthy();
    expect(getByTestId('combat-progress-bar-health-fill')).toBeTruthy();
    unmount();
  });

  it('renders speed bar without label text', async () => {
    const { getByTestId, queryByText, unmount } = await render(
      <CombatProgressBar
        variant="speed"
        current={50}
        max={100}
        color={colors.gold}
      />,
    );
    expect(getByTestId('combat-progress-bar-speed-fill')).toBeTruthy();
    expect(queryByText('50 / 100')).toBeNull();
    unmount();
  });

  it('shows ready styling when speed bar is full', async () => {
    const { getByTestId, unmount } = await render(
      <CombatProgressBar
        variant="speed"
        current={100}
        max={100}
        color={colors.gold}
        ready
        testID="player-speed-bar"
      />,
    );
    const bar = getByTestId('player-speed-bar');
    expect(bar.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          borderColor: colors.gold,
        }),
      ]),
    );
    unmount();
  });
});
