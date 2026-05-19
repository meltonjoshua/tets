import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../theme';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function Checkbox({ checked, onToggle, disabled }: CheckboxProps) {
  return (
    <TouchableOpacity
      style={[
        styles.box,
        checked && styles.checked,
        disabled && styles.disabled,
      ]}
      onPress={onToggle}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {checked && (
        <TextInput style={styles.checkmark} editable={false} value={'\u2713'} />
      )}
    </TouchableOpacity>
  );
}

import { TextInput } from 'react-native';

const styles = StyleSheet.create({
  box: {
    width: 22,
    height: 22,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.light,
  },
  checked: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  disabled: {
    opacity: 0.5,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    padding: 0,
    margin: 0,
  },
});