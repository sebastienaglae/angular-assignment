import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ErrorRequest } from '../api/error.model';

export abstract class Utils {
  static getParams(): Map<string, string> {
    let params = new Map<string, string>();
    let url = window.location.href;
    let urlParts = url.split('?');
    if (urlParts.length > 1) {
      let paramsParts = urlParts[1].split('&');
      for (let i = 0; i < paramsParts.length; i++) {
        let paramParts = paramsParts[i].split('=');
        params.set(paramParts[0], paramParts[1]);
      }
    }
    return params;
  }

  public static compare(
    a: number | string,
    b: number | string,
    isAsc: boolean
  ) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  public static compareDate(a: Date, b: Date, isAsc: boolean) {
    return (a.getTime() < b.getTime() ? -1 : 1) * (isAsc ? 1 : -1);
  }

  public static randomDate(startYear: number, endYear: number): Date {
    let date = new Date(
      startYear + Math.random() * (endYear - startYear),
      Math.random() * 12,
      Math.random() * 28
    );
    return date;
  }

  public static updateParam(key: string, value: string) {
    key = encodeURIComponent(key);
    value = encodeURIComponent(value);
    let params = new Map<string, string>();
    let url = window.location.href;
    let urlParts = url.split('?');
    if (urlParts.length > 1) {
      let paramsParts = urlParts[1].split('&');
      for (let i = 0; i < paramsParts.length; i++) {
        let paramParts = paramsParts[i].split('=');
        params.set(paramParts[0], paramParts[1]);
      }
    }
    params.set(key, value);
    let newUrl = urlParts[0] + '?';
    params.forEach((value, key) => {
      if (value === '') return;
      newUrl += key + '=' + value + '&';
    });
    newUrl = newUrl.substring(0, newUrl.length - 1);
    window.history.replaceState({}, '', newUrl);
  }

  public static getParam(params: Map<string, string>, key: string): string {
    let value = params.get(key);
    if (value === undefined) return '';
    return decodeURIComponent(value);
  }

  public static convertTimestampToTimeRemaining(date: number): string {
    let hours = Math.floor(date / 3600000);
    let minutes = Math.floor((date % 3600000) / 60000);
    let result = '';
    if (hours > 0) result += hours + ' heure' + (hours > 1 ? 's' : '') + ' ';
    if (minutes > 0)
      result += minutes + ' minute' + (minutes > 1 ? 's' : '') + ' ';
    if (result === '') result = 'Terminé';
    return result;
  }

  public static stringToDateFormat(date: string): Date {
    let dateParts = date.split('/');
    return new Date(
      parseInt(dateParts[0]),
      parseInt(dateParts[1]) - 1,
      parseInt(dateParts[2])
    );
  }

  public static decodeJWTToken(jwtToken: string): string {
    let payload = jwtToken.split('.')[1];
    let decodedPayload = atob(payload);
    let decodedPayloadObject = JSON.parse(decodedPayload);
    return decodedPayloadObject.username;
  }

  public static handleError<ErrorRequest>(operation: any) {
    return (error: any): Observable<ErrorRequest> => {
      return of(Utils.extractError(error) as ErrorRequest);
    };
  }

  public static extractError(error: any): ErrorRequest {
    let errorRequest = new ErrorRequest();
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        errorRequest.message = 'Impossible de se connecter au serveur';
      } else {
        errorRequest.message = error.error.error.message;
      }
    } else {
      errorRequest.message = error.message;
    }
    return errorRequest;
  }
}
