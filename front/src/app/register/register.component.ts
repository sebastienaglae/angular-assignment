import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

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

  errorMessage?: string;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  register() {
    this.errorMessage = undefined;
    if (!this.registerForm.valid)
      return (this.errorMessage = 'Remplissez tous les champs');
    if (
      this.registerForm.value.password !==
      this.registerForm.value.passwordConfirm
    )
      return (this.errorMessage = 'Les mots de passe ne correspondent pas');

    this.authService.register(
      this.registerForm.value.email,
      this.registerForm.value.username,
      this.registerForm.value.password,
      (status: boolean) => this.handleRegistration(status)
    );

    return (this.errorMessage = undefined);
  }

  handleRegistration(status: boolean) {
    console.log(this.registerForm.value);
  }
}

class RegisterModel {
  email!: string;
  username!: string;
  password!: string;
}
