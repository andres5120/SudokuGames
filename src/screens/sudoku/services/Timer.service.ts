import { TimerEvents, TimerState } from '../interfaces/timer.interface';

/**
 * Servicio que maneja la lógica del timer
 * Principio: Single Responsibility - Solo se encarga de la lógica del timer
 * Patrón: Observer - Notifica eventos a los suscriptores
 */
export class TimerService {
  private intervalId: NodeJS.Timeout | null = null;
  private state: TimerState;
  private readonly events: TimerEvents;
  private readonly interval: number;

  constructor(
    initialTime: number,
    events: TimerEvents = {},
    interval: number = 1000
  ) {
    this.state = {
      timeLeft: initialTime,
      initialTime,
      status: 'idle',
      progress: 0
    };
    this.events = events;
    this.interval = interval;
  }

  /**
   * Inicia el timer
   */
  start(): void {
    if (this.state.status === 'running') return;
    
    this.state.status = 'running';
    this.intervalId = setInterval(() => {
      this.tick();
    }, this.interval);
  }

  /**
   * Pausa el timer
   */
  pause(): void {
    if (this.state.status !== 'running') return;
    
    this.state.status = 'paused';
    this.clearInterval();
    this.events.onPause?.();
  }

  /**
   * Reanuda el timer
   */
  resume(): void {
    if (this.state.status !== 'paused') return;
    
    this.state.status = 'running';
    this.start();
    this.events.onResume?.();
  }

  /**
   * Resetea el timer
   */
  reset(): void {
    this.clearInterval();
    this.state = {
      ...this.state,
      timeLeft: this.state.initialTime,
      status: 'idle',
      progress: 0
    };
    this.events.onReset?.();
  }

  /**
   * Para el timer completamente
   */
  stop(): void {
    this.clearInterval();
    this.state.status = 'idle';
  }

  /**
   * Actualiza el tiempo inicial y resetea el timer
   */
  updateInitialTime(newTime: number): void {
    this.stop();
    this.state = {
      timeLeft: newTime,
      initialTime: newTime,
      status: 'idle',
      progress: 0
    };
  }

  /**
   * Obtiene el estado actual del timer
   */
  getState(): Readonly<TimerState> {
    return { ...this.state };
  }

  /**
   * Verifica si el timer está corriendo
   */
  isRunning(): boolean {
    return this.state.status === 'running';
  }

  /**
   * Verifica si el timer está pausado
   */
  isPaused(): boolean {
    return this.state.status === 'paused';
  }

  /**
   * Verifica si el timer está completado
   */
  isCompleted(): boolean {
    return this.state.status === 'completed';
  }

  /**
   * Lógica de tick del timer
   */
  private tick(): void {
    if (this.state.timeLeft <= 0) {
      this.complete();
      return;
    }

    this.state.timeLeft -= 1;
    this.state.progress = this.calculateProgress();
    
    // Notificar tick
    this.events.onTick?.(this.state.timeLeft, this.state.progress);
  }

  /**
   * Completa el timer
   */
  private complete(): void {
    this.clearInterval();
    this.state.status = 'completed';
    this.state.timeLeft = 0;
    this.state.progress = 100;
    
    // Notificar completado
    this.events.onComplete?.();
  }

  /**
   * Calcula el progreso como porcentaje
   */
  private calculateProgress(): number {
    const elapsed = this.state.initialTime - this.state.timeLeft;
    return Math.round((elapsed / this.state.initialTime) * 100);
  }

  /**
   * Limpia el interval
   */
  private clearInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Limpieza al destruir el servicio
   */
  destroy(): void {
    this.clearInterval();
  }
}