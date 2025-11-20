import { Board, Difficulty } from '../constants/sudoku.constants';
import { DIFFICULTY_POINTS } from '../constants/sudoku-points.constants';
import { PointsConfiguration, ProcessResult, BoardStats } from '../interfaces/sudoku-points.interface';
import { SudokuValidator } from './SudokuValidator';

/**
 * Servicio responsable de evaluar el estado del tablero de Sudoku
 * Principio: Single Responsibility - Solo se encarga de la evaluación
 */
export class SudokuEvaluator {
  private readonly pointsConfig: PointsConfiguration;

  constructor(difficulty: Difficulty) {
    this.pointsConfig = DIFFICULTY_POINTS[difficulty] || DIFFICULTY_POINTS.facil;
  }

  /**
   * Evalúa el tablero completo y retorna los resultados usando tus interfaces existentes
   */
  evaluateBoard(
    currentBoard: Board,
    solution: Board,
    initialBoard: Board,
    validatedCells: Set<string>
  ): ProcessResult & { newValidatedCells: Set<string>; isComplete: boolean } {
    const stats: BoardStats = {
      correctCount: 0,
      incorrectCount: 0,
      totalPointsChange: 0
    };

    const newValidatedCells = new Set(validatedCells);
    const updatedBoard = currentBoard.map(row => [...row]);

    // Evaluar cada celda
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        this.evaluateCell(
          row,
          col,
          currentBoard,
          solution,
          initialBoard,
          validatedCells,
          stats,
          newValidatedCells,
          updatedBoard
        );
      }
    }

    // Verificar si el tablero está completo
    const isComplete = this.isBoardComplete(updatedBoard);

    return {
      newBoard: updatedBoard,
      stats,
      newValidatedCells,
      isComplete
    };
  }

  /**
   * Evalúa una celda individual
   */
  private evaluateCell(
    row: number,
    col: number,
    currentBoard: Board,
    solution: Board,
    initialBoard: Board,
    validatedCells: Set<string>,
    stats: BoardStats,
    newValidatedCells: Set<string>,
    updatedBoard: number[][]
  ): void {
    const currentValue = currentBoard[row][col];
    const correctValue = solution[row][col];
    const isInitialCell = initialBoard[row][col] !== 0;
    const cellKey = this.getCellKey(row, col);

    // Solo evaluar celdas del usuario que NO han sido validadas antes
    if (currentValue !== 0 && !isInitialCell && !validatedCells.has(cellKey)) {
      if (currentValue === correctValue) {
        this.handleCorrectCell(cellKey, stats, newValidatedCells);
      } else {
        this.handleIncorrectCell(row, col, stats, updatedBoard);
      }
    }

    // Si una celda validada fue borrada por el usuario, removerla de validadas
    if (currentValue === 0 && validatedCells.has(cellKey)) {
      newValidatedCells.delete(cellKey);
    }
  }

  /**
   * Maneja una celda correcta
   */
  private handleCorrectCell(cellKey: string, stats: BoardStats, newValidatedCells: Set<string>): void {
    stats.correctCount++;
    stats.totalPointsChange += this.pointsConfig.correct;
    newValidatedCells.add(cellKey);
  }

  /**
   * Maneja una celda incorrecta
   */
  private handleIncorrectCell(row: number, col: number, stats: BoardStats, updatedBoard: number[][]): void {
    stats.incorrectCount++;
    stats.totalPointsChange += this.pointsConfig.incorrect;
    updatedBoard[row][col] = 0; // Borrar número incorrecto
  }

  /**
   * Calcula el nuevo score considerando las restricciones
   */
  calculateNewScore(currentScore: number, pointsChange: number): number {
    const calculatedScore = currentScore + pointsChange;
    return !this.pointsConfig.allowNegative
      ? Math.max(0, calculatedScore)
      : calculatedScore;
  }

  /**
   * Calcula el score final con bonus
   */
  calculateFinalScore(currentScore: number, bonusPoints: number = 50): number {
    return this.pointsConfig.allowNegative
      ? currentScore + bonusPoints
      : Math.max(0, currentScore + bonusPoints);
  }

  /**
   * Verifica si el tablero está completo
   */
  private isBoardComplete(board: number[][]): boolean {
    return board.every(row => row.every(cell => cell !== 0));
  }

  /**
   * Genera la clave única para una celda
   */
  private getCellKey(row: number, col: number): string {
    return `${row}-${col}`;
  }

  /**
   * Getter para la configuración de puntos
   */
  get pointsConfiguration(): PointsConfiguration {
    return this.pointsConfig;
  }

  private validateCellPlacement(
    board: Board,
    solution: Board,
    row: number,
    col: number
  ): boolean {
    const placedValue = board[row][col];
    const correctValue = solution[row][col];

    // Verificar que sea el valor correcto
    if (placedValue !== correctValue) return false;

    // Verificar que no viole las reglas de Sudoku
    return SudokuValidator.isValidPlacement(board, row, col, placedValue);
  }
}