import React, { useState } from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  containerStyle,
  style,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          error && styles.inputWrapperError,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[styles.input, leftIcon && styles.inputWithLeftIcon, style]}
          placeholderTextColor={Colors.gray[400]}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {hint && !error && <Text style={styles.hintText}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.text.primary.light,
    marginBottom: Spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background.light,
  },
  inputWrapperFocused: {
    borderColor: Colors.primary[500],
    borderWidth: 2,
  },
  inputWrapperError: {
    borderColor: Colors.danger.main,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    fontSize: Typography.fontSizes.md,
    color: Colors.text.primary.light,
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  leftIcon: {
    paddingLeft: Spacing.md,
  },
  rightIcon: {
    paddingRight: Spacing.md,
  },
  errorText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.danger.main,
    marginTop: Spacing.xs,
  },
  hintText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.text.secondary.light,
    marginTop: Spacing.xs,
  },
});