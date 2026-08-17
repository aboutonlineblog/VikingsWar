import { Platform } from 'react-native';
import { getAuth, connectAuthEmulator } from '@react-native-firebase/auth';
import { getFirestore, connectFirestoreEmulator } from '@react-native-firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from '@react-native-firebase/functions';
import { getStorage, connectStorageEmulator } from '@react-native-firebase/storage';
import { USE_EMULATORS } from '@/lib/env';

let initialized = false;

export function initFirebase(): void {
  if (initialized) {
    return;
  }
  initialized = true;
  if (!USE_EMULATORS) {
    return;
  }
  const host = Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1';
  connectAuthEmulator(getAuth(), `http://${host}:9099`);
  connectFirestoreEmulator(getFirestore(), host, 8080);
  connectFunctionsEmulator(getFunctions(), host, 5001);
  connectStorageEmulator(getStorage(), host, 9199);
}

export { getAuth, getFirestore, getFunctions, getStorage };
