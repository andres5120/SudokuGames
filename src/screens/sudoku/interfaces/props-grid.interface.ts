export interface SudokuGridProps {
  grid: number[][];
  selectedCell: { row: number; col: number } | null;
  onCellPress: (row: number, col: number) => void;
}