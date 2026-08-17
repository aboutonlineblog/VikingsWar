import type { BuildingId, Player, ShopProductDef } from '../../../shared/types';
import { isBuildingBusy } from './buildings';
import { addCurrencies, subtractCurrencies } from './economy';

export function isEmulatorFulfillmentAllowed(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return env.FUNCTIONS_EMULATOR === 'true';
}

export function applyShopProduct(
  player: Player,
  product: ShopProductDef,
  nowMs: number,
): Player {
  if (product.powerAffecting) {
    throw new Error('POWER_AFFECTING');
  }
  const busyId =
    product.productType === 'speedup'
      ? (Object.keys(player.buildings) as BuildingId[]).find((id) =>
          isBuildingBusy(player.buildings[id], nowMs),
        )
      : undefined;
  if (product.productType === 'speedup' && !busyId) {
    throw new Error('NOTHING_TO_SPEED_UP');
  }
  if (product.runeCost) {
    player.currencies = subtractCurrencies(player.currencies, { runes: product.runeCost });
  }
  if (product.runesGranted) {
    player.currencies = addCurrencies(player.currencies, { runes: product.runesGranted });
  }
  if (product.productType === 'cosmetic' && product.cosmeticId) {
    player.cosmetics.avatars = Array.from(
      new Set([...player.cosmetics.avatars, product.cosmeticId]),
    );
  }
  if (product.productType === 'decoration' && product.cosmeticId) {
    player.cosmetics.villageDecor = Array.from(
      new Set([...player.cosmetics.villageDecor, product.cosmeticId]),
    );
  }
  if (product.productType === 'battlePass') {
    player.battlePass.premium = true;
  }
  if (product.productType === 'eventPass') {
    player.eventPasses = Array.from(new Set([...(player.eventPasses ?? []), product.id]));
  }
  if (busyId) {
    const building = player.buildings[busyId];
    building.level += 1;
    building.upgradeCompletesAt = null;
    if (building.level >= 3) {
      player.achievements = { ...player.achievements, builder: true };
    }
  }
  player.updatedAt = nowMs;
  return player;
}
