import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTimer } from '../hooks/useTimer';
import { TimeFormatter } from '../utils/timeFormatter';
import { TimerProps } from '../interfaces/timer.interface';
import { TimerPropsRN } from '../interfaces/props-timer.interface';

/**
 * Componente Timer principal para React Native
 * Principio: Single Responsibility - Solo se encarga de renderizar el timer
 * Principio: Open/Closed - Extensible a través de props y styling
 * Principio: Dependency Inversion - Depende de abstracciones (hooks y utils)
 */


export const Timer: React.FC<TimerPropsRN> = ({
  initialTime,
  interval = 1000,
  autoStart = true,
  format = 'mm:ss',
  containerStyle = {},
  showControls = false,
  showProgress = false,
  textStyle = {},
  buttonStyle = {},
  buttonTextStyle = {},
  completionMessage = '¡Tiempo terminado!',
  onComplete,
  onTick,
  onPause,
  onResume,
  onReset
}) => {
  // Hook personalizado que maneja toda la lógica
  const timer = useTimer({
    initialTime,
    interval,
    autoStart,
    onComplete: () => {
      onComplete?.();
    },
    onTick,
    onPause,
    onResume,
    onReset
  });

  // Determinar color del texto según el tiempo restante
  const getTextColor = (): string => {
    if (timer.isCompleted) return '#666666';
    if (timer.timeLeft <= 10) return '#ff4444';
    if (timer.timeLeft <= 30) return '#ff8800';
    return '#333333';
  };

  const dynamicTextStyle: TextStyle = {
    color: getTextColor(),
    ...textStyle
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Mensaje de completado o tiempo restante */}
      {timer.isCompleted ? (
        <Text style={[styles.completedText, dynamicTextStyle]}>
          {completionMessage}
        </Text>
      ) : (
        <Text style={[styles.timerText, dynamicTextStyle]}>
          {TimeFormatter.format(timer.timeLeft, format)}
        </Text>
      )}

      {/* Barra de progreso */}
      {showProgress && (
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${timer.progress}%`,
                backgroundColor: timer.timeLeft <= 10 ? '#ff4444' : '#4CAF50'
              }
            ]} 
          />
        </View>
      )}

      {/* Controles */}
     {/*  {showControls && !timer.isCompleted && (
        <View style={styles.controlsContainer}>
          {timer.isRunning ? (
            <TouchableOpacity 
              onPress={timer.pause} 
              style={[styles.button, buttonStyle]}
              activeOpacity={0.7}
            >
              <Text style={[styles.buttonText, buttonTextStyle]}>
                ⏸️ Pausar
              </Text>
            </TouchableOpacity>
          ) : timer.isPaused ? (
            <TouchableOpacity 
              onPress={timer.resume} 
              style={[styles.button, buttonStyle]}
              activeOpacity={0.7}
            >
              <Text style={[styles.buttonText, buttonTextStyle]}>
                ▶️ Reanudar
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              onPress={timer.start} 
              style={[styles.button, buttonStyle]}
              activeOpacity={0.7}
            >
              <Text style={[styles.buttonText, buttonTextStyle]}>
                ▶️ Iniciar
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            onPress={timer.reset} 
            style={[styles.button, styles.resetButton, buttonStyle]}
            activeOpacity={0.7}
          >
            <Text style={[styles.buttonText, buttonTextStyle]}>
              🔄 Reset
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Info de estado para desarrollo */}
    {/*   {__DEV__ && (
        <Text style={styles.debugText}>
          Estado: {timer.status} | Progreso: {timer.progress}%
        </Text>
      )} */}
    </View>
  );
};

// Estilos por defecto
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 10,
  },
  timerText: {
    fontFamily: 'monospace',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  completedText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  progressBar: {
    width: '100%',
    height:1,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginVertical: 0,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
/*   button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 8,
    backgroundColor: '#007bff',
    borderRadius: 8,
    minWidth: 100,
  }, */
 /*  resetButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  }, */
  debugText: {
    fontSize: 12,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
});

// Componente de ejemplo de uso para React Native
export const TimerExample: React.FC = () => {
  const handleTimeEnd = () => {
    // En React Native podrías usar Alert.alert en lugar de alert
  };

  const handleTick = (timeLeft: number, progress: number) => {
    if (timeLeft === 10) {
      console.log('¡Quedan 10 segundos!');
    }
  };

  return (
    <View style={{ padding: 32 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
        Ejemplo de Timer
      </Text>
      
      <View style={{ marginBottom: 32 }}>
        <Text style={{ fontSize: 16, marginBottom: 12 }}>
          Timer de 10 minutos con controles
        </Text>
        <Timer
          initialTime={TimeFormatter.minutesToSeconds(10)}
          onComplete={handleTimeEnd}
          onTick={handleTick}
          showControls={true}
          showProgress={true}
          format="mm:ss"
        />
      </View>

      <View style={{ marginBottom: 32 }}>
        <Text style={{ fontSize: 16, marginBottom: 12 }}>
          Timer simple de 30 segundos
        </Text>
        <Timer
          initialTime={30}
          onComplete={handleTimeEnd}
          format="ss"
          completionMessage="¡30 segundos completados!"
        />
      </View>
    </View>
  );
};