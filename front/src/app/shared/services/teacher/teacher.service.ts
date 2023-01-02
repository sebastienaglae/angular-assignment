import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { ErrorRequest } from '../../api/error.model';
import { Config } from '../../utils/Config';
import { Utils } from '../../utils/Utils';
import { LoggingService } from '../logging/logging.service';
import { Teacher } from '../../models/teacher.model';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  apiUrl = `${Config.getServerUrl()}/${Config.teacher.route}`;
  constructor(
    private loggingService: LoggingService,
    private http: HttpClient
  ) {}

  // Fonction qui permet de récupérer tout les professeurs
  getAll(): Observable<Teacher[] | ErrorRequest> {
    this.loggingService.log(`GET SEARCH`);

    return this.http
      .get<Teacher[]>(`${this.apiUrl}/search`)
      .pipe(catchError(Utils.handleError<ErrorRequest>('assignmentSearch')));
  }

  // Fonction qui permet de récupérer une matiere en fonction de son id
  get(id: string): Observable<Teacher | ErrorRequest> {
    this.loggingService.log(`GET ${id}`);
    return this.http
      .get<Teacher>(`${this.apiUrl}/${id}`)
      .pipe(catchError(Utils.handleError<ErrorRequest>('teacherGet')));
  }
}
