import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { LoggingService } from '../logging/logging.service';
import { MatDialog } from '@angular/material/dialog';
import { Utils } from '../../utils/Utils';
import { PermissionState, PermissionUtils } from '../../utils/PermissionUtils';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private _authService: AuthService,
    private _loggingService: LoggingService,
    public _dialog: MatDialog,
    private _config: ConfigService
  ) {}

  // Fonction qui permet de vérifier si l'utilisateur est connecté
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const permState = PermissionUtils.getPerms(
      route.routeConfig?.path,
      this._authService.isAdmin(),
      this._authService.isLogged(),
      this._config.getPermsPath()
    );
    switch (permState) {
      case PermissionState.ALLOWED:
        this._loggingService.log(`ALLOWED`);
        return true;
      case PermissionState.DENIED_NOT_ADMIN:
        this._loggingService.error(`DENIED YOU'RE NOT AN ADMIN`);
        Utils.openDialog(
          this._dialog,
          'Droit inssufisant',
          "Vous n'avez pas les droits pour accéder à cette page",
          false
        );
        return false;
      case PermissionState.DENIED_NOT_LOGGED:
        this._loggingService.error(`DENIED YOU'RE NOT LOGGED`);
        Utils.openDialog(
          this._dialog,
          'Connexion requise',
          'Vous devez être connecté pour accéder à cette page',
          false
        );
        return false;
    }
  }
}
