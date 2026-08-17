import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from '@react-native-firebase/auth';
import { getAuth } from '@/lib/firebase/initFirebase';

export interface AuthUser {
  uid: string;
  email: string | null;
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/wrong-password': 'Email or password is incorrect.',
  'auth/invalid-credential': 'Email or password is incorrect.',
  'auth/user-not-found': 'Email or password is incorrect.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Use a password with at least 6 characters.',
  'auth/network-request-failed': 'Check your connection and try again.',
  'auth/too-many-requests': 'Too many attempts. Wait a moment and try again.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/operation-not-allowed': 'Email sign-in is not enabled for this project.',
};

function getAuthErrorCode(error: unknown): string | null {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return null;
  }
  const code = (error as { code: unknown }).code;
  if (typeof code !== 'string' || code.length === 0) {
    return null;
  }
  return code.startsWith('auth/') ? code : `auth/${code}`;
}

export function mapAuthError(error: unknown): Error {
  const code = getAuthErrorCode(error);
  const message =
    (code && AUTH_ERROR_MESSAGES[code]) || 'Could not complete that request. Try again.';
  return new Error(message);
}

export function toAuthUser(next: User | null): AuthUser | null {
  return next ? { uid: next.uid, email: next.email ?? null } : null;
}

export function subscribeToAuth(onChange: (user: AuthUser | null) => void): () => void {
  return onAuthStateChanged(getAuth(), (next) => {
    onChange(toAuthUser(next));
  });
}

export async function signIn(email: string, password: string): Promise<void> {
  try {
    await signInWithEmailAndPassword(getAuth(), email, password);
  } catch (error) {
    throw mapAuthError(error);
  }
}

export async function register(email: string, password: string): Promise<void> {
  try {
    await createUserWithEmailAndPassword(getAuth(), email, password);
  } catch (error) {
    throw mapAuthError(error);
  }
}

export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(getAuth());
  } catch (error) {
    throw mapAuthError(error);
  }
}
