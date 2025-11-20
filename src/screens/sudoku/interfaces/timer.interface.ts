import { TimerStatus } from "../types/timer.types";

/**
 * Configuración del timer
 */
export interface TimerConfig {
  /** Tiempo inicial en segundos */
  initialTime: number;
  /** Intervalo de actualización en milisegundos (default: 1000) */
  interval?: number;
  /** Auto-iniciar el timer (default: true) */
  autoStart?: boolean;
  /** Formatear el tiempo mostrado (default: 'mm:ss') */
  format?: 'ss' | 'mm:ss' | 'hh:mm:ss';
}


/**
 * Estado interno del timer
 */
export interface TimerState {
  /** Tiempo restante en segundos */
  timeLeft: number;
  /** Tiempo inicial en segundos */
  initialTime: number;
  /** Estado actual del timer */
  status: TimerStatus;
  /** Progreso del timer (0-100) */
  progress: number;
}


/**
 * Eventos del timer
 */
export interface TimerEvents {
  /** Se dispara cuando el timer llega a 0 */
  onComplete?: () => void;
  /** Se dispara cada segundo (opcional) */
  onTick?: (timeLeft: number, progress: number) => void;
  /** Se dispara cuando el timer se pausa */
  onPause?: () => void;
  /** Se dispara cuando el timer se reanuda */
  onResume?: () => void;
  /** Se dispara cuando el timer se resetea */
  onReset?: () => void;
}

/**
 * Props del componente Timer
 */
export interface TimerProps extends TimerConfig, TimerEvents {
  /** Clases CSS adicionales */
  className?: string;
  /** Mostrar controles de pausa/resume (default: false) */
  showControls?: boolean;
  /** Mostrar progress bar (default: false) */
  showProgress?: boolean;
  /** Estilo del texto */
  textStyle?: React.CSSProperties;
  /** Mensaje personalizado cuando el timer llegue a 0 */
  completionMessage?: string;
}