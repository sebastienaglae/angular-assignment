import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ErrorRequest } from '../shared/api/error.model';
import { SuccessRequest } from '../shared/api/success.model';
import { LoggingService } from '../shared/services/logging/logging.service';
import { Utils } from '../shared/utils/Utils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoadingService } from '../shared/services/loading/loading.service';
import { BaseComponent } from '../base/base.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent extends BaseComponent {
  registerForm: RegisterAccountFromGroup = new RegisterAccountFromGroup();

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

  // Fonction qui permet de s'inscrire
  register() {
    this._loggingService.event('RegisterComponent', 'register');
    if (!this.registerForm.valid) {
      this.handleErrorSoft('Remplissez tous les champs');
      return;
    }
    if (!this.registerForm.isPasswordSame()) {
      this.handleErrorSoft('Les mots de passe ne sont pas identiques');
      return;
    }

    this._authService
      .register(
        this.registerForm.usernameValue,
        this.registerForm.passwordValue,
        this.registerForm.emailValue
      )
      .subscribe((data) => {
        this.handleRegistration(data);
      });
  }

  // Fonction qui gère l'inscription
  handleRegistration(data: ErrorRequest | SuccessRequest): void {
    this._loggingService.event();
    if (data instanceof ErrorRequest) {
      this.handleErrorSoft(data);
      return;
    }
    if (data.success)
      Utils.snackBarSuccess(this._snackBar, 'Inscription réussie');
    else {
      this.handleErrorSoft('Inscription échouée');
    }
  }

  // Fonction qui permet de se connecter
  connectionRedirect() {
    this._route.navigate(['/connection']);
  }
}

class RegisterAccountFromGroup extends FormGroup {
  constructor() {
    super({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(255),
      ]),
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(16),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      passwordConfirm: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  get emailValue() {
    return this.get('email')?.value;
  }

  get usernameValue() {
    return this.get('username')?.value;
  }

  get passwordValue() {
    return this.get('password')?.value;
  }

  get passwordConfirmValue() {
    return this.get('passwordConfirm')?.value;
  }

  set emailValue(value: string) {
    this.get('email')?.setValue(value);
  }

  set usernameValue(value: string) {
    this.get('username')?.setValue(value);
  }

  set passwordValue(value: string) {
    this.get('password')?.setValue(value);
  }

  set passwordConfirmValue(value: string) {
    this.get('passwordConfirm')?.setValue(value);
  }

  isPasswordSame() {
    return this.passwordValue === this.passwordConfirmValue;
  }

  isEmailHasError(error: string) {
    return this.get('email')?.hasError(error);
  }

  isUsernameHasError(error: string) {
    return this.get('username')?.hasError(error);
  }

  isPasswordHasError(error: string) {
    return this.get('password')?.hasError(error);
  }

  isPasswordConfirmHasError(error: string) {
    return this.get('passwordConfirm')?.hasError(error);
  }
}
