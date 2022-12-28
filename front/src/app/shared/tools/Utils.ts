import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ErrorRequest } from '../api/error.model';
import { Buffer } from 'buffer';
import { MatSnackBar } from '@angular/material/snack-bar';

export abstract class Utils {
  // Fonction qui permet de recupperer les parametres de l'url dans une map
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

  // Fonction qui permet de comparer deux valeurs
  public static compare(
    a: number | string,
    b: number | string,
    isAsc: boolean
  ): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  // Fonction qui permet de comparer deux dates
  public static compareDate(a: Date, b: Date, isAsc: boolean): number {
    return (a.getTime() < b.getTime() ? -1 : 1) * (isAsc ? 1 : -1);
  }

  // Fonction qui retourne une date aléatoire
  public static randomDate(startYear: number, endYear: number): Date {
    let date = new Date(
      startYear + Math.random() * (endYear - startYear),
      Math.random() * 12,
      Math.random() * 28
    );
    return date;
  }

  // Fonction qui permet de mettre à jour un paramètre dans l'url
  public static updateParam(key: string, value: string): void {
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
    params.forEach((value, key): void => {
      if (value === '') return;
      newUrl += key + '=' + value + '&';
    });
    newUrl = newUrl.substring(0, newUrl.length - 1);
    window.history.replaceState({}, '', newUrl);
  }

  // Fonction qui retourne un paramètre de l'url
  public static getParam(params: Map<string, string>, key: string): string {
    let value = params.get(key);
    if (value === undefined) return '';
    return decodeURIComponent(value);
  }

  // Fonction qui converti un timestamp en temps restant
  public static convertTimestampToTimeRemaining(timestamp: number): string {
    let hours = Math.floor(timestamp / 3600000);
    let minutes = Math.floor((timestamp % 3600000) / 60000);
    let result = '';
    if (hours > 0) result += hours + ' heure' + (hours > 1 ? 's' : '') + ' ';
    if (minutes > 0)
      result += minutes + ' minute' + (minutes > 1 ? 's' : '') + ' ';
    if (result === '') result = 'Terminé';
    return result;
  }

  // Fonction qui converti un string en date
  public static stringToDateFormat(date: string): Date {
    let dateParts = date.split('/');
    return new Date(
      parseInt(dateParts[0]),
      parseInt(dateParts[1]) - 1,
      parseInt(dateParts[2])
    );
  }

  // Fonction qui decode un token JWT et retourne le payload en json
  public static decodeJWTToken(jwtToken: string): any {
    let payload = jwtToken.split('.')[1];
    let decodedPayload = atob(payload);
    let decodedPayloadObject = JSON.parse(decodedPayload);
    return decodedPayloadObject;
  }

  // Fonction qui traite les erreurs
  public static handleError<ErrorRequest>(
    operation: any
  ): (error: any) => Observable<ErrorRequest> {
    return (error: any): Observable<ErrorRequest> => {
      return of(Utils.extractError(error) as ErrorRequest);
    };
  }

  // Fonction qui extrait l'erreur dans un objet ErrorRequest
  public static extractError(error: any): ErrorRequest {
    let errorRequest = new ErrorRequest();
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        errorRequest.message = 'Erreur de connexion';
      } else if (error.status === 401) {
        errorRequest.message = "Erreur d'authentification";
        errorRequest.needAuth = true;
      } else {
        errorRequest.message = error.error.error.message;
      }
    } else {
      errorRequest.message = error.message;
    }
    return errorRequest;
  }

  public static textPreview(text: string, length: number): string {
    if (text.length > length) {
      return text.substring(0, length) + '...';
    }
    return text;
  }

  public static bufferToFile(buffer: ArrayBuffer): File {
    let blob = new Blob([buffer]);
    return new File([blob], 'file');
  }

  public static fileToArrayBuffer(
    file: File,
    callback: (buffer: Buffer) => void
  ): void {
    let reader = new FileReader();
    reader.onload = function (e: any) {
      const arrayBuffer = e.target.result;
      let buffer = Buffer.from(arrayBuffer);

      callback(buffer);
    };
    reader.readAsArrayBuffer(file);
  }

  public static snackBarError(
    _snackBar: MatSnackBar,
    message: string | ErrorRequest
  ) {
    const errorMessage =
      typeof message === 'string' ? message : message.message;
    _snackBar.open(errorMessage, 'Fermer', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }

  public static snackBarSuccess(_snackBar: MatSnackBar, message: string) {
    _snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: ['success-snackbar'],
    });
  }

  public static httpOptionsToken(token: string | null): {
    headers: HttpHeaders;
  } {
    if (!token) return { headers: new HttpHeaders() };
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      }),
    };
  }
}
