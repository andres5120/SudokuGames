import { useEffect, useRef, useState, useCallback } from 'react';
import { TimerConfig, TimerEvents, TimerState } from '../interfaces/timer.interface';
import { TimerService } from '../services/Timer.service';


/**
 * Hook personalizado para manejar el timer
 * Principio: Single Responsibility - Solo maneja la lógica del timer en React
 * Patrón: Facade - Simplifica la interfaz del TimerService para React
 */
export const useTimer = (config: TimerConfig & TimerEvents) => {
  const {
    initialTime,
    interval = 1000,
    autoStart = true,
    onComplete,
    onTick,
    onPause,
    onResume,
    onReset
  } = config;

  // Estado del timer
  const [state, setState] = useState<TimerState>({
    timeLeft: initialTime,
    initialTime,
    status: 'idle',
    progress: 0
  });

  // Referencia al servicio
  const timerServiceRef = useRef<TimerService | null>(null);
  const initializedRef = useRef(false);

  // Callback para actualizar el estado
  const updateState = useCallback(() => {
    if (timerServiceRef.current) {
      setState(timerServiceRef.current.getState());
    }
  }, []);

  // Inicializar el servicio del timer
  useEffect(() => {
    if (!initializedRef.current) {
      const events: TimerEvents = {
        onComplete: () => {
          updateState();
          onComplete?.();
        },
        onTick: (timeLeft, progress) => {
          updateState();
          onTick?.(timeLeft, progress);
        },
        onPause: () => {
          updateState();
          onPause?.();
        },
        onResume: () => {
          updateState();
          onResume?.();
        },
        onReset: () => {
          updateState();
          onReset?.();
        }
      };

      timerServiceRef.current = new TimerService(initialTime, events, interval);
      updateState();

      if (autoStart) {
        timerServiceRef.current.start();
      }

      initializedRef.current = true;
    }
  }, [initialTime, interval, autoStart, onComplete, onTick, onPause, onResume, onReset, updateState]);

  // Actualizar tiempo inicial si cambia
  useEffect(() => {
    if (timerServiceRef.current && initializedRef.current) {
      timerServiceRef.current.updateInitialTime(initialTime);
      updateState();
      
      if (autoStart) {
        timerServiceRef.current.start();
      }
    }
  }, [initialTime, autoStart, updateState]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (timerServiceRef.current) {
        timerServiceRef.current.destroy();
      }
    };
  }, []);

  // Funciones de control
  const start = useCallback(() => {
    timerServiceRef.current?.start();
    updateState();
  }, [updateState]);

  const pause = useCallback(() => {
    timerServiceRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    timerServiceRef.current?.resume();
  }, []);

  const reset = useCallback(() => {
    timerServiceRef.current?.reset();
  }, []);

  const stop = useCallback(() => {
    timerServiceRef.current?.stop();
    updateState();
  }, [updateState]);

  const toggle = useCallback(() => {
    if (!timerServiceRef.current) return;
    
    if (timerServiceRef.current.isRunning()) {
      pause();
    } else if (timerServiceRef.current.isPaused()) {
      resume();
    } else {
      start();
    }
  }, [start, pause, resume]);

  return {
    // Estado
    timeLeft: state.timeLeft,
    initialTime: state.initialTime,
    status: state.status,
    progress: state.progress,
    
    // Estados calculados
    isRunning: state.status === 'running',
    isPaused: state.status === 'paused',
    isCompleted: state.status === 'completed',
    isIdle: state.status === 'idle',
    
    // Controles
    start,
    pause,
    resume,
    reset,
    stop,
    toggle,
    
    // Estado completo para casos avanzados
    state
  };
}