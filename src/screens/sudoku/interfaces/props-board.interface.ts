import { Board } from "./sudokku.interface";

export interface PropsBoard {
  board: number[][];
  initialBoard?: number[][];
  selectedCell?: CellPos;
  onCellPress: (r: number, c: number) => void;
  disabled?: boolean;
  validatedCells: Set<string>;
}

type CellPos = { row: number; col: number } | null;