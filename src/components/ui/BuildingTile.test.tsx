import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { BuildingTile } from './BuildingTile';
import type { BuildingDef, BuildingState } from '@shared/types';

const def: BuildingDef = {
  id: 'farm',
  name: 'Farm',
  description: 'Produces Food.',
  maxLevel: 10,
  produces: { food: 12 },
  perLevelRate: 1,
};

describe('BuildingTile', () => {
  it('disables upgrade while a timer is running', async () => {
    const onUpgrade = jest.fn();
    const state: BuildingState = {
      id: 'farm',
      level: 1,
      upgradeCompletesAt: 50_000,
    };
    const { getByText } = await render(
      <BuildingTile def={def} state={state} nowMs={10_000} onUpgrade={onUpgrade} onSpeedUp={jest.fn()} />,
    );
    fireEvent.press(getByText('Upgrade'));
    expect(onUpgrade).not.toHaveBeenCalled();
    expect(getByText('Speed up (15 Runes)')).toBeTruthy();
  });
});
