import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './shared/services/auth/auth.service';
import { Utils } from './shared/tools/Utils';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Hanagames';
  isUserLogged: boolean = false;
  sideMenuOpened: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  // Fonction d'initialisation
  ngOnInit(): void {
    this.authService.checkLogin();
    this.authService.loggedState.subscribe((data) => {
      this.isUserLogged = data;
    });
  }

  // Fonction de déconnexion
  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  // Fonction qui ouvre ou ferme le menu latéral
  sideMenuToggle() {
    this.sideMenuOpened = !this.sideMenuOpened;
  }

  // Fonction qui ferme le menu latéral
  sideMenuClose() {
    this.sideMenuOpened = false;
  }

  // Fonction qui ouvre le menu latéral
  sideMenuOpen() {
    this.sideMenuOpened = true;
  }
}
