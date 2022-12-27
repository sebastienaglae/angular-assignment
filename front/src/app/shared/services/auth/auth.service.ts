import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorRequest } from '../../api/error.model';
import { BehaviorSubject, Observable, catchError, of, throwError } from 'rxjs';
import { AuthRequest } from '../../api/auth/register.auth.model';
import { Utils } from '../../tools/Utils';
import { TokenAuth } from '../../api/auth/token.auth.model';
import { Config } from '../../tools/Config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  serverConf = Config.data.server;
  jwtToken: string | null = null;
  apiUrl = `${Config.getServerUrl()}/${this.serverConf.authRoute}`;
  // BehaviorSubject on the loggedIn state
  loggedState = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  register(
    username: string,
    password: string,
    email: string
  ): Observable<string> {
    return this.http
      .post<string>(`${this.apiUrl}/register`, {
        username,
        password,
        email,
      })
      .pipe(catchError(Utils.handleError<string>('register')));
  }

  login(
    username: string,
    password: string,
    rememberMe: boolean
  ): Observable<TokenAuth | ErrorRequest> {
    const request = this.http
      .post<TokenAuth>(`${this.apiUrl}/login`, {
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

  checkLogin(): boolean {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      this.setLoggedState(false);
      console.log('No token');
      return false;
    }
    this.jwtToken = token;
    this.setLoggedState(true);
    console.log('Token found');
    return true;
  }

  saveToken(token: string, rememberMe: boolean) {
    if (rememberMe) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }
  }

  getUser() {
    // decodeJWTToken
  }

  logout() {
    this.jwtToken = null;
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.setLoggedState(false);
    console.log('Logged out');
  }

  isAdmin() {
    const isUserAdmin = new Promise((resolve, reject) => {
      resolve(false);
    });

    return isUserAdmin;
  }

  setLoggedState(state: boolean): void {
    this.loggedState.next(state);
  }

  getLoggedState(): Observable<boolean> {
    return this.loggedState.asObservable();
  }
}
