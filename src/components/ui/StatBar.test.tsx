import React from 'react';
import { render } from '@testing-library/react-native';
import { StatBar } from './StatBar';
import { colors } from '@/theme/theme';

describe('StatBar', () => {
  it('shows the current and max values', async () => {
    const { getByText, getByTestId, unmount } = await render(
      <StatBar label="Health" current={80} max={100} color={colors.success} />,
    );
    expect(getByText('Health 80/100')).toBeTruthy();
    expect(getByTestId('stat-bar-fill')).toBeTruthy();
    unmount();
  });

  it('keeps the same label while interpolating fill', async () => {
    const { getByText, unmount } = await render(
      <StatBar
        label="HP"
        current={40}
        max={100}
        color={colors.danger}
        durationMs={400}
      />,
    );
    expect(getByText('HP 40/100')).toBeTruthy();
    unmount();
  });

  it('still renders the fill when animation is frozen', async () => {
    const { getByText, getByTestId, unmount } = await render(
      <StatBar
        label="Turn"
        current={80}
        max={100}
        color={colors.gold}
        animated={false}
      />,
    );
    expect(getByText('Turn 80/100')).toBeTruthy();
    expect(getByTestId('stat-bar-fill')).toBeTruthy();
    unmount();
  });
});
