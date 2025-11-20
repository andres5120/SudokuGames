import { TextStyle, ViewStyle } from "react-native";

export interface CustomButtonProps {
  text: string;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}
