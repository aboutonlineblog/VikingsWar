import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { BuildingTile } from '@/components/ui/BuildingTile';
import { QuestCard } from '@/components/ui/QuestCard';
import { Title, Body } from '@/components/ui/Typography';
import { useGameAlert } from '@/components/ui/GameAlert';
import { usePlayer } from '@/features/player';
import { CollectResourcesModal } from '@/features/village/components/CollectResourcesModal';
import {
  useBuildingsCatalog,
  useClaimDailyLogin,
  useCollectResources,
  useSpeedUpBuilding,
  useUpgradeBuilding,
} from '@/features/village/hooks/useVillage';
import { useCompleteQuest, useQuests } from '@/features/quests/hooks/useQuests';
import { combatPayloadFromResult, presentCombat } from '@/features/combat/presentCombat';
import type { RootStackParamList } from '@/app/navigation/types';
import { images } from '@/assets';
import { colors, radius, spacing } from '@/theme/theme';
import { utcDateString } from '@shared/dates';
import { accrueResources, hasUncollected } from '@shared/resources';
import type { BuildingId } from '@shared/types';

export function VillageScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { showAlert } = useGameAlert();
  const playerQuery = usePlayer();
  const buildings = useBuildingsCatalog();
  const collect = useCollectResources();
  const upgrade = useUpgradeBuilding();
  const speedUp = useSpeedUpBuilding();
  const daily = useClaimDailyLogin();
  const quests = useQuests();
  const complete = useCompleteQuest();
  const player = playerQuery.data;
  const chapter = player?.currentChapter ?? 1;
  const [nowMs, setNowMs] = useState(Date.now());
  const [collectOpen, setCollectOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (playerQuery.isPending) {
    return (
      <Screen edges={['left', 'right']}>
        <Body>Loading the settlement…</Body>
      </Screen>
    );
  }

  if (playerQuery.isError || !player) {
    return (
      <Screen edges={['left', 'right']}>
        <Body>Could not load your village.</Body>
      </Screen>
    );
  }

  const featured = (quests.data ?? []).filter((quest) => quest.chapter <= chapter).slice(0, 3);
  const pending = accrueResources(
    player.buildings,
    buildings.data ?? [],
    player.resourcesLastCollectedAt,
    nowMs,
  );
  const uncollected = hasUncollected(pending);
  const claimedToday = player.dailyLogin.lastClaimDate === utcDateString(nowMs);

  return (
    <Screen edges={['left', 'right']}>
      <Image
        source={images.panoramaVillage}
        style={styles.panorama}
        resizeMode="cover"
        accessibilityLabel="Village panorama"
      />
      <Title>{player.vikingName}'s Village</Title>
      <Body muted>
        ATK {player.attack} · DEF {player.defense} · SPD {player.speed}
      </Body>
      <View style={styles.collectWrap}>
        <Button
          label="Collect resources"
          onPress={() => setCollectOpen(true)}
          disabled={collect.isPending || !uncollected}
        />
        {uncollected ? (
          <View
            testID="collect-resources-badge"
            accessibilityLabel="Uncollected resources"
            pointerEvents="none"
            style={styles.collectBadge}
          />
        ) : null}
      </View>
      <Button
        label={claimedToday ? 'Claimed today' : 'Claim daily login'}
        variant="secondary"
        onPress={() => daily.mutate()}
        disabled={daily.isPending || claimedToday}
        loading={daily.isPending}
      />
      <CollectResourcesModal
        visible={collectOpen}
        pending={pending}
        collecting={collect.isPending}
        onClose={() => setCollectOpen(false)}
        onCollect={() => {
          collect.mutate(undefined, {
            onSuccess: () => setCollectOpen(false),
          });
        }}
      />
      <View style={styles.grid}>
        {(buildings.data ?? []).map((def) => {
          const state = player.buildings[def.id as BuildingId];
          return (
            <View key={def.id} style={styles.tile}>
              <BuildingTile
                def={def}
                state={state}
                nowMs={nowMs}
                upgradeLoading={upgrade.isPending && upgrade.variables === def.id}
                speedUpLoading={speedUp.isPending && speedUp.variables === def.id}
                onUpgrade={() =>
                  upgrade.mutate(def.id, {
                    onError: (error) =>
                      showAlert({ title: 'Upgrade failed', message: String(error) }),
                  })
                }
                onSpeedUp={() => speedUp.mutate(def.id)}
              />
            </View>
          );
        })}
      </View>
      <Title>Quests</Title>
      {featured.map((quest) => (
        <QuestCard
          key={quest.id}
          quest={quest}
          loading={complete.isPending && complete.variables === quest.id}
          onGo={() => {
            complete.mutate(quest.id, {
              onSuccess: (result) => {
                presentCombat(
                  navigation,
                  combatPayloadFromResult(quest.name, quest.name, result),
                );
              },
              onError: (error) => showAlert({ title: 'Quest failed', message: String(error) }),
            });
          }}
        />
      ))}
      <Button label="All quests" variant="secondary" onPress={() => navigation.navigate('Quests')} />
      <Card>
        <Body>More from the hall</Body>
        <Button label="Events" variant="secondary" onPress={() => navigation.navigate('Events')} />
        <Button label="Shop" variant="secondary" onPress={() => navigation.navigate('Shop')} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  panorama: {
    width: '100%',
    height: 140,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  collectWrap: {
    position: 'relative',
    overflow: 'visible',
  },
  collectBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.danger,
    zIndex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  tile: {
    width: '50%',
    paddingHorizontal: 6,
  },
});
