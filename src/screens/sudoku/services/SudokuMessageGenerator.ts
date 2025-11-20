import { BoardStats, PointsConfiguration, AlertMessage } from '../interfaces/sudoku-points.interface';

/**
 * Servicio responsable de generar mensajes para el usuario
 * Principio: Single Responsibility - Solo se encarga de generar mensajes
 */
export class SudokuMessageGenerator {
  private readonly pointsConfig: PointsConfiguration;

  constructor(pointsConfig: PointsConfiguration) {
    this.pointsConfig = pointsConfig;
  }

  /**
   * Genera el mensaje apropiado basado en los resultados de la evaluación
   */
  generateEvaluationMessage(
    stats: BoardStats,
    isComplete: boolean,
    finalScore: number, 
    bonusPoints: number = 50
  ): AlertMessage {
    const { correctCount, incorrectCount } = stats;

    if (isComplete) {
      return this.generateCompletionMessage(finalScore, bonusPoints);
    }

    if (correctCount > 0 && incorrectCount > 0) {
      return this.generateMixedResultMessage(stats, finalScore);
    }

    if (correctCount > 0) {
      return this.generateCorrectOnlyMessage(stats, finalScore);
    }

    if (incorrectCount > 0) {
      return this.generateIncorrectOnlyMessage(stats, finalScore);
    }

    return this.generateNoChangesMessage();
  }

  /**
   * Genera mensaje de tablero completado
   */
  private generateCompletionMessage(finalScore: number, bonusPoints: number): AlertMessage {
    return {
      title: 'Sudoku Completado!',
      message: `¡Excelente trabajo! Obtuviste ${bonusPoints} puntos bonus. Puntuación final: ${finalScore}`,
      finalScore
    };
  }

  /**
   * Genera mensaje para resultados mixtos (correctos e incorrectos)
   */
  private generateMixedResultMessage(stats: BoardStats, finalScore: number): AlertMessage {
    const { correctCount, incorrectCount } = stats;
    const correctPoints = correctCount * this.pointsConfig.correct;
    const incorrectPoints = incorrectCount * this.pointsConfig.incorrect;

    return {
      title: 'Revisión Completada',
      message: `${correctCount} números nuevos correctos (+${correctPoints}), ${incorrectCount} incorrectos (${incorrectPoints}). Puntuación: ${finalScore}`
    };
  }

  /**
   * Genera mensaje solo para números correctos
   */
  private generateCorrectOnlyMessage(stats: BoardStats, finalScore: number): AlertMessage {
    const { correctCount } = stats;
    const correctPoints = correctCount * this.pointsConfig.correct;

    return {
      title: '¡Muy bien!',
      message: `${correctCount} números nuevos correctos. +${correctPoints} puntos. Puntuación: ${finalScore}`
    };
  }

  /**
   * Genera mensaje solo para números incorrectos
   */
  private generateIncorrectOnlyMessage(stats: BoardStats, finalScore: number): AlertMessage {
    const { incorrectCount } = stats;
    const incorrectPoints = incorrectCount * this.pointsConfig.incorrect;

    return {
      title: 'Números incorrectos',
      message: `${incorrectCount} números borrados. ${incorrectPoints} puntos. Puntuación: ${finalScore}`
    };
  }

  /**
   * Genera mensaje cuando no hay cambios
   */
  private generateNoChangesMessage(): AlertMessage {
    return {
      title: 'Sin cambios',
      message: 'No hay números nuevos para evaluar.'
    };
  }

  /**
   * Genera mensaje de advertencia para celdas iniciales
   */
  generateInitialCellWarning(): AlertMessage {
    return {
      title: 'Aviso',
      message: 'No puedes cambiar los números iniciales.'
    };
  }

  /**
   * Genera mensaje de tablero ya completado
   */
  generateAlreadyCompleteMessage(): AlertMessage {
    return {
      title: '¡Felicidades!',
      message: '¡Ya completaste el tablero!'
    };
  }

  /**
   * Genera mensaje de publicidad mock
   */
  generateAdMessage(): AlertMessage {
    return {
      title: 'Publicidad',
      message: 'Imagina que estás viendo un anuncio...'
    };
  }
}