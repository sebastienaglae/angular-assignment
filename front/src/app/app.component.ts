import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './shared/services/auth/auth.service';
import { Utils } from './shared/tools/Utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'mdr';
  opened: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

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
