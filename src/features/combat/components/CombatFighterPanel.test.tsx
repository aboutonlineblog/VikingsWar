import React from 'react';
import { render } from '@testing-library/react-native';
import { images } from '@/assets';
import { colors } from '@/theme/theme';
import { CombatFighterPanel } from './CombatFighterPanel';

describe('CombatFighterPanel', () => {
  it('renders left-side fighter with HP and speed bars', async () => {
    const { getByText, getByTestId, unmount } = await render(
      <CombatFighterPanel
        name="Erik Bloodaxe"
        portrait={images.portraitHud}
        hp={1250}
        hpMax={1500}
        atb={60}
        hpColor={colors.success}
        side="left"
        durationMs={400}
        hitKey={0}
        lungeDir={0}
        freezeAtb={false}
      />,
    );
    expect(getByText('Erik Bloodaxe')).toBeTruthy();
    expect(getByText('1,250 / 1,500')).toBeTruthy();
    expect(getByTestId('left-health-bar')).toBeTruthy();
    expect(getByTestId('left-speed-bar')).toBeTruthy();
    unmount();
  });

  it('renders right-side fighter with mirrored layout', async () => {
    const { getByText, getByTestId, unmount } = await render(
      <CombatFighterPanel
        name="Bjorn Ironside"
        portrait={images.portraitHud}
        hp={950}
        hpMax={1400}
        atb={100}
        hpColor={colors.danger}
        side="right"
        durationMs={400}
        hitKey={0}
        lungeDir={0}
        freezeAtb={false}
        speedReady
      />,
    );
    expect(getByText('Bjorn Ironside')).toBeTruthy();
    expect(getByText('950 / 1,400')).toBeTruthy();
    expect(getByTestId('right-health-bar')).toBeTruthy();
    expect(getByTestId('right-speed-bar')).toBeTruthy();
    unmount();
  });
});
