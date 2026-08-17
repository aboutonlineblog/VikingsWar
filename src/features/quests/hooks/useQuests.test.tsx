import React, { type PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import { useQuests } from './useQuests';

const wrapper = ({ children }: PropsWithChildren) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

jest.mock('../api/catalogApi', () => ({
  fetchQuests: jest.fn(async () => {
    throw new Error('network');
  }),
}));

describe('useQuests', () => {
  it('surfaces catalog fetch errors', async () => {
    const { result } = await renderHook(() => useQuests(), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
