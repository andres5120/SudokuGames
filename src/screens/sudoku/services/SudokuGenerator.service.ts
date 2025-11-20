import { DIFFICULTY_CONFIG } from '../constants/sudoku-empty-cell';
import { Board, Difficulty } from '../constants/sudoku.constants';

export class SudokuGenerator {
  private static readonly BASE_COMPLETE_SUDOKU: Board = [
    [5,3,4,6,7,8,9,1,2],
    [6,7,2,1,9,5,3,4,8],
    [1,9,8,3,4,2,5,6,7],
    [8,5,9,7,6,1,4,2,3],
    [4,2,6,8,5,3,7,9,1],
    [7,1,3,9,2,4,8,5,6],
    [9,6,1,5,3,7,2,8,4],
    [2,8,7,4,1,9,6,3,5],
    [3,4,5,2,8,6,1,7,9]
  ];

  /**
   * Genera un Sudoku completamente dinámico con cantidad exacta de casillas vacías
   */
  static generate(difficulty: Difficulty): { board: Board; solution: Board } {
    // 1. Crear sudoku completo aleatorio
    const completeSudoku = this.generateRandomCompleteSudoku();
    
    // 2. Crear copia para el puzzle (con casillas vacías)
    const puzzleBoard = this.cloneBoard(completeSudoku);
    
    // 3. Remover exactamente la cantidad necesaria de números
    const targetEmptyCells = DIFFICULTY_CONFIG[difficulty].emptyCells;
    this.removeNumbers(puzzleBoard, targetEmptyCells);
    
    return {
      board: puzzleBoard,
      solution: completeSudoku
    };
  }

  /**
   * Genera un Sudoku completo aleatorio aplicando transformaciones
   */
  private static generateRandomCompleteSudoku(): Board {
    let sudoku = this.cloneBoard(this.BASE_COMPLETE_SUDOKU);
    
    // Aplicar transformaciones aleatorias múltiples para máxima variación
    sudoku = this.shuffleNumbers(sudoku);
    sudoku = this.shuffleRowsInBlocks(sudoku);
    sudoku = this.shuffleColumnsInBlocks(sudoku);
    sudoku = this.shuffleRowBlocks(sudoku);
    sudoku = this.shuffleColumnBlocks(sudoku);
    
    // Aplicar rotaciones/reflexiones aleatorias
    if (Math.random() > 0.5) sudoku = this.transpose(sudoku);
    if (Math.random() > 0.5) sudoku = this.flipHorizontal(sudoku);
    if (Math.random() > 0.5) sudoku = this.flipVertical(sudoku);
    
    return sudoku;
  }

  /**
   * Remueve exactamente la cantidad especificada de números
   * Optimizado para ser rápido y garantizar cantidad exacta
   */
  private static removeNumbers(board: Board, targetEmpty: number): void {
    // Crear lista de todas las posiciones
    const allPositions: [number, number][] = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        allPositions.push([r, c]);
      }
    }
    
    // Mezclar las posiciones aleatoriamente
    this.shuffleArray(allPositions);
    
    // Remover exactamente targetEmpty números
    for (let i = 0; i < targetEmpty && i < allPositions.length; i++) {
      const [row, col] = allPositions[i];
      board[row][col] = 0;
    }
  }

  // === TRANSFORMACIONES ALEATORIAS ===

  /**
   * Intercambia los números aleatoriamente (1->3, 2->7, etc.)
   */
  private static shuffleNumbers(board: Board): Board {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.shuffleArray(numbers);
    
    const numberMap: Record<number, number> = {};
    for (let i = 0; i < 9; i++) {
      numberMap[i + 1] = numbers[i];
    }
    
    return board.map(row => 
      row.map(cell => cell === 0 ? 0 : numberMap[cell])
    );
  }

  /**
   * Intercambia filas dentro de cada bloque de 3x3
   */
  private static shuffleRowsInBlocks(board: Board): Board {
    const result = this.cloneBoard(board);
    
    for (let block = 0; block < 3; block++) {
      const rows = [0, 1, 2];
      this.shuffleArray(rows);
      
      const tempRows = [
        [...board[block * 3 + 0]],
        [...board[block * 3 + 1]],
        [...board[block * 3 + 2]]
      ];
      
      for (let i = 0; i < 3; i++) {
        result[block * 3 + i] = tempRows[rows[i]];
      }
    }
    
    return result;
  }

  /**
   * Intercambia columnas dentro de cada bloque de 3x3
   */
  private static shuffleColumnsInBlocks(board: Board): Board {
    const result = this.cloneBoard(board);
    
    for (let block = 0; block < 3; block++) {
      const cols = [0, 1, 2];
      this.shuffleArray(cols);
      
      for (let r = 0; r < 9; r++) {
        const tempCols = [
          board[r][block * 3 + 0],
          board[r][block * 3 + 1],
          board[r][block * 3 + 2]
        ];
        
        for (let i = 0; i < 3; i++) {
          result[r][block * 3 + i] = tempCols[cols[i]];
        }
      }
    }
    
    return result;
  }

  /**
   * Intercambia bloques completos de filas
   */
  private static shuffleRowBlocks(board: Board): Board {
    const blocks = [0, 1, 2];
    this.shuffleArray(blocks);
    
    const result: Board = Array(9).fill(null).map(() => Array(9).fill(0));
    
    for (let i = 0; i < 3; i++) {
      const sourceBlock = blocks[i];
      for (let r = 0; r < 3; r++) {
        result[i * 3 + r] = [...board[sourceBlock * 3 + r]];
      }
    }
    
    return result;
  }

  /**
   * Intercambia bloques completos de columnas
   */
  private static shuffleColumnBlocks(board: Board): Board {
    const blocks = [0, 1, 2];
    this.shuffleArray(blocks);
    
    const result = this.cloneBoard(board);
    
    for (let r = 0; r < 9; r++) {
      const tempRow = [...board[r]];
      for (let i = 0; i < 3; i++) {
        const sourceBlock = blocks[i];
        for (let c = 0; c < 3; c++) {
          result[r][i * 3 + c] = tempRow[sourceBlock * 3 + c];
        }
      }
    }
    
    return result;
  }

  // === TRANSFORMACIONES GEOMÉTRICAS ===

  /**
   * Transpone el tablero (filas ↔ columnas)
   */
  private static transpose(board: Board): Board {
    const result: Board = Array(9).fill(null).map(() => Array(9).fill(0));
    
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        result[c][r] = board[r][c];
      }
    }
    
    return result;
  }

  /**
   * Voltea horizontalmente
   */
  private static flipHorizontal(board: Board): Board {
    return board.map(row => [...row].reverse());
  }

  /**
   * Voltea verticalmente
   */
  private static flipVertical(board: Board): Board {
    return [...board].reverse();
  }

  // === UTILIDADES ===

  /**
   * Clona un tablero profundamente
   */
  private static cloneBoard(board: Board): Board {
    return board.map(row => [...row]);
  }

  /**
   * Mezcla un array in-place (Fisher-Yates)
   */
  private static shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}