import { useCallback, useState } from 'react';

export function useBusyAction(): {
  run: (key: string, fn: () => Promise<unknown>) => Promise<void>;
  isBusy: (key: string) => boolean;
} {
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const run = useCallback(async (key: string, fn: () => Promise<unknown>): Promise<void> => {
    setPendingKey(key);
    try {
      await fn();
    } finally {
      setPendingKey(null);
    }
  }, []);

  const isBusy = useCallback((key: string): boolean => pendingKey === key, [pendingKey]);

  return { run, isBusy };
}
