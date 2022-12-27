import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../shared/services/auth/auth.service';
import { ErrorRequest } from '../shared/api/error.model';
import { AuthRequest } from '../shared/api/auth/register.auth.model';
import { Token } from '@angular/compiler';
import { TokenAuth } from '../shared/api/auth/token.auth.model';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css'],
})
export class ConnexionComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    remember: new FormControl(false),
  });

  message?: string;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  login() {
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

  handleLogin(data: ErrorRequest | TokenAuth) {
    console.log(data as TokenAuth);
    if (data instanceof ErrorRequest) return (this.message = data.message);
    return (this.message = 'Connexion réussie');
  }
}
