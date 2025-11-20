export interface PropsCell {
  value: number;
  isInitial: boolean;
  isValidated?: boolean;
  isSelected: boolean;
  size: number; // 👈 nuevo
  onPress: () => void;
  disabled?: boolean;
}