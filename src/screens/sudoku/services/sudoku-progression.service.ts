import { ProgressionService } from '../../../services/storage/progression.service';
import { Difficulty } from '../constants/sudoku.constants';
import { DIFFICULTY_REQUIREMENTS } from '../constants/dificult-requirement.constants';

const GAME_TYPE = 'sudoku';

export class SudokuProgressionService {
  static async getProgress() {
    const progress = await ProgressionService.getGameProgress(GAME_TYPE);

    // Asegurar que fácil esté siempre desbloqueado
    if (!progress.unlockedLevels.includes('facil')) {
      progress.unlockedLevels = ['facil', ...progress.unlockedLevels];
    }
    return progress;
  }

  static async updateScore(difficulty: Difficulty, score: number) {
    const progress = await this.getProgress();
    const currentHigh = progress.highScores[difficulty] || 0;
    let shouldSave = false;

    if (score > currentHigh) {
      progress.highScores[difficulty] = score;
      shouldSave = true;
      console.log(`📈 Nuevo récord en ${difficulty}: ${score} puntos`);
    }
    // Verificar desbloqueos
    const nextLevel = this.getNextLevel(difficulty);

    if (
      nextLevel &&
      score >= DIFFICULTY_REQUIREMENTS[nextLevel] &&
      !progress.unlockedLevels.includes(nextLevel)
    ) {
      progress.unlockedLevels.push(nextLevel);
      shouldSave = true;
      console.log(`🔓 Nivel ${nextLevel} desbloqueado!`);
    }

    // Solo guardar si hubo cambios
    if (shouldSave) {
      await ProgressionService.saveGameProgress(GAME_TYPE, progress);
    } else {
      console.log(`ℹ️ Sin cambios en ${difficulty}, no se guarda`);
    }

    return progress;
  }

  private static getNextLevel(
    difficulty: string,
  ): keyof typeof DIFFICULTY_REQUIREMENTS | null {
    switch (difficulty) {
      case 'facil':
        return 'medio';
      case 'medio':
        return 'dificil';
      case 'dificil':
        return 'experto';
      case 'experto':
        return null; // No hay siguiente nivel
      default:
        return null;
    }
  }

  static getRequiredScore(difficulty: Difficulty): number {
    return DIFFICULTY_REQUIREMENTS[difficulty] || 0;
  }

  static async resetProgress(): Promise<void> {
    const emptyProgress = {
      unlockedLevels: ['facil'],
      highScores: {}
    };
    await ProgressionService.saveGameProgress(GAME_TYPE, emptyProgress);
  }
}
