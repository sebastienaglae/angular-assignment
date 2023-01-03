import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { ErrorRequest } from '../../api/error.model';
import { Utils } from '../../utils/Utils';
import { LoggingService } from '../logging/logging.service';
import { Teacher } from '../../models/teacher.model';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  apiUrl = '';
  constructor(
    private _loggingService: LoggingService,
    private _http: HttpClient,
    private _config: ConfigService
  ) {
    this.apiUrl = `${_config.getServerUrl()}/${_config.getTeacher().route}`;
  }

  // Fonction qui permet de récupérer tout les professeurs
  getAll(): Observable<Teacher[] | ErrorRequest> {
    this._loggingService.log(`GET SEARCH`);

    return this._http
      .get<Teacher[]>(`${this.apiUrl}/search`)
      .pipe(catchError(Utils.handleError<ErrorRequest>('assignmentSearch')));
  }

  // Fonction qui permet de récupérer une matiere en fonction de son id
  get(id: string): Observable<Teacher | ErrorRequest> {
    this._loggingService.log(`GET ${id}`);
    return this._http
      .get<Teacher>(`${this.apiUrl}/${id}`)
      .pipe(catchError(Utils.handleError<ErrorRequest>('teacherGet')));
  }
}
