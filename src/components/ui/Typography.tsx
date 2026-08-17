import { StyleSheet, Text, type TextProps } from 'react-native';
import { colors } from '@/theme/theme';

interface TitleProps extends TextProps {
  muted?: boolean;
}

export function Title({ muted, style, ...rest }: TitleProps) {
  return <Text style={[styles.title, muted && styles.muted, style]} {...rest} />;
}

export function Body({ muted, style, ...rest }: TitleProps) {
  return <Text style={[styles.body, muted && styles.muted, style]} {...rest} />;
}

const styles = StyleSheet.create({
  title: {
    color: colors.gold,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 0.6,
  },
  body: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
  muted: {
    color: colors.textMuted,
  },
});
