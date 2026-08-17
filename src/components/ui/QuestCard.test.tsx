import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { QuestCard } from './QuestCard';
import type { QuestDef } from '@shared/types';

const quest: QuestDef = {
  id: 'raid_coastal_village',
  name: 'Raid the Coastal Village',
  description: 'Strike a poorly guarded coastal hamlet.',
  category: 'raiding',
  chapter: 1,
  energyCost: 8,
  requiredLevel: 3,
  rewards: { xp: 50, silver: 125, wood: 10 },
};

describe('QuestCard', () => {
  it('shows rewards and GO', async () => {
    const onGo = jest.fn();
    const { getByText } = await render(<QuestCard quest={quest} onGo={onGo} />);
    expect(getByText('Raid the Coastal Village')).toBeTruthy();
    expect(getByText(/XP 50/)).toBeTruthy();
    fireEvent.press(getByText('GO'));
    expect(onGo).toHaveBeenCalledTimes(1);
  });
});
