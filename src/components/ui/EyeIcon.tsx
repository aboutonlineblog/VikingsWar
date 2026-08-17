import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme/theme';

interface EyeIconProps {
  slashed?: boolean;
}

export function EyeIcon({ slashed = false }: EyeIconProps) {
  return (
    <View style={styles.frame} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View style={styles.lid} />
      <View style={styles.pupil} />
      {slashed ? <View style={styles.slash} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: 22,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lid: {
    width: 20,
    height: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.gold,
  },
  pupil: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.gold,
  },
  slash: {
    position: 'absolute',
    width: 22,
    height: 1.5,
    backgroundColor: colors.gold,
    transform: [{ rotate: '-28deg' }],
  },
});
