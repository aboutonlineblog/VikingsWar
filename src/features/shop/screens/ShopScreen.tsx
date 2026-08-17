import { Image, StyleSheet, View } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Title, Body } from '@/components/ui/Typography';
import { useGameAlert } from '@/components/ui/GameAlert';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { catalogKeys, playerKeys } from '@/lib/query/keys';
import { fetchShopProducts } from '@/features/quests/api/catalogApi';
import { getIapAdapter } from '@/lib/iap/IapAdapter';
import { useAuth } from '@/features/auth';
import { usePlayer } from '@/features/player';
import { useBusyAction } from '@/hooks/useBusyAction';
import { images } from '@/assets';
import { colors, spacing } from '@/theme/theme';

export function ShopScreen() {
  const products = useQuery({ queryKey: catalogKeys.doc('shopProducts'), queryFn: fetchShopProducts });
  const player = usePlayer();
  const { user } = useAuth();
  const { showAlert } = useGameAlert();
  const { run, isBusy } = useBusyAction();
  const queryClient = useQueryClient();
  const iap = getIapAdapter();

  return (
    <Screen>
      <Title>Shop</Title>
      <Body muted>Runes {player.data?.currencies.runes ?? 0} · convenience and cosmetics only</Body>
      <View style={styles.grid}>
        {(products.data ?? []).map((product) => (
          <View key={product.id} style={styles.tile}>
            <Card style={styles.card}>
              <Image
                source={images.iconGift}
                style={styles.art}
                resizeMode="contain"
                accessibilityLabel={`${product.name} image`}
              />
              <Body numberOfLines={2}>{product.name}</Body>
              <Body muted numberOfLines={2} style={styles.meta}>
                {product.description}
                {product.runeCost ? ` · ${product.runeCost} Runes` : ''}
                {product.powerAffecting ? ' · BLOCKED (power)' : ''}
              </Body>
              <Button
                label="Acquire"
                disabled={product.powerAffecting}
                loading={isBusy(`buy:${product.id}`)}
                onPress={() => {
                  void run(`buy:${product.id}`, async () => {
                    try {
                      const result = await iap.purchase(product);
                      if (user?.uid) {
                        queryClient.setQueryData(playerKeys.me(user.uid), result.player);
                      }
                    } catch (error) {
                      showAlert({ title: 'Purchase failed', message: String(error) });
                    }
                  });
                }}
              />
            </Card>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    marginTop: spacing.sm,
  },
  tile: {
    width: '33.333%',
    paddingHorizontal: 4,
    marginBottom: spacing.sm,
  },
  card: {
    flex: 1,
    marginBottom: 0,
    padding: spacing.sm,
  },
  art: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: spacing.sm,
    backgroundColor: colors.bg,
  },
  meta: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: spacing.xs,
  },
});
