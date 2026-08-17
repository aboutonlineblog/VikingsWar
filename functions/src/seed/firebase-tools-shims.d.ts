declare module 'firebase-tools/lib/auth' {
  export interface FirebaseCliAccount {
    user: { email?: string };
    tokens?: {
      refresh_token?: string;
    };
  }

  export function getGlobalDefaultAccount(): FirebaseCliAccount | undefined;
}

declare module 'firebase-tools/lib/defaultCredentials' {
  export function getCredentialPathAsync(account: {
    user: { email?: string };
    tokens?: { refresh_token?: string };
  }): Promise<string | undefined>;
}
