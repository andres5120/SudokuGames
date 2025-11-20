import { Board, Difficulty } from '../constants/sudoku.constants';
import { DIFFICULTY_CONFIG } from '../constants/sudoku-empty-cell';
import { SudokuValidator } from './SudokuValidator';

export class SudokuDifficultyAdjuster {
  private static readonly MAX_ATTEMPTS = 100;

  /**
   * Ajusta un tablero para que tenga exactamente la cantidad de casillas vacías
   * requerida por la dificultad, manteniendo solución única
   */
  static adjustBoardDifficulty(
    board: Board, 
    solution: Board, 
    difficulty: Difficulty
  ): { adjustedBoard: Board; adjustedSolution: Board } | null {
    
    const targetEmptyCells = DIFFICULTY_CONFIG[difficulty].emptyCells;
    const currentEmptyCells = this.countEmptyCells(board);
    
    let workingBoard = JSON.parse(JSON.stringify(board)) as Board;
    let workingSolution = JSON.parse(JSON.stringify(solution)) as Board;
    
    if (currentEmptyCells === targetEmptyCells) {
      return { adjustedBoard: workingBoard, adjustedSolution: workingSolution };
    }
    
    if (currentEmptyCells < targetEmptyCells) {
      // Necesitamos vaciar más celdas
      return this.removeCells(workingBoard, workingSolution, targetEmptyCells - currentEmptyCells);
    } else {
      // Necesitamos llenar algunas celdas
      return this.fillCells(workingBoard, workingSolution, currentEmptyCells - targetEmptyCells);
    }
  }

  private static countEmptyCells(board: Board): number {
    let count = 0;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0) count++;
      }
    }
    return count;
  }

  private static removeCells(
    board: Board, 
    solution: Board, 
    cellsToRemove: number
  ): { adjustedBoard: Board; adjustedSolution: Board } | null {
    
    const filledCells = this.getFilledCells(board);
    this.shuffleArray(filledCells);
    
    let removed = 0;
    let attempts = 0;
    
    for (const [r, c] of filledCells) {
      if (removed >= cellsToRemove) break;
      if (attempts >= this.MAX_ATTEMPTS) break;
      
      const originalValue = board[r][c];
      board[r][c] = 0;
      
      const validation = SudokuValidator.validateBoard(board);
      
      if (validation.isValid && validation.hasUniqueSolution) {
        removed++;
      } else {
        // Revertir cambio
        board[r][c] = originalValue;
      }
      
      attempts++;
    }
    
    return removed === cellsToRemove 
      ? { adjustedBoard: board, adjustedSolution: solution }
      : null;
  }

  private static fillCells(
    board: Board, 
    solution: Board, 
    cellsToFill: number
  ): { adjustedBoard: Board; adjustedSolution: Board } | null {
    
    const emptyCells = this.getEmptyCells(board);
    this.shuffleArray(emptyCells);
    
    let filled = 0;
    
    for (const [r, c] of emptyCells) {
      if (filled >= cellsToFill) break;
      
      board[r][c] = solution[r][c];
      filled++;
    }
    
    return { adjustedBoard: board, adjustedSolution: solution };
  }

  private static getFilledCells(board: Board): [number, number][] {
    const cells: [number, number][] = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] !== 0) cells.push([r, c]);
      }
    }
    return cells;
  }

  private static getEmptyCells(board: Board): [number, number][] {
    const cells: [number, number][] = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0) cells.push([r, c]);
      }
    }
    return cells;
  }

  private static shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}