export function requestPushPermission(): Promise<boolean> {
  return Promise.resolve(false);
}

export function registerPushToken(_uid: string): Promise<void> {
  return Promise.resolve();
}
