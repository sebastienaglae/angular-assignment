import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  constructor() { }

  log(action: string): void {
    let name = new Error().stack?.split('at ')[3].split(' ')[0] ?? 'unknown';
    console.log(`[LOG] '${name}': ${action}`);
  }

  event(name: string, action: string): void {
    console.log(`[EVENT] '${name}': ${action}`);
  }
}
