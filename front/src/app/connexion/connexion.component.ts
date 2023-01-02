import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth/auth.service';
import { ErrorRequest } from '../shared/api/error.model';
import { TokenAuth } from '../shared/api/auth/token.auth.model';
import { LoggingService } from '../shared/services/logging/logging.service';
import { Utils } from '../shared/utils/Utils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../shared/services/loading/loading.service';
import { BaseComponent } from '../base/base.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css'],
})
export class ConnexionComponent extends BaseComponent {
  loginForm: RegisterAccountFromGroup = new RegisterAccountFromGroup();

  constructor(
    private _authService: AuthService,
    private _route: Router,
    loadingService: LoadingService,
    loggingService: LoggingService,
    snackBar: MatSnackBar,
    dialog: MatDialog
  ) {
    super(loadingService, snackBar, loggingService, dialog);
    this.loadingState(false);
  }

  // Fonction qui gère la connexion
  login() {
    this._loggingService.event('ConnexionComponent', 'login');
    if (!this.loginForm.valid) {
      this.handleErrorSoft('Remplissez tous les champs');
      return;
    }

    this._authService
      .login(
        this.loginForm.value.username,
        this.loginForm.value.password,
        this.loginForm.value.remember
      )
      .subscribe((data) => {
        this.handleLogin(data);
      });
  }

  // Fonction qui gère la connexion
  handleLogin(data: ErrorRequest | TokenAuth) {
    this._loggingService.event('ConnexionComponent', 'handleLogin');
    if (data instanceof ErrorRequest) {
      this.handleErrorSoft(data);
      return;
    }
    Utils.snackBarSuccess(this._snackBar, 'Connexion réussie');

    this._route.navigate(['']);
  }

  // Fonction qui gère le lien vers la page d'inscription
  registerRedirect() {
    this._route.navigate(['/register']);
  }
}

class RegisterAccountFromGroup extends FormGroup {
  constructor() {
    super({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(16),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(255),
      ]),
      remember: new FormControl(false),
    });
  }

  get usernameValue() {
    return this.get('username')?.value;
  }

  get passwordValue() {
    return this.get('password')?.value;
  }

  get rememberValue() {
    return this.get('remember')?.value;
  }

  set usernameValue(value: string) {
    this.get('username')?.setValue(value);
  }

  set passwordValue(value: string) {
    this.get('password')?.setValue(value);
  }

  set rememberValue(value: boolean) {
    this.get('remember')?.setValue(value);
  }

  isUsernameHasError(error: string) {
    return this.get('username')?.hasError(error);
  }

  isPasswordHasError(error: string) {
    return this.get('password')?.hasError(error);
  }

  isRememberHasError(error: string) {
    return this.get('remember')?.hasError(error);
  }
}
