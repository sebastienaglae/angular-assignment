import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorRequest } from '../../api/error.model';
import { BehaviorSubject, Observable, catchError } from 'rxjs';
import { Utils } from '../../tools/Utils';
import { TokenAuth } from '../../api/auth/token.auth.model';
import { Config } from '../../tools/Config';
import { User } from '../../models/user.model';
import { LoggingService } from '../logging/logging.service';
import { SuccessRequest } from '../../api/success.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = `${Config.getServerUrl()}/${Config.auth.route}`;

  // Token de l'utilisateur
  jwtToken: string | null = null;

  // Etat de la connexion
  // BehaviorSubject est un Observable qui permet de stocker une valeur et de la partager avec tous les abonnés
  loggedState = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private loggingService: LoggingService
  ) { }

  // Fonction qui permet de s'inscrire
  register(
    username: string,
    password: string,
    email: string
  ): Observable<SuccessRequest | ErrorRequest> {
    this.loggingService.log('REGISTER');
    return this.http
      .post<SuccessRequest>(`${this.apiUrl}/${Config.auth.register}`, {
        username,
        password,
        email,
      })
      .pipe(catchError(Utils.handleError<ErrorRequest>('register')));
  }

  // Fonction qui permet de se connecter
  login(
    username: string,
    password: string,
    rememberMe: boolean
  ): Observable<TokenAuth | ErrorRequest> {
    this.loggingService.log('LOGIN');
    const request = this.http
      .post<TokenAuth>(`${this.apiUrl}/${Config.auth.login}`, {
        username,
        password,
      })
      .pipe(catchError(Utils.handleError<ErrorRequest>('login')));

    request.subscribe((result) => {
      if (result instanceof ErrorRequest) return;
      this.jwtToken = result.token;
      this.setLoggedState(true);
      this.saveToken(result.token, rememberMe);
    });
    return request;
  }

  // Fonction qui permet de modifier l'état de la connexion
  checkLogin(): boolean {
    this.loggingService.log('CHECK LOGIN');
    const token =
      localStorage.getItem(Config.auth.token) ||
      sessionStorage.getItem(Config.auth.token);
    if (!token) {
      this.setLoggedState(false);
      this.loggingService.log('CHECK LOGIN NO TOKEN FOUND');
      return false;
    }
    this.jwtToken = token;
    this.setLoggedState(true);
    this.loggingService.log('CHECK LOGIN TOKEN FOUND');
    return true;
  }

  // Fonction qui permet de modifier l'état de la connexion
  saveToken(token: string, rememberMe: boolean): void {
    if (rememberMe) {
      localStorage.setItem(Config.auth.token, token);
      this.loggingService.log('SAVE TOKEN IN LOCAL STORAGE');
    } else {
      sessionStorage.setItem(Config.auth.token, token);
      this.loggingService.log('SAVE TOKEN IN SESSION STORAGE');
    }
  }

  // Fonction qui permet de récupérer l'utilisateur connecté
  getUser(): User | undefined {
    if (!this.getLoggedState()) return undefined;
    if (!this.jwtToken) return undefined;
    return Utils.decodeJWTToken(this.jwtToken) as User;
  }

  getToken(): string | null {
    return this.jwtToken;
  }

  // Fonction qui permet de se déconnecter
  logout(): void {
    this.loggingService.log('LOGOUT');
    this.jwtToken = null;
    localStorage.removeItem(Config.auth.token);
    sessionStorage.removeItem(Config.auth.token);
    this.setLoggedState(false);
  }

  isAdmin() {
    // TODO : Check if the user is admin
    const isUserAdmin = new Promise((resolve, reject) => {
      resolve(false);
    });

    return isUserAdmin;
  }

  // Fonction qui permet de modifier l'état de la connexion
  setLoggedState(state: boolean): void {
    this.loggedState.next(state);
  }

  // Fonction qui permet de récupérer l'état de la connexion
  getLoggedState(): Observable<boolean> {
    return this.loggedState.asObservable();
  }
}
