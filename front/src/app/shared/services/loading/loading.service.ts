import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoggingService } from '../logging/logging.service';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  loadingModel = new BehaviorSubject<LoadingModel>(LoadingModel.default);
  cooldownBeforeDisappearance = 1000;
  timeout: any;

  constructor(private _loggingService: LoggingService) {}

  // Fonction qui set l'état de loading
  setLoadingState(state: boolean): boolean {
    this._loggingService.log(`LoadingService: changeLoadingState(${state})`);
    clearTimeout(this.timeout);

    if (!state) {
      this.executeSequenceLoop(LoadingModel.green, LoadingModel.green, false);
      return false;
    }
    this.loadingModel.next(LoadingModel.default);
    return true;
  }

  // Fonction qui set l'état de l'upload
  setUploadState(state: boolean): boolean {
    this._loggingService.log(`LoadingService: changeUploadState(${state})`);
    clearTimeout(this.timeout);

    if (!state) {
      this.executeSequenceLoop(LoadingModel.green, LoadingModel.green, false);
      return false;
    }
    this.loadingModel.next(LoadingModel.upload);
    return true;
  }

  // Fonction qui permet de faire une séquence de loading avec boucle
  enabledError() {
    this.executeSequenceLoop(LoadingModel.error, LoadingModel.error, true);
  }

  // Fonction qui permet de faire une séquence de loading sans boucle
  enabledErrorSoft() {
    this.executeSequenceLoop(LoadingModel.error, LoadingModel.error, false);
  }

  // Fonction qui permet de faire une séquence de loading
  private executeSequenceLoop(
    originalSequence: LoadingModel[],
    sequence: LoadingModel[],
    loop: boolean
  ): void {
    sequence = sequence.slice();
    this._loggingService.log();
    this.loadingModel.next(sequence[0]);
    sequence.shift();
    if (sequence.length === 0 && loop) {
      sequence = originalSequence.slice();
    }
    if (sequence.length === 0 && !loop) {
      this.timeout = setTimeout(() => {
        this.loadingModel.next(LoadingModel.disabled);
      }, this.cooldownBeforeDisappearance);
      return;
    }

    this.timeout = setTimeout(() => {
      this.executeSequenceLoop(originalSequence, sequence, loop);
    }, sequence[0].timeout);
  }

  // Fonction qui permet de faire une séquence de loading
  private executeSequence(sequence: LoadingModel[]): void {
    sequence = sequence.slice();
    this._loggingService.log();
    this.loadingModel.next(sequence[0]);
    sequence.shift();
    if (sequence.length === 0) {
      this.timeout = setTimeout(() => {
        this.loadingModel.next(LoadingModel.disabled);
      }, this.cooldownBeforeDisappearance);
      return;
    }

    this.timeout = setTimeout(() => {
      this.executeSequence(sequence);
    }, sequence[0].timeout);
  }

  // Getters
  getLoadingState(): BehaviorSubject<LoadingModel> {
    return this.loadingModel;
  }
}

export class LoadingModel {
  public static default: LoadingModel = {
    enabled: true,
    color: 'primary',
    mode: 'indeterminate',
    value: 100,
    timeout: 0,
  };
  public static disabled: LoadingModel = {
    enabled: false,
    color: 'primary',
    mode: 'indeterminate',
    value: 100,
    timeout: 250,
  };
  public static upload: LoadingModel = {
    enabled: true,
    color: 'primary',
    mode: 'query',
    value: 100,
    timeout: 250,
  };
  public static green: LoadingModel[] = [
    {
      enabled: true,
      color: 'accent',
      mode: 'determinate',
      value: 100,
      timeout: 0,
    },
    {
      enabled: true,
      color: 'accent',
      mode: 'determinate',
      value: 100,
      timeout: 1000,
    },
  ];
  public static error: LoadingModel[] = [
    {
      enabled: true,
      color: 'warn',
      mode: 'indeterminate',
      value: 100,
      timeout: 1500,
    },
    { enabled: true, color: 'warn', mode: 'query', value: 100, timeout: 1500 },
    {
      enabled: true,
      color: 'warn',
      mode: 'determinate',
      value: 100,
      timeout: 1000,
    },
  ];

  enabled: boolean = true;
  color: 'primary' | 'accent' | 'warn' = 'primary';
  mode: 'determinate' | 'indeterminate' | 'buffer' | 'query' = 'indeterminate';
  value: number = 100;
  timeout: number = 1000;
}
