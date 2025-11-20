import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSudokuGame } from './hooks/useSudokuGame';
import DifficultySelector from './component/DifficultySelector';

import NumberPad from './component/NumberPad';
import Board from './component/Board';
import AlertModal from './component/AlertModal';
import { Difficulty } from './constants/sudoku.constants';
import { useProgression } from './hooks/useProgressSudokuLevel';
import { Timer } from './component/Timer';
import { TimeFormatter } from './utils/timeFormatter';
import { SafeAreaView } from 'react-native-safe-area-context';


const SudokuGameScreen: React.FC = () => {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const handleSudokuCompleted = (difficulty: Difficulty, score: number) => {
    updateScore(difficulty, score);
    setIsDisabled(true);
  };
  // lógica central (hook)
  const {
    board,
    initialBoard,
    score,
    setScore,
    selectedNumber,
    setSelectedNumber,
    setCell,
    changeDifficulty,
    validatedCells,
    giveHint,         // da una pista (inmediata)
    mockAdsAndHint,   // simula anuncio + da pista
    confirmBoard,
    alert,
    setAlert,
  } = useSudokuGame('facil', handleSudokuCompleted);

  const {
    unlockedDifficulties,
    highScores,
    isLoading,
    isDifficultyUnlocked,
    updateScore,
    getUnlockMessage,
    resetProgressForTesting
  } = useProgression();

  // selección de celda (UI local)
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  // fin del tiempo entonces disabled 

  const [time, setTime] = useState<number>(15);
  const [resetCounter, setResetCounter] = useState(0);


  // Si pulsas una celda:
  const handleCellPress = (r: number, c: number) => {
    // bloquear celdas iniciales
    if (initialBoard && initialBoard[r] && initialBoard[r][c] !== 0) {
      setAlert({ title: 'Aviso', message: 'No puedes cambiar los números iniciales.' });
      return;
    }

    // Si ya hay un número seleccionado, escribimos en la celda
    if (selectedNumber !== null) {
      setCell(r, c, selectedNumber);
      setSelectedCell(null);
      setSelectedNumber(null); // limpiamos selección del number pad
      return;
    }

    // Sino solo marcamos la celda (highlight)
    setSelectedCell({ row: r, col: c });
  };

  // Si pulsas un número en el pad:
  const handleNumberPress = (num: number) => {
    // Si una celda está seleccionada, insertar ahí
    if (selectedCell) {
      setCell(selectedCell.row, selectedCell.col, num);
      setSelectedCell(null);
      setSelectedNumber(null);
      return;
    }
    // Si no hay celda seleccionada, marcamos número (para luego tocar la celda)
    setSelectedNumber(num);
  };

  // Cambiar dificultad: guardamos localmente visual, y avisamos al hook
  const [localDifficulty, setLocalDifficulty] = useState<Difficulty>('facil');
  const onSelectDifficulty = (d: Difficulty) => {
    if (isDifficultyUnlocked(d)) {
      changeValues(d);
    }
  };

  const restardGame = () => {
    changeValues(localDifficulty)
    setResetCounter(prev => prev + 1);
  }



  const changeValues = (Difficulty?: Difficulty) => {
    setLocalDifficulty(Difficulty ?? 'facil');
    changeDifficulty(Difficulty ?? 'facil');
    setIsDisabled(false);
    setSelectedCell(null);
    setSelectedNumber(null);
    if (Difficulty === 'dificil') {
      setResetCounter(prev => prev + 1);
      setTime(15);
    } else if (Difficulty === 'experto') {
      setResetCounter(prev => prev + 1);
      setTime(7);
    }
    setScore(0);
  }



  const endTime = () => {
    setIsDisabled(true);
  };


  if (isLoading) {
    return <View style={styles.containerLoading}><Text>Cargando...</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.score}>Puntos: {score}</Text>
      </View>

      {/* Selector de dificultad */}
      <DifficultySelector
        selected={localDifficulty}
        onSelect={onSelectDifficulty}
        unlockedDifficulties={unlockedDifficulties}
        getUnlockMessage={getUnlockMessage}
      />

      {
        localDifficulty === "dificil" || localDifficulty === "experto" ?
          <Timer
            key={`timer-${time}-${localDifficulty}-${resetCounter}`}
            initialTime={TimeFormatter.minutesToSeconds(time)} // 10 minutos
            onComplete={endTime}
            showControls={true}
            showProgress={true}
            format="mm:ss"
          /> : null

      }



      {/* Tablero */}
      <View style={styles.boardWrap}>
        <Board
          board={board}
          initialBoard={initialBoard}
          selectedCell={selectedCell}
          onCellPress={handleCellPress}
          disabled={isDisabled}
          validatedCells={validatedCells}
        />
      </View>

      {/* NumberPad */}
      <NumberPad selected={selectedNumber} onPressNumber={handleNumberPress} />

      {/* Botones */}
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.btn, styles.btnHelp]} onPress={mockAdsAndHint}>
          <Text style={styles.btnTextPrimary}>Ayuda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnConfirm]} onPress={isDisabled ? restardGame : confirmBoard}>
          <Text style={styles.btnTextConfirm}>{isDisabled ? 'Reiniciar' : 'Confirmar'}</Text>
        </TouchableOpacity>

      </View>

      {/* <TouchableOpacity
        style={{ position: 'absolute', top: 100, right: 20, backgroundColor: 'red', padding: 10 }}
        onPress={resetProgressForTesting}
      >
        <Text style={{ color: 'white' }}>RESET</Text>
      </TouchableOpacity> */}

      {/* Modal de alertas (usa el alert que expone el hook) */}
      <AlertModal
        visible={!!alert}
        title={alert?.title || ''}
        message={alert?.message || ''}
        onClose={() => setAlert(null)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8', padding: 16, alignItems: 'center' },
  header: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 32, fontWeight: '800', color: '#123472' },
  score: { fontSize: 16, color: '#334155' },
  boardWrap: { marginTop: 0, marginBottom: 12 },
  actions: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 12 },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 28, alignItems: 'center', marginHorizontal: 6 },
  btnHelp: { backgroundColor: '#e6eefc' },
  btnConfirm: { backgroundColor: '#1464f2' },
  btnTextPrimary: { color: '#123472', fontWeight: '700' },
  btnTextConfirm: { color: '#fff', fontWeight: '700' },
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default SudokuGameScreen;
