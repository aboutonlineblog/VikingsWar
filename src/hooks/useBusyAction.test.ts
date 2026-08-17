import { act, renderHook } from '@testing-library/react-native';
import { useBusyAction } from './useBusyAction';

describe('useBusyAction', () => {
  it('marks a key busy until the promise settles', async () => {
    let resolve!: () => void;
    const pending = new Promise<void>((next) => {
      resolve = next;
    });
    const { result } = await renderHook(() => useBusyAction());

    let finished: Promise<void> = Promise.resolve();
    await act(async () => {
      finished = result.current.run('gift', () => pending);
    });

    expect(result.current.isBusy('gift')).toBe(true);
    expect(result.current.isBusy('help')).toBe(false);

    await act(async () => {
      resolve();
      await finished;
    });

    expect(result.current.isBusy('gift')).toBe(false);
  });

  it('clears busy state when the action fails', async () => {
    const { result } = await renderHook(() => useBusyAction());

    await act(async () => {
      await expect(result.current.run('request', async () => {
        throw new Error('nope');
      })).rejects.toThrow('nope');
    });

    expect(result.current.isBusy('request')).toBe(false);
  });
});
