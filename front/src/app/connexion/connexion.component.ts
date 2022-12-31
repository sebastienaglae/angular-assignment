import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth/auth.service';
import { ErrorRequest } from '../shared/api/error.model';
import { TokenAuth } from '../shared/api/auth/token.auth.model';
import { LoggingService } from '../shared/services/logging/logging.service';
import { Utils } from '../shared/tools/Utils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../shared/services/loading/loading.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css'],
})
export class ConnexionComponent implements OnInit {
  loginForm: RegisterAccountFromGroup = new RegisterAccountFromGroup();

  constructor(
    private authService: AuthService,
    private loggingService: LoggingService,
    private snackBar: MatSnackBar,
    private route: Router,
    private loadingService: LoadingService
  ) {
    this.loadingService.changeLoadingState(true);
  }

  ngOnInit(): void { }

  // Fonction qui gère la connexion
  login() {
    this.loggingService.event('ConnexionComponent', 'login');
    if (!this.loginForm.valid) {
      Utils.frontError(this.snackBar, 'Remplissez tous les champs', this.loadingService);
      return;
    }

    this.authService
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
    this.loggingService.event('ConnexionComponent', 'handleLogin');
    if (data instanceof ErrorRequest) {
      Utils.frontError(this.snackBar, data.message, this.loadingService);
      return;
    }
    Utils.snackBarSuccess(this.snackBar, 'Connexion réussie');

    this.route.navigate(['/home']);
  }

  // Fonction qui gère le lien vers la page d'inscription
  registerRedirect() {
    this.route.navigate(['/register']);
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
