import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, StyleSheet } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Title, Body } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { images, lootChestArt } from '@/assets';
import { spacing } from '@/theme/theme';
import { formatHuntingRewards, isHuntingRewards } from '@/utils/huntingRewards';
import type { RootStackParamList } from '@/app/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'CombatResult'>;

export function CombatResultScreen({ route, navigation }: Props) {
  const { title, combat, rewards, lootName } = route.params;
  const victory = combat?.attackerWon ?? true;

  return (
    <Screen>
      <Title>{title}</Title>
      {combat ? (
        <Card>
          <Badge label={victory ? 'Victory' : 'Defeat'} tone={victory ? 'success' : 'danger'} />
          <Body muted>
            Damage dealt {combat.attackerDamage}
            {combat.critical ? ' (crit)' : ''} · Taken {combat.defenderDamage}
          </Body>
        </Card>
      ) : (
        <Body>The work is done. No blades were drawn.</Body>
      )}
      {rewards ? (
        <Card>
          <Body>Rewards</Body>
          <Body muted>
            {isHuntingRewards(rewards)
              ? formatHuntingRewards(rewards)
              : `XP ${rewards.xp} · Silver ${rewards.silver}${rewards.wood ? ` · Wood ${rewards.wood}` : ''}${rewards.food ? ` · Food ${rewards.food}` : ''}${rewards.iron ? ` · Iron ${rewards.iron}` : ''}`}
          </Body>
        </Card>
      ) : null}
      {lootName ? (
        <Card>
          <Image source={lootChestArt(lootName)} style={styles.chest} resizeMode="contain" />
          <Body>Loot: {lootName}</Body>
        </Card>
      ) : (
        <Image source={images.chestWood} style={styles.chest} resizeMode="contain" />
      )}
      <Button label="Return" onPress={() => navigation.goBack()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  chest: {
    width: '100%',
    height: 90,
    marginBottom: spacing.sm,
  },
});
