import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ErrorRequest } from '../api/error.model';
import { Buffer } from 'buffer';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { BaseDialog } from 'src/app/base/base.dialog';
import { Assignment } from '../models/assignment.model';

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

  // Fonction qui permet de mettre à jour les parametres de l'url
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
  public static getParam(
    params: Map<string, string>,
    key: string
  ): string | undefined {
    let value = params.get(key);
    if (value === undefined) return '';
    return decodeURIComponent(value);
  }

  // Fonction qui retourne un paramètre de l'url
  static getParamNumber(params: Map<string, string>, key: string) {
    let value = params.get(key);
    if (value === undefined) return undefined;
    return parseInt(decodeURIComponent(value));
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

  // Fonction qui retourne un texte tronqué
  public static textPreview(text: string, length: number): string {
    if (text.length > length) {
      return text.substring(0, length) + '...';
    }
    return text;
  }

  // Fonction qui converti un buffer en fichier
  public static bufferToFile(buffer: ArrayBuffer): File {
    let blob = new Blob([buffer]);
    return new File([blob], 'file');
  }

  // Fonction qui converti un fichier en buffer
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

  // Fonction qui affiche un snackbar d'erreur
  public static snackBarError(
    snackBar: MatSnackBar,
    message: string | ErrorRequest
  ) {
    const errorMessage =
      typeof message === 'string' ? message : message.message;
    snackBar.open(errorMessage, 'Fermer', {
      panelClass: ['error-snackbar'],
    });
  }

  // Fonction qui affiche un snackbar de succès
  public static snackBarSuccess(_snackBar: MatSnackBar, message: string) {
    _snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: ['success-snackbar'],
    });
  }

  // Fonction qui retourne les options http avec le token
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

  // Fonction qui converti un map en query params
  public static searchFilterOrderPagination(
    filter?: any,
    order?: any,
    pagination?: any
  ): string {
    let query: Map<string, string> = new Map();
    if (filter && Object.keys(filter).length !== 0) {
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

  // Fonction qui converti un map en query params
  public static mapToQueryParams(map: Map<string, string>): string {
    let queryString = '?';
    map.forEach((value, key) => {
      queryString += key + '=' + value + '&';
    });
    queryString = queryString.substring(0, queryString.length - 1);
    return queryString;
  }

  // Fonction qui ouvre une boite de dialogue
  public static openDialog(
    dialog: MatDialog,
    title: string,
    content: string | any,
    yesNo: boolean = false
  ) {
    return dialog.open(BaseDialog, {
      width: '250px',
      data: { title, content, yesNo },
    });
  }

  // Fonction qui permet de retourner selon une année ou un mois l'interval de temps en data
  public static getIntervalTime(year: any, month: any = null): any {
    if (year < 1970) return null;
    if (!year) return null;
    year = parseInt(year);

    let start;
    let end;
    if (month) {
      month = parseInt(month);
      start = new Date(year, month - 1, 1);
      end = new Date(year, month, 0);
    } else {
      start = new Date(year, 0, 1);
      end = new Date(year, 11, 31);
    }
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    if (
      start.toString() === 'Invalid Date' ||
      end.toString() === 'Invalid Date'
    )
      return null;

    return { start, end };
  }

  // Fonction qui formatte un devoir
  public static formatAssignment(assignment: Assignment): any[] {
    let formattedAssignment = [];
    formattedAssignment.push({ title: 'Titre', value: assignment.title });
    formattedAssignment.push({
      title: 'Date de rendu',
      value: assignment.dueDate,
    });
    formattedAssignment.push({
      title: 'Date de création',
      value: assignment.createdAt,
    });
    formattedAssignment.push({
      title: 'Date de modification',
      value: assignment.updatedAt,
    });

    return formattedAssignment;
  }
}
