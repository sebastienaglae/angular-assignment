import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  constructor() {}

  log(name: string, action: string): void {
    console.log(`[LOG] '${name}': ${action}`);
  }

  event(name: string, action: string): void {
    console.log(`[EVENT] '${name}': ${action}`);
  }
}
