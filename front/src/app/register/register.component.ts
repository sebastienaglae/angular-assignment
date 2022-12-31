import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ErrorRequest } from '../shared/api/error.model';
import { SuccessRequest } from '../shared/api/success.model';
import { LoggingService } from '../shared/services/logging/logging.service';
import { Utils } from '../shared/tools/Utils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoadingService } from '../shared/services/loading/loading.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: RegisterAccountFromGroup = new RegisterAccountFromGroup();

  constructor(
    private authService: AuthService,
    private loggingService: LoggingService,
    private snackBar: MatSnackBar,
    private route: Router,
    private loadingService: LoadingService
  ) {
    this.loadingService.changeLoadingState(false);
  }

  ngOnInit(): void { }

  register() {
    this.loggingService.event('RegisterComponent', 'register');
    if (!this.registerForm.valid) {
      Utils.frontErrorSoft(this.snackBar, 'Remplissez tous les champs', this.loadingService);
      return;
    }
    if (!this.registerForm.isPasswordSame()) {
      Utils.frontErrorSoft(
        this.snackBar,
        'Les mots de passe ne sont pas identiques',
        this.loadingService
      );
      return;
    }

    this.authService
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
    this.loggingService.event('RegisterComponent', 'handleRegistration');
    if (data instanceof ErrorRequest) {
      Utils.frontError(this.snackBar, data, this.loadingService);
      return;
    }
    if (data.success)
      Utils.snackBarSuccess(this.snackBar, 'Inscription réussie');
    else Utils.frontErrorSoft(this.snackBar, 'Inscription échouée', this.loadingService);
  }

  connectionRedirect() {
    this.route.navigate(['/login']);
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
