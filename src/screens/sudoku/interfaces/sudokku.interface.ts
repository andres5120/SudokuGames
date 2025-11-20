export type Board = number[][]; // 9x9

export interface SudokuState {
  board: Board;
  initialBoard: Board;
  solution: Board;
  score: number;
}