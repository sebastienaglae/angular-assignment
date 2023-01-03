import { Component } from '@angular/core';
import { LoadingService } from '../shared/services/loading/loading.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorRequest } from '../shared/api/error.model';
import { Utils } from '../shared/utils/Utils';
import { LoggingService } from '../shared/services/logging/logging.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-base',
  template: ``,
  styleUrls: ['./base.component.css'],
})
export class BaseComponent implements FrontService {
  loading: boolean = true;
  constructor(
    public readonly _loadingService: LoadingService,
    public readonly _snackBar: MatSnackBar,
    public readonly _loggingService: LoggingService,
    public readonly _dialog: MatDialog
  ) {}

  // Ouvre une boite de dialogue
  openDialog(
    title: string | undefined,
    content: string | any | undefined,
    yesNo: boolean = false
  ) {
    if (title === undefined || content === undefined) return;
    return Utils.openDialog(this._dialog, title, content, yesNo);
  }

  // Gère les erreurs et bloque l'affichage
  handleError(error: ErrorRequest | string) {
    Utils.snackBarError(this._snackBar, error);
    this._loadingService.enabledError();
    if (error instanceof ErrorRequest) {
      this._loggingService.error(error.message);
    } else {
      this._loggingService.error(error);
    }
  }

  // Gère les erreurs sans bloquer l'affichage
  handleErrorSoft(error: ErrorRequest | string) {
    Utils.snackBarError(this._snackBar, error);
    this._loadingService.enabledErrorSoft();
  }

  // Set le loading state et met à jour le loading component
  loadingState(state: boolean) {
    this.loading = this._loadingService.setLoadingState(state);
  }

  // Set le loading state sans mettre à jour le loading component
  loadingStateNoUpdate(state: boolean) {
    this._loadingService.setLoadingState(state);
  }
}

interface FrontService {
  _snackBar: MatSnackBar;
  _loadingService: LoadingService;
  _loggingService: LoggingService;
  _dialog: MatDialog;
}
