import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { RankBadge } from '@/components/ui/RankBadge';
import { Title, Body } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { CachedRemoteImage } from '@/components/ui/CachedRemoteImage';
import { useGameAlert } from '@/components/ui/GameAlert';
import {
  useAttackBoss,
  useAttackPlayer,
  useEnemies,
  useFightEnemy,
  usePvpTargets,
} from '@/features/combat/hooks/useCombat';
import { fetchBosses } from '@/features/quests/api/catalogApi';
import { useQuery } from '@tanstack/react-query';
import { catalogKeys } from '@/lib/query/keys';
import { combatPayloadFromResult, presentCombat } from '@/features/combat/presentCombat';
import { useCreaturePortrait } from '@/hooks/useCreaturePortrait';
import type { EnemyDef } from '@shared/types';
import type { RootStackParamList } from '@/app/navigation/types';

function EnemyCard({
  enemy,
  onFight,
  loading,
}: {
  enemy: EnemyDef;
  onFight: () => void;
  loading: boolean;
}) {
  const portraitUri = useCreaturePortrait(enemy);
  return (
    <Card>
      <CachedRemoteImage uri={portraitUri} style={{ width: 48, height: 48, borderRadius: 24 }} />
      <Badge label={enemy.type === 'monster' ? 'Monster' : 'Animal'} />
      <Body>
        {enemy.name} · Lv {enemy.level}
      </Body>
      <Body muted>
        ATK {enemy.attack} · DEF {enemy.defense} · SPD {enemy.speed} · HP {enemy.health}
      </Body>
      <Button label={`Fight (${enemy.staminaCost} stam)`} loading={loading} onPress={onFight} />
    </Card>
  );
}

export function BattleScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { showAlert } = useGameAlert();
  const enemies = useEnemies();
  const fight = useFightEnemy();
  const targets = usePvpTargets();
  const attack = useAttackPlayer();
  const bossFight = useAttackBoss();
  const bosses = useQuery({ queryKey: catalogKeys.doc('bosses'), queryFn: fetchBosses });

  return (
    <Screen edges={['left', 'right']}>
      <Title>Battle</Title>
      <Body>PvE</Body>
      {(enemies.data ?? []).map((enemy) => (
        <EnemyCard
          key={enemy.id}
          enemy={enemy}
          loading={fight.isPending && fight.variables === enemy.id}
          onFight={() =>
            fight.mutate(enemy.id, {
              onSuccess: (result) =>
                presentCombat(
                  navigation,
                  combatPayloadFromResult(enemy.name, enemy.name, result, enemy),
                ),
              onError: (error) => showAlert({ title: 'Battle failed', message: String(error) }),
            })
          }
        />
      ))}
      <Body>Solo bosses</Body>
      {(bosses.data ?? [])
        .filter((boss) => !boss.clanRaid)
        .map((boss) => (
          <Card key={boss.id}>
            <Body>{boss.name}</Body>
            <Button
              label="Challenge"
              variant="secondary"
              loading={bossFight.isPending && bossFight.variables === boss.id}
              onPress={() => {
                bossFight.mutate(boss.id, {
                  onSuccess: (result) =>
                    presentCombat(
                      navigation,
                      combatPayloadFromResult(boss.name, boss.name, result),
                    ),
                  onError: (error) => showAlert({ title: 'Boss failed', message: String(error) }),
                });
              }}
            />
          </Card>
        ))}
      <Button label="Clan / world raids" variant="secondary" onPress={() => navigation.navigate('BossRaid')} />
      <Body>PvP raids</Body>
      {(targets.data?.targets ?? []).map((target) => (
        <Card key={target.uid}>
          <RankBadge prestige={target.prestige} />
          <Body>
            {target.vikingName} · Lv {target.level}
          </Body>
          <Button
            label="Raid"
            loading={attack.isPending && attack.variables === target.uid}
            onPress={() =>
              attack.mutate(target.uid, {
                onSuccess: (result) =>
                  presentCombat(
                    navigation,
                    combatPayloadFromResult(`Raid on ${target.vikingName}`, target.vikingName, result),
                  ),
                onError: (error) => showAlert({ title: 'Raid blocked', message: String(error) }),
              })
            }
          />
        </Card>
      ))}
    </Screen>
  );
}
