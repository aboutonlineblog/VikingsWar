import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Title, Body } from '@/components/ui/Typography';
import { StatBar } from '@/components/ui/StatBar';
import { useGameAlert } from '@/components/ui/GameAlert';
import { useQuery } from '@tanstack/react-query';
import { catalogKeys } from '@/lib/query/keys';
import { fetchBosses } from '@/features/quests/api/catalogApi';
import { getDocData } from '@/lib/firebase/firestore';
import { FIRESTORE_COLLECTIONS } from '@shared/ids';
import { combatPayloadFromResult, presentCombat } from '@/features/combat/presentCombat';
import { useAttackBoss, useAttackClanRaid } from '@/features/combat/hooks/useCombat';
import { colors } from '@/theme/theme';
import type { CombatCallableResult } from '@shared/types';
import type { RootStackParamList } from '@/app/navigation/types';

export function BossRaidScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { showAlert } = useGameAlert();
  const bosses = useQuery({ queryKey: catalogKeys.doc('bosses'), queryFn: fetchBosses });
  const attackBoss = useAttackBoss();
  const attackClanRaid = useAttackClanRaid();
  const world = useQuery({
    queryKey: ['world', 'boss'],
    queryFn: () =>
      getDocData<{ bossId: string; hp: number; maxHp: number }>(FIRESTORE_COLLECTIONS.world, 'currentBoss'),
  });

  function showResult(name: string, result: CombatCallableResult): void {
    presentCombat(navigation, combatPayloadFromResult(name, name, result));
  }

  return (
    <Screen>
      <Title>Raids & World Boss</Title>
      {world.data ? (
        <Card>
          <Body>World boss {world.data.bossId}</Body>
          <StatBar label="HP" current={world.data.hp} max={world.data.maxHp} color={colors.danger} />
          <Body muted>Server-controlled. Clan raids contribute from the Clan tab.</Body>
        </Card>
      ) : null}
      {(bosses.data ?? []).map((boss) => (
        <Card key={boss.id}>
          <Body>
            {boss.name} {boss.clanRaid ? '· Clan raid' : '· Solo'}
          </Body>
          <Button
            label={boss.clanRaid ? 'Strike with the clan' : 'Fight'}
            loading={
              boss.clanRaid
                ? attackClanRaid.isPending && attackClanRaid.variables === boss.id
                : attackBoss.isPending && attackBoss.variables === boss.id
            }
            onPress={() => {
              if (boss.clanRaid) {
                attackClanRaid.mutate(boss.id, {
                  onSuccess: (result) => showResult(boss.name, result),
                  onError: (error) => showAlert({ title: 'Raid failed', message: String(error) }),
                });
                return;
              }
              attackBoss.mutate(boss.id, {
                onSuccess: (result) => showResult(boss.name, result),
                onError: (error) => showAlert({ title: 'Raid failed', message: String(error) }),
              });
            }}
          />
        </Card>
      ))}
    </Screen>
  );
}
