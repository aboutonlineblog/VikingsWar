import React from 'react';
import { render } from '@testing-library/react-native';
import { VisitVillageScreen } from './VisitVillageScreen';

jest.mock('@/features/player/api/playerApi', () => ({
  fetchPlayer: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

const { useQuery } = jest.requireMock('@tanstack/react-query') as { useQuery: jest.Mock };

describe('VisitVillageScreen', () => {
  const navigation = { goBack: jest.fn() };
  const route = { key: 'visit', name: 'VisitVillage' as const, params: { uid: 'other' } };

  it('does not spin forever when the village is missing', async () => {
    useQuery.mockReturnValue({ isPending: false, isError: false, data: null });
    const { getByText } = await render(
      <VisitVillageScreen navigation={navigation as never} route={route as never} />,
    );
    expect(getByText('No hall in sight')).toBeTruthy();
    expect(getByText('Back')).toBeTruthy();
  });
});
