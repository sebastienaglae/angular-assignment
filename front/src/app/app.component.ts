import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './shared/services/auth/auth.service';
import { LoggingService } from './shared/services/logging/logging.service';
import { User } from './shared/models/user.model';
import { LoadingModel, LoadingService } from './shared/services/loading/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Hanagames';
  isUserLogged: boolean = false;
  sideMenuOpened: boolean = false;
  user?: User;

  loadingModel: LoadingModel = LoadingModel.default;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loggingService: LoggingService,
    private loadingService: LoadingService
  ) {
    this.loadingService.getLoadingState().subscribe((data) => {
      this.loadingModel = data;
    });
  }

  // Fonction d'initialisation
  ngOnInit(): void {
    this.loggingService.event('AppComponent', 'Initialization');
    this.authService.checkLogin();
    this.authService.loggedState.subscribe((data) => {
      this.isUserLogged = data;
    });
  }

  // Fonction de déconnexion
  logout(): void {
    this.loggingService.event('AppComponent', 'Logout');
    this.authService.logout();
    this.router.navigate(['/']);
  }

  // Fonction qui ouvre ou ferme le menu latéral
  sideMenuToggle(): void {
    this.loggingService.event('AppComponent', 'SideMenuToggle');
    this.sideMenuOpened = !this.sideMenuOpened;
  }

  // Fonction qui ferme le menu latéral
  sideMenuClose(): void {
    this.loggingService.event('AppComponent', 'SideMenuClose');
    this.sideMenuOpened = false;
  }

  // Fonction qui ouvre le menu latéral
  sideMenuOpen(): void {
    this.loggingService.event('AppComponent', 'SideMenuOpen');
    this.sideMenuOpened = true;
  }
}
