import type { PropsWithChildren, ReactNode } from 'react';
import { Image, ScrollView, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme/theme';

interface ScreenProps extends PropsWithChildren {
  scroll?: boolean;
  hud?: ReactNode;
  edges?: Edge[];
  backgroundSource?: ImageSourcePropType;
}

export function Screen({
  children,
  scroll = true,
  hud,
  edges = ['top', 'left', 'right'],
  backgroundSource,
}: ScreenProps) {
  const content = scroll ? (
    <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
  ) : (
    <View style={styles.body}>{children}</View>
  );

  return (
    <View style={styles.safe}>
      {backgroundSource ? (
        <>
          <Image source={backgroundSource} style={styles.background} resizeMode="cover" />
          <View pointerEvents="none" style={styles.scrim} />
        </>
      ) : null}
      <SafeAreaView style={backgroundSource ? styles.transparent : styles.safe} edges={edges}>
        {hud}
        {content}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  transparent: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  background: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(18,16,14,0.72)',
  },
  body: {
    flex: 1,
    padding: spacing.lg,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
});
