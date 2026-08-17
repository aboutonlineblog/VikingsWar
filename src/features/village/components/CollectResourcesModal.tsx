import type { ReactElement } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Currencies } from '@shared/types';
import { pendingResourceEntries } from '@shared/resources';
import { resourceIcon } from '@/assets';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Body, Title } from '@/components/ui/Typography';
import { colors, radius, spacing } from '@/theme/theme';

interface CollectResourcesModalProps {
  visible: boolean;
  pending: Partial<Currencies>;
  collecting: boolean;
  onClose: () => void;
  onCollect: () => void;
}

export function CollectResourcesModal({
  visible,
  pending,
  collecting,
  onClose,
  onCollect,
}: CollectResourcesModalProps): ReactElement {
  const entries = pendingResourceEntries(pending);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.scrim}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss collect resources"
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />
        <Card style={styles.panel}>
          <View style={styles.header}>
            <Title style={styles.title}>Collect resources</Title>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              onPress={onClose}
              hitSlop={8}
              style={styles.close}
            >
              <Text style={styles.closeLabel}>X</Text>
            </Pressable>
          </View>
          <View style={styles.grid}>
            {entries.map((entry) => (
              <View
                key={entry.key}
                style={styles.cell}
                testID={`collect-resource-${entry.key}`}
                accessibilityLabel={`${entry.amount} ${entry.key}`}
              >
                <View style={styles.iconFrame}>
                  <Image
                    source={resourceIcon(entry.key)}
                    accessibilityLabel={`${entry.key} icon`}
                    resizeMode="cover"
                    style={styles.icon}
                  />
                </View>
                <Body style={styles.amount}>{entry.amount}</Body>
              </View>
            ))}
          </View>
          <Button
            label="Collect"
            onPress={onCollect}
            disabled={collecting}
            loading={collecting}
          />
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: 'rgba(18, 16, 14, 0.86)',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  panel: {
    marginBottom: 0,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    marginRight: spacing.md,
  },
  close: {
    minWidth: 32,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeLabel: {
    color: colors.gold,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 26,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
    marginBottom: spacing.md,
  },
  cell: {
    width: '33.33%',
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  iconFrame: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.sm,
    overflow: 'hidden',
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  icon: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  amount: {
    marginTop: spacing.xs,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
});
