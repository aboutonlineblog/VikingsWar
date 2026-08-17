import type { ReactElement } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import type { ItemDef } from '@shared/types';
import { itemArt } from '@/assets';
import { Card } from '@/components/ui/Card';
import { Body, Title } from '@/components/ui/Typography';
import { rarityStyle } from '@/theme/rarity';
import { colors, radius, spacing } from '@/theme/theme';
import { formatItemType, formatRarity } from '../utils/equippedItem';

interface EquipmentDetailModalProps {
  item: ItemDef | null;
  onClose: () => void;
}

export function EquipmentDetailModal({ item, onClose }: EquipmentDetailModalProps): ReactElement | null {
  if (!item) {
    return null;
  }

  const tone = rarityStyle(item.rarity);
  const boundLabel = item.bound ? 'Bound' : 'Tradable';

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.scrim}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss equipment"
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />
        <Card style={styles.panel}>
          <View testID="equipment-detail-modal">
            <View style={styles.header}>
              <Title style={styles.title}>{item.name}</Title>
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

            <View
              testID={`equipment-detail-frame-${item.rarity}`}
              style={[styles.artFrame, { borderColor: tone.border, backgroundColor: tone.fill }]}
            >
              {item.rarity === 'celestial' ? (
                <>
                  <View style={[styles.celestialHighlight, { backgroundColor: tone.highlight }]} />
                  <View style={[styles.celestialShade, { backgroundColor: tone.shade }]} />
                </>
              ) : null}
              <Image
                source={itemArt(item.id, item.slot)}
                accessibilityLabel={`${item.name} image`}
                resizeMode="contain"
                style={styles.art}
              />
            </View>

            <Body muted>
              {formatItemType(item)} · {formatRarity(item.rarity)}
            </Body>
            {item.description ? <Body>{item.description}</Body> : null}
            <Body>
              ATK {item.attack} · DEF {item.defense} · HP {item.health} · SPD {item.speed}
            </Body>
            <Body muted testID="equipment-bound-label">
              {boundLabel}
            </Body>
          </View>
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
  artFrame: {
    width: 96,
    height: 96,
    alignSelf: 'center',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  art: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  celestialHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    opacity: 0.7,
  },
  celestialShade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '35%',
    opacity: 0.45,
  },
});
