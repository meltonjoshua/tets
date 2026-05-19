import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '../theme';

interface ListItemProps {
  title: string;
  subtitle?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
}

export function ListItem({ title, subtitle, left, right, onPress, showChevron }: ListItemProps) {
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {left && <View style={styles.left}>{left}</View>}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        )}
      </View>
      {right && <View style={styles.right}>{right}</View>}
      {showChevron && !right && (
        <Text style={styles.chevron}>{'\u203A'}</Text>
      )}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.background.light,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.gray[200],
  },
  left: {
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.text.primary.light,
  },
  subtitle: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.text.secondary.light,
    marginTop: Spacing.xs / 2,
  },
  right: {
    marginLeft: Spacing.md,
  },
  chevron: {
    fontSize: 20,
    color: Colors.gray[400],
    marginLeft: Spacing.sm,
  },
});