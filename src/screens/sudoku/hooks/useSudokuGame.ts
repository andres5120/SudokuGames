import { useEffect, useState, useCallback } from 'react';
import { generate } from '../utils/sudokuGenerator';
import { Board, Difficulty } from '../constants/sudoku.constants';
import { AlertMessage } from '../interfaces/sudoku-points.interface';
import { SudokuEvaluator } from '../services/SudokuEvaluator';
import { SudokuMessageGenerator } from '../services/SudokuMessageGenerator';

/**
 * Hook principal de Sudoku refactorizado siguiendo principios SOLID
 * - Dependency Inversion: Usa servicios inyectados
 * - Single Responsibility: Se enfoca solo en el estado del juego
 * - Open/Closed: Extensible a través de los servicios
 */
export const useSudokuGame = (initialDifficulty: Difficulty = 'facil', onSudokuCompleted?: (difficulty: Difficulty, score: number) => void) => {
  // === ESTADO DEL JUEGO ===
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const [board, setBoard] = useState<Board>([]);
  const [initialBoard, setInitialBoard] = useState<Board>([]);
  const [solution, setSolution] = useState<Board>([]);
  const [score, setScore] = useState<number>(0);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [alert, setAlert] = useState<AlertMessage | null>(null);
  const [gameId, setGameId] = useState(0);
  const [validatedCells, setValidatedCells] = useState<Set<string>>(new Set());

  // === SERVICIOS (Dependency Inversion Principle) ===
  const [evaluator, setEvaluator] = useState<SudokuEvaluator | null>(null);
  const [messageGenerator, setMessageGenerator] =
    useState<SudokuMessageGenerator | null>(null);

  // Inicializar servicios cuando cambie la dificultad
  useEffect(() => {
    const newEvaluator = new SudokuEvaluator(difficulty);
    const newMessageGenerator = new SudokuMessageGenerator(
      newEvaluator.pointsConfiguration,
    );

    setEvaluator(newEvaluator);
    setMessageGenerator(newMessageGenerator);
  }, [difficulty]);

  // === INICIALIZACIÓN DEL TABLERO ===
  useEffect(() => {
    const { board: newBoard, solution: newSolution } = generate(difficulty);
    setBoard(JSON.parse(JSON.stringify(newBoard)));
    setInitialBoard(JSON.parse(JSON.stringify(newBoard)));
    setSolution(newSolution);
    setSelectedNumber(null);
    setValidatedCells(new Set()); // Reset validated cells on new game
  }, [difficulty, gameId]);

  // === ACCIONES DEL JUEGO ===

  /**
   * Cambia la dificultad y reinicia el juego
   */
  const changeDifficulty = useCallback((newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    setGameId(id => id + 1);
    setScore(0); // Reset score on difficulty change
  }, []);

  /**
   * Establece un valor en una celda del tablero
   * Principio: Single Responsibility - Solo maneja la actualización de celdas
   */
  const setCell = useCallback(
    (row: number, col: number, value: number) => {
      // Verificar si es una celda inicial O una celda validada
      const cellKey = `${row}-${col}`;
      if (initialBoard[row][col] !== 0 || validatedCells.has(cellKey)) {
        return; // No hacer nada si es inicial o validada
      }

      setBoard(prevBoard => {
        const newBoard = JSON.parse(JSON.stringify(prevBoard));
        newBoard[row][col] = value;
        return newBoard;
      });
    },
    [initialBoard, validatedCells],
  );

  /**
   * Proporciona una pista al usuario
   */
  const giveHint = useCallback(() => {
    if (!messageGenerator) return;

    const emptyCells: { r: number; c: number }[] = [];

    board.forEach((row, r) =>
      row.forEach((cell, c) => {
        if (cell === 0) emptyCells.push({ r, c });
      }),
    );

    if (emptyCells.length === 0) {
      setAlert(messageGenerator.generateAlreadyCompleteMessage());
      return;
    }

    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const { r, c } = randomCell;

    setBoard(prevBoard => {
      const newBoard = JSON.parse(JSON.stringify(prevBoard));
      newBoard[r][c] = solution[r][c];
      return newBoard;
    });
  }, [board, solution, messageGenerator]);

  /**
   * Confirma el tablero actual y evalúa los resultados
   * Principio: Dependency Inversion - Delega la evaluación al servicio
   */
  const confirmBoard = useCallback((): void => {
    if (!evaluator || !messageGenerator) return;

    // Evaluar el tablero usando el servicio
    const results = evaluator.evaluateBoard(
      board,
      solution,
      initialBoard,
      validatedCells,
    );

    // Actualizar estados basados en los resultados
    setBoard(results.newBoard);
    setValidatedCells(results.newValidatedCells);

    // Calcular nuevo score
    const newScore = evaluator.calculateNewScore(
      score,
      results.stats.totalPointsChange,
    );
    setScore(newScore);

    // Manejar completamiento del juego
    if (results.isComplete) {
      const bonusPoints = 50;
      const finalScore = evaluator.calculateFinalScore(newScore, bonusPoints);
      onSudokuCompleted?.(difficulty, finalScore);
      const completionMessage = messageGenerator.generateEvaluationMessage(
        results.stats,
        results.isComplete,
        finalScore,
        bonusPoints,
      );

      setScore(finalScore);
      setSelectedNumber(null);
      setAlert(completionMessage);

      // Reset score después de mostrar el mensaje final
      setTimeout(() => setScore(0), 100);
    } else {
      // Generar mensaje de evaluación
      const evaluationMessage = messageGenerator.generateEvaluationMessage(
        results.stats,
        results.isComplete,
        newScore,
      );
      setAlert(evaluationMessage);
    }

    // Debug logging
    console.log('=== CONFIRMACIÓN DE TABLERO ===');
    console.log('Números nuevos correctos solution:', solution);
  }, [
    board,
    solution,
    initialBoard,
    validatedCells,
    score,
    evaluator,
    messageGenerator,
  ]);

  /**
   * Mock de publicidad y pista
   */
  const mockAdsAndHint = useCallback(async () => {
    if (!messageGenerator) return;

    setAlert(messageGenerator.generateAdMessage());

    setTimeout(() => {
      setAlert(null);
      giveHint();
    }, 1500);
  }, [giveHint, messageGenerator]);

  
  return {
    // Estado del juego
    board,
    initialBoard,
    solution,
    score,
    selectedNumber,
    alert,
    validatedCells,
    difficulty,

    // Acciones
    setScore,
    setSelectedNumber,
    setCell,
    changeDifficulty,
    giveHint,
    confirmBoard,
    mockAdsAndHint,
    setAlert,
  } as const;
};
