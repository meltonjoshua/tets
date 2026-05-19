import React from 'react';
import { Image, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../theme';

interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  style?: ViewStyle;
}

const SIZE_MAP = {
  sm: 28,
  md: 40,
  lg: 56,
  xl: 80,
};

const FONT_SIZE_MAP = {
  sm: 12,
  md: 16,
  lg: 22,
  xl: 30,
};

export function Avatar({ uri, name = '', size = 'md', style }: AvatarProps) {
  const dimension = SIZE_MAP[size];
  const fontSize = FONT_SIZE_MAP[size];
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[
          styles.avatar,
          { width: dimension, height: dimension, borderRadius: dimension / 2 },
          style,
        ]}
      />
    );
  }

  return (
    <Image
      style={[
        styles.placeholder,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          backgroundColor: Colors.primary[100],
        },
        style,
      ]}
    >
      <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
    </Image>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: Colors.gray[200],
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: '600',
    color: Colors.primary[700],
  },
});