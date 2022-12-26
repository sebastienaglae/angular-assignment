import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  jwtToken: string | null = null;
  apiUrl = 'http://localhost:3000/auth';
  loggedIn = false;

  constructor(private http: HttpClient) {}

  register(
    username: string,
    password: string,
    email: string,
    callback: (status: boolean) => void
  ) {
    const apiRequest = this.http.post(`${this.apiUrl}/register`, {
      username,
      password,
      email,
    });

    apiRequest.subscribe((data: any) => {
      callback(data.success);
    });
  }

  logIn(
    username: string,
    password: string,
    rememberMe: boolean,
    callback: (status: boolean) => void
  ) {
    const apiRequest = this.http.post(`${this.apiUrl}/login`, {
      username,
      password,
    });

    apiRequest.subscribe((data: any) => {
      if (!data) {
        callback(false);
        return;
      }
      this.jwtToken = data.token;
      if (this.jwtToken === null) {
        callback(false);
        return;
      }
      if (rememberMe) {
        localStorage.setItem('token', this.jwtToken);
      } else {
        sessionStorage.setItem('token', this.jwtToken);
      }
      callback(true);
      this.loggedIn = true;
    });
  }

  getUser() {
    // decodeJWTToken
  }

  logOut() {
    this.jwtToken = null;
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.loggedIn = false;
  }

  isAdmin() {
    const isUserAdmin = new Promise((resolve, reject) => {
      resolve(false);
    });

    return isUserAdmin;
  }
}
