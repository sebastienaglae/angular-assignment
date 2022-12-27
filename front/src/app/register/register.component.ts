import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ErrorRequest } from '../shared/api/error.model';
import { SuccessRequest } from '../shared/api/success.model';
import { LoggingService } from '../shared/services/logging/logging.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: RegisterAccountFromGroup = new RegisterAccountFromGroup();

  message?: string;

  constructor(
    private authService: AuthService,
    private loggingService: LoggingService
  ) {}

  ngOnInit(): void {}

  register() {
    this.loggingService.event('RegisterComponent', 'register');
    this.message = undefined;
    if (!this.registerForm.valid)
      return (this.message = 'Remplissez tous les champs');
    if (!this.registerForm.isPasswordSame())
      return (this.message = 'Les mots de passe ne correspondent pas');

    this.authService
      .register(
        this.registerForm.usernameValue,
        this.registerForm.passwordValue,
        this.registerForm.emailValue
      )
      .subscribe((data) => {
        this.handleRegistration(data);
      });

    return (this.message = "En attente de l'inscription");
  }

  // Fonction qui gère l'inscription
  handleRegistration(data: ErrorRequest | SuccessRequest): void {
    this.loggingService.event('RegisterComponent', 'handleRegistration');
    if (data instanceof ErrorRequest) {
      this.message = data.message;
      return;
    }
    if (data.success) this.message = 'Inscription réussie';
    else this.message = 'Inscription échouée';
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
