import { TextStyle, ViewStyle } from 'react-native';
import { TimerProps } from './timer.interface';

export interface TimerPropsRN
  extends Omit<TimerProps, 'className' | 'textStyle'> {
  /** Estilo del contenedor */
  containerStyle?: ViewStyle;
  /** Estilo del texto */
  textStyle?: TextStyle;
  /** Estilo de los botones */
  buttonStyle?: ViewStyle;
  /** Estilo del texto de los botones */
  buttonTextStyle?: TextStyle;
}
