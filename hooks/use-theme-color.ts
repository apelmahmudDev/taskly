import { Colors } from '@/constants/theme';

export function useThemeColor(
  color: string | undefined,
  colorName: keyof typeof Colors
) {
  return color ?? Colors[colorName];
}
