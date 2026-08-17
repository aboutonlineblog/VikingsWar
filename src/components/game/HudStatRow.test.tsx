import React from 'react';
import { render } from '@testing-library/react-native';
import { HudStatRow } from './HudStatRow';
import { colors } from '@/theme/theme';

describe('HudStatRow', () => {
  it('renders label with values and timer', async () => {
    const { getByText, getByTestId, unmount } = await render(
      <HudStatRow
        label="Stamina"
        current={18}
        max={20}
        color={colors.stamina}
        timer="05:32"
      />,
    );

    expect(getByText('Stamina 18/20')).toBeTruthy();
    expect(getByText('05:32')).toBeTruthy();
    expect(getByTestId('hud-stat-stamina-bar-fill')).toBeTruthy();
    unmount();
  });
});
