import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  constructor() {}

  // Fonction qui permet de récupérer le nom de la méthode qui a appelé la fonction de log
  private basic(type: string, color: string, args: string[]): void {
    if (args.length > 0) {
      const argsString = args.join(', ');
      console.log(
        `%c[${type.toUpperCase()}] ${LoggingService.getComponentMethodName()}\n\t➡️${argsString}`,
        'color: ' + color
      );
    } else {
      console.log(
        `%c[${type.toUpperCase()}] '${LoggingService.getComponentMethodName()}'`,
        'color: ' + color
      );
    }
  }

  // Fonction qui permet de logger un message
  log(...args: string[]): void {
    this.basic('log', 'green', args);
  }

  // Fonction qui permet de logger un évènement
  event(...args: string[]): void {
    this.basic('event', 'white', args);
  }

  // Fonction qui permet de logger une erreur
  error(...args: string[]): void {
    this.basic('error', 'red', args);
  }

  // Fonction qui permet de logger un warning
  warn(...args: string[]): void {
    this.basic('warn', 'yellow', args);
  }

  private static getComponentName(): string {
    return (
      new Error().stack?.split('at ')[2].split(' ')[0].split('.')[0] ??
      'unknown'
    );
  }

  private static getMethodName(): string {
    return (
      new Error().stack?.split('at ')[2].split(' ')[0].split('.')[1] ??
      'unknown'
    );
  }

  private static getComponentMethodName(): string {
    return new Error().stack?.split('at ')[4].split(' ')[0] ?? 'unknown';
  }
}
