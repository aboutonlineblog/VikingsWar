import { StyleSheet, View } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { Title, Body } from '@/components/ui/Typography';
import { WarriorCard } from '@/components/ui/WarriorCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { usePlayer } from '@/features/player';
import { useRecruitWarrior, useUpgradeWarrior, useWarriorCatalog } from '@/features/inventory/hooks/useGear';

export function WarbandScreen() {
  const player = usePlayer();
  const catalog = useWarriorCatalog();
  const recruit = useRecruitWarrior();
  const upgrade = useUpgradeWarrior();

  return (
    <Screen>
      <Title>Warband</Title>
      <Body muted>
        {player.data?.warriors.length ?? 0}/{player.data?.warriorCap ?? 20} warriors
      </Body>
      {(player.data?.warriors ?? []).length === 0 ? (
        <EmptyState title="No warriors yet" message="Recruit a berserker, shieldmaiden, archer, or raider." />
      ) : null}
      <View style={styles.grid}>
        {(player.data?.warriors ?? []).map((warrior) => (
          <View key={warrior.instanceId} style={styles.tile}>
            <WarriorCard
              name={warrior.class}
              warriorClass={warrior.class}
              level={warrior.level}
              rarity={warrior.rarity}
              attack={warrior.attack}
              defense={warrior.defense}
              actionLabel="Upgrade"
              loading={upgrade.isPending && upgrade.variables === warrior.instanceId}
              onAction={() => upgrade.mutate(warrior.instanceId)}
            />
          </View>
        ))}
      </View>
      <Body>Recruit</Body>
      <View style={styles.grid}>
        {(catalog.data ?? []).map((def) => (
          <View key={def.id} style={styles.tile}>
            <WarriorCard
              name={def.name}
              warriorClass={def.class}
              level={1}
              rarity={def.rarity}
              attack={def.baseAttack}
              defense={def.baseDefense}
              actionLabel="Recruit"
              loading={recruit.isPending && recruit.variables === def.id}
              onAction={() => recruit.mutate(def.id)}
            />
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
    marginHorizontal: -6,
  },
  tile: {
    width: '50%',
    paddingHorizontal: 6,
  },
});
