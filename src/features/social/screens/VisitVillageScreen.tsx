import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, StyleSheet } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { Title, Body } from '@/components/ui/Typography';
import { ResourceBar } from '@/components/ui/ResourceBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { useQuery } from '@tanstack/react-query';
import { fetchPlayer } from '@/features/player/api/playerApi';
import { images } from '@/assets';
import { spacing } from '@/theme/theme';
import type { RootStackParamList } from '@/app/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'VisitVillage'>;

export function VisitVillageScreen({ route, navigation }: Props) {
  const visit = useQuery({
    queryKey: ['visit', route.params.uid],
    queryFn: () => fetchPlayer(route.params.uid),
  });

  if (visit.isPending) {
    return (
      <Screen>
        <Body>Looking across the fjord…</Body>
      </Screen>
    );
  }

  if (visit.isError || !visit.data) {
    return (
      <Screen>
        <EmptyState
          title="No hall in sight"
          message="This Viking could not be found, or the visit failed."
        />
        <Button label="Back" onPress={() => navigation.goBack()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Image source={images.buildingGreatHall} style={styles.art} resizeMode="contain" />
      <Title>{visit.data.vikingName}'s village</Title>
      <Body muted>
        Lv {visit.data.level} · Great Hall {visit.data.buildings.greatHall.level}
      </Body>
      <ResourceBar currencies={visit.data.currencies} />
      <Body muted>Visit is read-only. Raids happen from Battle.</Body>
      <Button label="Back" onPress={() => navigation.goBack()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  art: {
    width: '100%',
    height: 120,
    marginBottom: spacing.md,
  },
});
