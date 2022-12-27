import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ErrorRequest } from '../shared/api/error.model';
import { AuthRequest } from '../shared/api/auth/register.auth.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    passwordConfirm: new FormControl('', [Validators.required]),
  });

  message?: string;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  register() {
    this.message = undefined;
    if (!this.registerForm.valid)
      return (this.message = 'Remplissez tous les champs');
    if (
      this.registerForm.value.password !==
      this.registerForm.value.passwordConfirm
    )
      return (this.message = 'Les mots de passe ne correspondent pas');

    this.authService
      .register(
        this.registerForm.value.username,
        this.registerForm.value.password,
        this.registerForm.value.email
      )
      .subscribe((data) => {
        this.handleRegistration(data);
      });

    return (this.message = "En attente de l'inscription");
  }

  handleRegistration(data: any) {
    if (data instanceof ErrorRequest) this.message = data.message;
    if ((data as AuthRequest).success) this.message = 'Inscription réussie';
  }
}

class RegisterModel {
  email!: string;
  username!: string;
  password!: string;
}
