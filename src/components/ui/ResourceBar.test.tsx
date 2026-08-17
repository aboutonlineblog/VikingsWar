import React from 'react';
import { render } from '@testing-library/react-native';
import { ResourceBar } from './ResourceBar';

describe('ResourceBar', () => {
  it('shows compact resource amounts with icons', async () => {
    const { getByLabelText } = await render(
      <ResourceBar
        currencies={{
          silver: 12540,
          gold: 0,
          food: 8,
          wood: 20,
          iron: 12,
          meat: 0,
          herbs: 0,
          ironPlate: 0,
          bronzePlate: 0,
          silverPlate: 0,
          goldPlate: 0,
          runes: 15,
          eventCurrency: 0,
        }}
      />,
    );
    expect(getByLabelText('silver 12540')).toBeTruthy();
    expect(getByLabelText('runes 15')).toBeTruthy();
  });
});
