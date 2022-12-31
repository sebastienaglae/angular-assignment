import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ErrorRequest } from '../api/error.model';
import { Buffer } from 'buffer';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingService } from '../services/loading/loading.service';

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
    if (value === undefined) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    let newUrl = urlParts[0] + '?';
    params.forEach((value, key): void => {
      if (value === '') return;
      newUrl += key + '=' + value + '&';
    });
    newUrl = newUrl.substring(0, newUrl.length - 1);
    window.history.replaceState({}, '', newUrl);
  }

  // Fonction qui retourne un paramètre de l'url
  public static getParam(params: Map<string, string>, key: string): string | undefined {
    let value = params.get(key);
    if (value === undefined) return '';
    return decodeURIComponent(value);
  }

  static getParamNumber(params: Map<string, string>, key: string) {
    let value = params.get(key);
    if (value === undefined) return undefined;
    return parseInt(decodeURIComponent(value));
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

  private static snackBarError(
    snackBar: MatSnackBar,
    message: string | ErrorRequest
  ) {
    const errorMessage =
      typeof message === 'string' ? message : message.message;
    snackBar.open(errorMessage, 'Fermer', {
      panelClass: ['error-snackbar'],
    });
  }

  public static snackBarSuccess(_snackBar: MatSnackBar, message: string) {
    _snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: ['success-snackbar'],
    });
  }

  public static frontError(_snackBar: MatSnackBar, errorRequest: ErrorRequest | string, loadingService: LoadingService) {
    loadingService.error();
    this.snackBarError(_snackBar, errorRequest);
  }

  public static frontErrorSoft(_snackBar: MatSnackBar, errorRequest: ErrorRequest | string, loadingService: LoadingService) {
    loadingService.errorSoft();
    this.snackBarError(_snackBar, errorRequest);
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

  public static searchFilterOrderPagination(
    filter?: any,
    order?: any,
    pagination?: any
  ): string {
    let query: Map<string, string> = new Map();
    if (filter) {
      query.set('filter', encodeURIComponent(JSON.stringify(filter)));
    }
    if (order) {
      query.set('order', encodeURIComponent(JSON.stringify(order)));
    }
    if (pagination) {
      for (const key in pagination) {
        if (pagination.hasOwnProperty(key)) {
          const value = pagination[key];
          query.set(key, value);
        }
      }
    }

    return Utils.mapToQueryParams(query);
  }

  public static mapToQueryParams(map: Map<string, string>): string {
    let queryString = '?';
    map.forEach((value, key) => {
      queryString += key + '=' + value + '&';
    });
    queryString = queryString.substring(0, queryString.length - 1);
    return queryString;
  }
}
