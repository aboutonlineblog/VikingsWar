import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { colors, radius, spacing } from '@/theme/theme';
import { EyeIcon } from './EyeIcon';

export function Field({ secureTextEntry, style, ...props }: TextInputProps) {
  const isPassword = Boolean(secureTextEntry);
  const [hidden, setHidden] = useState(true);

  if (!isPassword) {
    return (
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[styles.input, style]}
        autoCapitalize="none"
        {...props}
      />
    );
  }

  return (
    <View style={styles.passwordWrap}>
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[styles.passwordInput, style]}
        autoCapitalize="none"
        {...props}
        secureTextEntry={hidden}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
        onPress={() => setHidden((value) => !value)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={styles.toggle}
      >
        <EyeIcon slashed={hidden} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.bgElevated,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    color: colors.text,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  passwordWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgElevated,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    paddingRight: spacing.sm,
  },
  passwordInput: {
    flex: 1,
    color: colors.text,
    padding: spacing.md,
  },
  toggle: {
    paddingHorizontal: spacing.sm,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
