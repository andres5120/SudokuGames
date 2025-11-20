import { StorageService } from './storage.service';

export interface GameProgress {
  unlockedLevels: string[];
  highScores: Record<string, number>;
  achievements?: string[];
}

export class ProgressionService {
  static getStorageKey(gameType: string, dataType: string): string {
    return `${gameType}_${dataType}`;
  }

  static async getGameProgress(gameType: string): Promise<GameProgress> {
    const [unlockedLevels, highScores] = await Promise.all([
      StorageService.getItem(this.getStorageKey(gameType, 'unlocked'), []),
      StorageService.getItem(this.getStorageKey(gameType, 'scores'), {}),
    ]);
    return { unlockedLevels, highScores };
  }

  static async saveGameProgress(gameType: string, progress: GameProgress): Promise<void> {
    await Promise.all([
      StorageService.setItem(this.getStorageKey(gameType, 'unlocked'), progress.unlockedLevels),
      StorageService.setItem(this.getStorageKey(gameType, 'scores'), progress.highScores),
    ]);
  }
}