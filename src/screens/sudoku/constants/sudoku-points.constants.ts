import { DifficultyPoints } from "../interfaces/sudoku-points.interface";

export const DIFFICULTY_POINTS: DifficultyPoints = {
  facil: { correct: 15, incorrect: 0, allowNegative: false },
  medio: { correct: 10, incorrect: -5, allowNegative: false },
  dificil: { correct: 6, incorrect: -5, allowNegative: true },
  experto: { correct: 3, incorrect: -5, allowNegative: true },
};