import { callGameFunction } from '@/lib/firebase/callGameFunction';
import { track, AnalyticsEvents } from '@/lib/analytics/analytics';
import { USE_EMULATORS } from '@/lib/env';
import type { Player, ShopProductDef } from '@shared/types';

export interface IapAdapter {
  purchase(product: ShopProductDef): Promise<{ player: Player }>;
}

export const DevIapAdapter: IapAdapter = {
  async purchase(product: ShopProductDef): Promise<{ player: Player }> {
    const result = await callGameFunction<{ player: Player; product: ShopProductDef }>(
      'fulfillDevPurchase',
      { productId: product.id },
    );
    track(AnalyticsEvents.purchase, { productId: product.id, dev: true });
    return { player: result.player };
  },
};

export const StoreIapAdapter: IapAdapter = {
  async purchase(product: ShopProductDef): Promise<{ player: Player }> {
    if (USE_EMULATORS || __DEV__) {
      return DevIapAdapter.purchase(product);
    }
    throw new Error('Store IAP is not configured. Replace placeholder Firebase/IAP credentials first.');
  },
};

export function getIapAdapter(): IapAdapter {
  return USE_EMULATORS || __DEV__ ? DevIapAdapter : StoreIapAdapter;
}
