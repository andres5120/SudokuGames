import { Board } from '../constants/sudoku.constants';

export class SudokuValidator {
  /**
   * Valida si un tablero de Sudoku está correctamente construido
   * y tiene solución única
   */
  static validateBoard(board: Board): { isValid: boolean; hasUniqueSolution: boolean } {
    const solver = new SudokuSolver();
    const solutions = solver.findAllSolutions(board, 2); // Solo buscar máximo 2 soluciones
    
    return {
      isValid: solutions.length > 0,
      hasUniqueSolution: solutions.length === 1
    };
  }

  /**
   * Verifica si un número puede ir en una posición específica
   */
  static isValidPlacement(board: Board, row: number, col: number, num: number): boolean {
    // Verificar fila
    for (let c = 0; c < 9; c++) {
      if (c !== col && board[row][c] === num) return false;
    }

    // Verificar columna
    for (let r = 0; r < 9; r++) {
      if (r !== row && board[r][col] === num) return false;
    }

    // Verificar subcuadro 3x3
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if ((r !== row || c !== col) && board[r][c] === num) return false;
      }
    }

    return true;
  }
}

/**
 * Solver interno para validación
 */
class SudokuSolver {
  findAllSolutions(board: Board, maxSolutions: number): Board[] {
    const solutions: Board[] = [];
    const workingBoard = JSON.parse(JSON.stringify(board)) as Board;
    
    this.solve(workingBoard, solutions, maxSolutions);
    return solutions;
  }

  private solve(board: Board, solutions: Board[], maxSolutions: number): void {
    if (solutions.length >= maxSolutions) return;

    const emptyCell = this.findEmptyCell(board);
    if (!emptyCell) {
      // Tablero completo, es una solución
      solutions.push(JSON.parse(JSON.stringify(board)));
      return;
    }

    const [row, col] = emptyCell;
    
    for (let num = 1; num <= 9; num++) {
      if (SudokuValidator.isValidPlacement(board, row, col, num)) {
        board[row][col] = num;
        this.solve(board, solutions, maxSolutions);
        board[row][col] = 0; // backtrack
      }
    }
  }

  private findEmptyCell(board: Board): [number, number] | null {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0) return [r, c];
      }
    }
    return null;
  }
}