import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth/auth.service';
import { ErrorRequest } from '../shared/api/error.model';
import { TokenAuth } from '../shared/api/auth/token.auth.model';
import { LoggingService } from '../shared/services/logging/logging.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css'],
})
export class ConnexionComponent implements OnInit {
  loginForm: RegisterAccountFromGroup = new RegisterAccountFromGroup();
  message?: string;

  constructor(
    private authService: AuthService,
    private loggingService: LoggingService
  ) {}

  ngOnInit(): void {}

  // Fonction qui gère la connexion
  login() {
    this.loggingService.event('ConnexionComponent', 'login');
    this.message = undefined;
    if (!this.loginForm.valid)
      return (this.message = 'Remplissez tous les champs');

    this.authService
      .login(
        this.loginForm.value.username,
        this.loginForm.value.password,
        this.loginForm.value.remember
      )
      .subscribe((data) => {
        this.handleLogin(data);
      });

    return (this.message = 'En attente de la connexion');
  }

  // Fonction qui gère la connexion
  handleLogin(data: ErrorRequest | TokenAuth) {
    this.loggingService.event('ConnexionComponent', 'handleLogin');
    if (data instanceof ErrorRequest) return (this.message = data.message);
    return (this.message = 'Connexion réussie');
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
