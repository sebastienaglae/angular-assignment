import { Component } from '@angular/core';
import { LoadingService } from '../shared/services/loading/loading.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorRequest } from '../shared/api/error.model';
import { Utils } from '../shared/tools/Utils';

@Component({
  selector: 'app-base',
  template: ``,
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements FrontService {
  loading: boolean = true;
  constructor(
    public readonly _loadingService: LoadingService,
    public readonly _snackBar: MatSnackBar,
  ) {
  }

  handleError(error: ErrorRequest | string) {
    Utils.snackBarError(this._snackBar, error);
    this._loadingService.enabledError();
  }

  handleErrorSoft(error: ErrorRequest | string) {
    Utils.snackBarError(this._snackBar, error);
    this._loadingService.enabledErrorSoft();
  }

  loadingState(state: boolean) {
    this.loading = this._loadingService.setLoadingState(state);
  }
}

interface FrontService {
  _loadingService: LoadingService;
  _snackBar: MatSnackBar;
}
