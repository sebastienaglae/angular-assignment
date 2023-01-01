import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  constructor() { }

  private basic(type: string, color: string, args: string[]): void {
    if (args.length > 0) {
      const argsString = args.join(', ');
      console.log(`%c[${type.toUpperCase()}] '${LoggingService.getComponentMethodName()}\n${argsString}'`, 'color: ' + color);
    }
    else {
      console.log(`%c[${type.toUpperCase()}] '${LoggingService.getComponentMethodName()}'`, 'color: ' + color);
    }
  }

  log(...args: string[]): void {
    this.basic('log', 'green', args);
  }

  event(...args: string[]): void {
    this.basic('event', 'white', args);
  }

  error(...args: string[]): void {
    this.basic('error', 'red', args);
  }

  warn(...args: string[]): void {
    this.basic('warn', 'yellow', args);
  }

  private static getComponentName(): string {
    return new Error().stack?.split('at ')[2].split(' ')[0].split('.')[0] ?? 'unknown';
  }

  private static getMethodName(): string {
    return new Error().stack?.split('at ')[2].split(' ')[0].split('.')[1] ?? 'unknown';
  }

  private static getComponentMethodName(): string {
    return new Error().stack?.split('at ')[2].split(' ')[0] ?? 'unknown';
  }
}
