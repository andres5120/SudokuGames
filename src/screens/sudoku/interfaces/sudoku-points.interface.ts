export interface PointsConfiguration {
  correct: number;
  incorrect: number;
  allowNegative: boolean;
}

// Define la estructura completa para todas las dificultades
export interface DifficultyPoints {
  facil: PointsConfiguration;
  medio: PointsConfiguration;
  dificil: PointsConfiguration;
  experto: PointsConfiguration;
}

export interface EvaluationResult {
  type: 'correct' | 'incorrect' | 'skip';
  points: number;
  shouldRemove: boolean;
}

export interface BoardStats {
  correctCount: number;
  incorrectCount: number;
  totalPointsChange: number;
}

export interface ProcessResult {
  newBoard: number[][];
  stats: BoardStats;
}

export interface AlertMessage {
  title: string;
  message: string;
  finalScore?: number;
}