import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#FFFFFF' : Colors.primary[500]}
        />
      ) : (
        <>
          {leftIcon && <span style={styles.iconLeft}>{leftIcon}</span>}
          <Text style={[styles.text, styles[`${variant}Text`], styles[`${size}Text`]]}>
            {title}
          </Text>
          {rightIcon && <span style={styles.iconRight}>{rightIcon}</span>}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  primary: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  secondary: {
    backgroundColor: Colors.primary[50],
    borderColor: Colors.primary[50],
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: Colors.primary[500],
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  danger: {
    backgroundColor: Colors.danger.main,
    borderColor: Colors.danger.main,
  },
  sm: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm - 2,
  },
  md: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  lg: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md + 2,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: Typography.fontWeights.semibold,
    textAlign: 'center',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: Colors.primary[700],
  },
  outlineText: {
    color: Colors.primary[500],
  },
  ghostText: {
    color: Colors.primary[500],
  },
  dangerText: {
    color: '#FFFFFF',
  },
  smText: {
    fontSize: Typography.fontSizes.sm,
  },
  mdText: {
    fontSize: Typography.fontSizes.md,
  },
  lgText: {
    fontSize: Typography.fontSizes.lg,
  },
  iconLeft: {
    marginRight: Spacing.xs,
  },
  iconRight: {
    marginLeft: Spacing.xs,
  },
});