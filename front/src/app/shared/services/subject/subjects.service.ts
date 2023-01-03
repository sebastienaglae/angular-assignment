import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggingService } from '../logging/logging.service';
import { Observable, catchError } from 'rxjs';
import { Subject } from '../../models/subject.model';
import { Utils } from '../../utils/Utils';
import { ErrorRequest } from '../../api/error.model';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root',
})
export class SubjectsService {
  apiUrl = '';
  constructor(
    private _loggingService: LoggingService,
    private _http: HttpClient,
    private _config: ConfigService
  ) {
    this.apiUrl = `${this._config.getServerUrl()}/${
      this._config.getSubject().route
    }`;
  }

  // Fonction qui permet de récupérer tous les matieres
  getAll(): Observable<Subject[] | ErrorRequest> {
    this._loggingService.log('GET ALL');
    return this._http
      .get<Subject[]>(`${this.apiUrl}/`)
      .pipe(catchError(Utils.handleError<ErrorRequest>('subjectAll')));
  }

  // Fonction qui permet de récupérer une matiere en fonction de son id
  get(id: string): Observable<Subject | ErrorRequest> {
    this._loggingService.log(`GET ${id}`);
    return this._http
      .get<Subject>(`${this.apiUrl}/${id}`)
      .pipe(catchError(Utils.handleError<ErrorRequest>('subjectGet')));
  }
}
