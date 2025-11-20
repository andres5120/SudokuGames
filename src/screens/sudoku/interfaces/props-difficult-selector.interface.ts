import { Difficulty } from '../constants/sudoku.constants';

export interface PropsDifficultSelector {
  selected: Difficulty;
  onSelect: (d: Difficulty) => void;
  unlockedDifficulties: string[];
  getUnlockMessage: (difficulty: Difficulty) => string;
}
