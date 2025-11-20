import { Difficulty } from "../constants/sudoku.constants";
import { SudokuGenerator } from "../services/SudokuGenerator.service";

/**
 * Función de generación principal - wrapper simple del servicio
 * Mantiene la misma interfaz que tenías antes
 */
export const generate = (difficulty: Difficulty) => {
  return SudokuGenerator.generate(difficulty);
};