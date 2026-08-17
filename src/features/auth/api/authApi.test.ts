import { mapAuthError, register, signIn, signOut } from './authApi';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from '@react-native-firebase/auth';

const mockSignIn = signInWithEmailAndPassword as jest.MockedFunction<
  typeof signInWithEmailAndPassword
>;
const mockRegister = createUserWithEmailAndPassword as jest.MockedFunction<
  typeof createUserWithEmailAndPassword
>;
const mockSignOut = firebaseSignOut as jest.MockedFunction<typeof firebaseSignOut>;

describe('mapAuthError', () => {
  it('maps known Firebase Auth codes to player-facing messages', () => {
    expect(mapAuthError({ code: 'auth/invalid-email' }).message).toBe(
      'Enter a valid email address.',
    );
    expect(mapAuthError({ code: 'auth/wrong-password' }).message).toBe(
      'Email or password is incorrect.',
    );
    expect(mapAuthError({ code: 'auth/invalid-credential' }).message).toBe(
      'Email or password is incorrect.',
    );
    expect(mapAuthError({ code: 'auth/email-already-in-use' }).message).toBe(
      'An account with this email already exists.',
    );
    expect(mapAuthError({ code: 'auth/weak-password' }).message).toBe(
      'Use a password with at least 6 characters.',
    );
    expect(mapAuthError({ code: 'auth/network-request-failed' }).message).toBe(
      'Check your connection and try again.',
    );
    expect(mapAuthError({ code: 'auth/too-many-requests' }).message).toBe(
      'Too many attempts. Wait a moment and try again.',
    );
  });

  it('normalizes codes that omit the auth/ prefix', () => {
    expect(mapAuthError({ code: 'user-disabled' }).message).toBe(
      'This account has been disabled.',
    );
  });

  it('falls back when the code is unknown', () => {
    expect(mapAuthError({ code: 'auth/something-new' }).message).toBe(
      'Could not complete that request. Try again.',
    );
    expect(mapAuthError(new Error('network down')).message).toBe(
      'Could not complete that request. Try again.',
    );
  });
});

describe('authApi', () => {
  beforeEach(() => {
    mockSignIn.mockReset();
    mockRegister.mockReset();
    mockSignOut.mockReset();
  });

  it('signs in with email and password', async () => {
    mockSignIn.mockResolvedValueOnce({} as never);
    await signIn('jarl@example.com', 'secret1');
    expect(mockSignIn).toHaveBeenCalledWith(expect.anything(), 'jarl@example.com', 'secret1');
  });

  it('maps sign-in failures', async () => {
    mockSignIn.mockRejectedValueOnce({ code: 'auth/invalid-credential' });
    await expect(signIn('jarl@example.com', 'nope')).rejects.toThrow(
      'Email or password is incorrect.',
    );
  });

  it('registers with email and password', async () => {
    mockRegister.mockResolvedValueOnce({} as never);
    await register('jarl@example.com', 'secret1');
    expect(mockRegister).toHaveBeenCalledWith(expect.anything(), 'jarl@example.com', 'secret1');
  });

  it('maps register failures', async () => {
    mockRegister.mockRejectedValueOnce({ code: 'auth/email-already-in-use' });
    await expect(register('jarl@example.com', 'secret1')).rejects.toThrow(
      'An account with this email already exists.',
    );
  });

  it('signs out', async () => {
    mockSignOut.mockResolvedValueOnce(undefined as never);
    await signOut();
    expect(mockSignOut).toHaveBeenCalled();
  });
});
