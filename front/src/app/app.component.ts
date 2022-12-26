import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './shared/auth.service';
import { Utils } from './shared/tools/Utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'mdr';
  opened: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    console.log(
      Utils.decodeJWTToken(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYThkN2ZlYTNmNzYyYWVkYmNjOWE5YyIsInJvbGVzIjpbNCwyXSwiaWF0IjoxNjcyMDA5ODg0LCJleHAiOjE2NzQwODM0ODR9.m-Aj6B_kYvY9vCnWGtn96RNOAhTN3JnAT58W8ep931c'
      )
    );
  }

  login() {
    if (!this.authService.loggedIn) {
      this.authService.logIn('test', 'test', false, (status: boolean) => {
        console.log(status);
      });
    } else {
      this.authService.logOut();
      this.router.navigate(['/']);
    }
  }
}
