/**
 * Utilidad para formatear tiempo
 * Principio: Single Responsibility - Solo se encarga del formateo de tiempo
 */
export class TimeFormatter {
  /**
   * Formatea segundos a string según el formato especificado
   */
  static format(
    totalSeconds: number, 
    format: 'ss' | 'mm:ss' | 'hh:mm:ss' = 'mm:ss'
  ): string {
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const hours = Math.floor(totalSeconds / 3600);

    switch (format) {
      case 'ss':
        return this.padZero(totalSeconds);
      
      case 'mm:ss':
        return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
      
      case 'hh:mm:ss':
        return `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
      
      default:
        return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
    }
  }

  /**
   * Convierte diferentes unidades de tiempo a segundos
   */
  static toSeconds(value: number, unit: 'seconds' | 'minutes' | 'hours'): number {
    switch (unit) {
      case 'seconds':
        return value;
      case 'minutes':
        return value * 60;
      case 'hours':
        return value * 3600;
      default:
        return value;
    }
  }

  /**
   * Convierte minutos a segundos (helper para casos comunes)
   */
  static minutesToSeconds(minutes: number): number {
    return this.toSeconds(minutes, 'minutes');
  }

  /**
   * Convierte horas a segundos (helper para casos comunes)
   */
  static hoursToSeconds(hours: number): number {
    return this.toSeconds(hours, 'hours');
  }

  /**
   * Obtiene el mejor formato basado en el tiempo total
   */
  static getBestFormat(totalSeconds: number): 'ss' | 'mm:ss' | 'hh:mm:ss' {
    if (totalSeconds < 60) {
      return 'ss';
    } else if (totalSeconds < 3600) {
      return 'mm:ss';
    } else {
      return 'hh:mm:ss';
    }
  }

  /**
   * Parsea un string de tiempo a segundos
   * Formatos soportados: "10", "5:30", "1:30:45"
   */
  static parseToSeconds(timeString: string): number {
    const parts = timeString.split(':').map(part => parseInt(part.trim(), 10));
    
    if (parts.length === 1) {
      // Solo segundos
      return parts[0] || 0;
    } else if (parts.length === 2) {
      // mm:ss
      const [minutes, seconds] = parts;
      return (minutes || 0) * 60 + (seconds || 0);
    } else if (parts.length === 3) {
      // hh:mm:ss
      const [hours, minutes, seconds] = parts;
      return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
    }
    
    return 0;
  }

  /**
   * Valida si un string de tiempo es válido
   */
  static isValidTimeString(timeString: string): boolean {
    const timeRegex = /^(\d{1,2}:)?(\d{1,2}:)?\d{1,2}$/;
    return timeRegex.test(timeString.trim());
  }

  /**
   * Añade cero a la izquierda si es necesario
   */
  private static padZero(num: number): string {
    return num.toString().padStart(2, '0');
  }

  /**
   * Formatea tiempo de manera legible para humanos
   */
  static toHumanReadable(totalSeconds: number): string {
    if (totalSeconds === 0) return "0 segundos";
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    const parts = [];
    
    if (hours > 0) {
      parts.push(`${hours} hora${hours !== 1 ? 's' : ''}`);
    }
    
    if (minutes > 0) {
      parts.push(`${minutes} minuto${minutes !== 1 ? 's' : ''}`);
    }
    
    if (seconds > 0) {
      parts.push(`${seconds} segundo${seconds !== 1 ? 's' : ''}`);
    }
    
    if (parts.length === 1) {
      return parts[0];
    } else if (parts.length === 2) {
      return parts.join(' y ');
    } else {
      return `${parts.slice(0, -1).join(', ')} y ${parts[parts.length - 1]}`;
    }
  }
}