import { useState, useEffect } from 'react';
import { SudokuProgressionService } from '../services/sudoku-progression.service';
import { Difficulty } from '../constants/sudoku.constants';

export const useProgression = () => {
  const [unlockedDifficulties, setUnlockedDifficulties] = useState<string[]>(['facil']);
  const [highScores, setHighScores] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos al inicializar
  useEffect(() => {
    const loadData = async () => {
      try {
        const progress = await SudokuProgressionService.getProgress();
        setUnlockedDifficulties(progress.unlockedLevels);
        setHighScores(progress.highScores);
      } catch (error) {
        console.error('Error loading progression data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const isDifficultyUnlocked = (difficulty: Difficulty): boolean => {
    return unlockedDifficulties.includes(difficulty);
  };

  const updateScore = async (difficulty: Difficulty, score: number) => {
    const updatedProgress = await SudokuProgressionService.updateScore(difficulty, score);
    
    // Actualizar estado local
    setUnlockedDifficulties(updatedProgress.unlockedLevels);
    setHighScores(updatedProgress.highScores);
  };

  const getRequiredScore = (difficulty: Difficulty): number => {
    return SudokuProgressionService.getRequiredScore(difficulty);
  };

  const getUnlockMessage = (difficulty: Difficulty): string => {
    const required = getRequiredScore(difficulty);
    const prevDifficultyMap = {
      medio: 'fácil',
      dificil: 'medio',
      experto: 'difícil',
    };
    
    const prevDifficulty = prevDifficultyMap[difficulty as keyof typeof prevDifficultyMap];
    return `Necesitas ${required} puntos en ${prevDifficulty} para desbloquear este modo y haber completado el nivel`;
  };

  const resetProgressForTesting = async () => {
    await SudokuProgressionService.resetProgress();
    const progress = await SudokuProgressionService.getProgress();
    setUnlockedDifficulties(progress.unlockedLevels);
    setHighScores(progress.highScores);
  };
  

  return {
    unlockedDifficulties,
    highScores,
    isLoading,
    isDifficultyUnlocked,
    updateScore,
    getRequiredScore,
    getUnlockMessage,
    resetProgressForTesting
  };
};