import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/base/base.component';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { LoggingService } from 'src/app/shared/services/logging/logging.service';
import { Utils } from 'src/app/shared/utils/Utils';
import { stringify } from 'uuid';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.css'],
})
export class DebugComponent extends BaseComponent implements OnInit {
  tokenTest: string =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYWRkMGJmZTUwZmFiODZmZGQ1MWU1MCIsInJvbGVzIjpbNCwyLDFdLCJpYXQiOjE2NzI3NTQwOTIsImV4cCI6MTY3NDgyNzY5Mn0.RUB-8If9TJ1KFqUj-o5TdI4RFB9D_AFZcX5QmL46kjI';
  dateTest0: Date = new Date('2025-01-01T00:00:00.000Z');
  sizeTest0: number = 45545444457;
  decodeJWTToken: string = '';
  textPreview: string = Utils.textPreview(
    'Salut comment ça va ? Je suis un texte de test pour voir si ça marche bien.',
    20
  );
  intervalTime = JSON.stringify(Utils.getIntervalTime(2022, 6));
  isLogged: boolean;
  isAdmin: boolean;
  isUser: boolean;
  jwtToken: string;
  user: string;

  constructor(
    loadingService: LoadingService,
    snackBar: MatSnackBar,
    loggingService: LoggingService,
    dialog: MatDialog,
    private authService: AuthService
  ) {
    super(loadingService, snackBar, loggingService, dialog);
    this.decodeJWTToken = JSON.stringify(Utils.decodeJWTToken(this.tokenTest));
    this.isLogged = this.authService.isLogged();
    this.isAdmin = this.authService.isAdmin();
    this.isUser = this.authService.isUser();
    this.jwtToken = Utils.textPreview(
      this.authService.getToken() ?? 'No token',
      50
    );
    this.user = JSON.stringify(this.authService.getUser() ?? 'No user');

    this.loadingState(false);
  }

  ngOnInit(): void {}

  openSnackBarSuccess() {
    Utils.snackBarSuccess(this._snackBar, 'Success');
  }

  openSnackBarError() {
    Utils.snackBarError(this._snackBar, 'Error');
  }

  openDialogOk() {
    this.openDialog('Front', 'Just Ok !!!', false);
  }

  openDialogYesNo() {
    this.openDialog('Front', 'Yes and no !!!', true);
  }

  stopLoading() {
    this.loadingState(false);
    this.loadingStateNoUpdate(false);
  }

  loading0() {
    this.loadingState(true);
  }

  loading1() {
    this.loadingStateNoUpdate(true);
  }

  error() {
    this._loadingService.enabledError();
  }

  errorSoft() {
    this._loadingService.enabledErrorSoft();
  }

  uploadProgress() {
    this._loadingService.setUploadState(true);
  }

  loggingLog() {
    this._loggingService.log();
  }

  loggingEvent() {
    this._loggingService.event();
  }

  loggingError() {
    this._loggingService.error();
  }

  loggingWarn() {
    this._loggingService.warn();
  }
}
