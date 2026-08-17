import React from 'react';
import { render } from '@testing-library/react-native';
import { HudResourceRow } from './HudResourceRow';

describe('HudResourceRow', () => {
  it('renders five resources with formatted values', async () => {
    const { getByLabelText, getByText, unmount } = await render(
      <HudResourceRow
        currencies={{
          silver: 1250,
          gold: 0,
          food: 10,
          wood: 20,
          iron: 5,
          meat: 0,
          herbs: 0,
          ironPlate: 0,
          bronzePlate: 0,
          silverPlate: 0,
          goldPlate: 0,
          runes: 0,
          eventCurrency: 0,
        }}
      />,
    );

    expect(getByLabelText('silver 1250')).toBeTruthy();
    expect(getByText('1,250')).toBeTruthy();
    expect(getByLabelText('food 10')).toBeTruthy();
    expect(getByLabelText('wood 20')).toBeTruthy();
    expect(getByLabelText('iron 5')).toBeTruthy();
    expect(getByLabelText('runes 0')).toBeTruthy();
    unmount();
  });
});
