import { httpsCallable } from '@react-native-firebase/functions';
import { getFunctions } from '@/lib/firebase/initFirebase';

export async function callGameFunction<TResponse>(
  name: string,
  data: Record<string, unknown> = {},
): Promise<TResponse> {
  const callable = httpsCallable(getFunctions(), name);
  const result = await callable(data);
  return result.data as TResponse;
}
