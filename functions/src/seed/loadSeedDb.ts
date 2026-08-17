import { getGlobalDefaultAccount } from 'firebase-tools/lib/auth';
import { getCredentialPathAsync } from 'firebase-tools/lib/defaultCredentials';
import type { Firestore } from 'firebase-admin/firestore';
import { isEmulatorSeed } from './seedGuard';

const LIVE_PROJECT_ID = 'vikings-war-5296b';

export async function loadSeedDb(): Promise<Firestore> {
  process.env.GOOGLE_CLOUD_PROJECT ??= LIVE_PROJECT_ID;
  process.env.GCLOUD_PROJECT ??= LIVE_PROJECT_ID;

  if (!isEmulatorSeed(process.env) && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const account = getGlobalDefaultAccount();
    if (!account) {
      throw new Error('Firebase CLI login is required to seed the live project. Run firebase login.');
    }
    const credentialPath = await getCredentialPathAsync(account);
    if (!credentialPath) {
      throw new Error('Firebase CLI login is required to seed the live project. Run firebase login.');
    }
    process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialPath;
  }

  const { db } = await import('../lib/admin');
  return db;
}
