import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { Title, Body } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { StatBar } from '@/components/ui/StatBar';
import { useQuery } from '@tanstack/react-query';
import { catalogKeys } from '@/lib/query/keys';
import { fetchCollections } from '@/features/quests/api/catalogApi';
import { usePlayer } from '@/features/player';
import { colors } from '@/theme/theme';

export function CollectionsScreen() {
  const collections = useQuery({ queryKey: catalogKeys.doc('collections'), queryFn: fetchCollections });
  const player = usePlayer();
  const owned = new Set((player.data?.inventory ?? []).map((item) => item.itemId));

  return (
    <Screen>
      <Title>Collections</Title>
      {(collections.data ?? []).map((set) => {
        const have = set.itemIds.filter((id) => owned.has(id) || (player.data?.collections[set.id] ?? []).includes(id));
        const complete = have.length === set.itemIds.length;
        return (
          <Card key={set.id}>
            {complete ? <Badge label="COMPLETE" tone="success" /> : null}
            <Body>
              {set.name} · {have.length}/{set.itemIds.length}
            </Body>
            <StatBar label="Progress" current={have.length} max={set.itemIds.length} color={colors.gold} />
            <Body muted>
              Bonus {set.bonus.attackPercent ?? 0}% ATK · {set.bonus.defensePercent ?? 0}% DEF
            </Body>
          </Card>
        );
      })}
    </Screen>
  );
}
