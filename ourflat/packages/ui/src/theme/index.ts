export const Colors = {
  primary: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316',
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
  },
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  success: {
    light: '#D1FAE5',
    main: '#10B981',
    dark: '#065F46',
  },
  warning: {
    light: '#FEF3C7',
    main: '#F59E0B',
    dark: '#92400E',
  },
  danger: {
    light: '#FEE2E2',
    main: '#EF4444',
    dark: '#991B1B',
  },
  info: {
    light: '#DBEAFE',
    main: '#3B82F6',
    dark: '#1E40AF',
  },
  background: {
    light: '#FFFFFF',
    dark: '#111827',
  },
  surface: {
    light: '#F9FAFB',
    dark: '#1F2937',
  },
  card: {
    light: '#FFFFFF',
    dark: '#1F2937',
  },
  text: {
    primary: {
      light: '#111827',
      dark: '#F9FAFB',
    },
    secondary: {
      light: '#6B7280',
      dark: '#9CA3AF',
    },
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const Typography = {
  fontSizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 30,
    title: 34,
  },
  fontWeights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
} as const;

export const Animation = {
  timing: {
    fast: 150,
    normal: 250,
    slow: 400,
  },
} as const;

export const Theme = {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
  Animation,
} as const;

export type ThemeType = typeof Theme;