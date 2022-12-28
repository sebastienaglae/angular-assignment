import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggingService } from '../logging/logging.service';
import { Observable, catchError } from 'rxjs';
import { Subject } from '../../models/subject.model';
import { Config } from '../../tools/Config';
import { Utils } from '../../tools/Utils';
import { ErrorRequest } from '../../api/error.model';

@Injectable({
  providedIn: 'root',
})
export class SubjectsService {
  apiUrl = `${Config.getServerUrl()}/${Config.subject.route}`;
  constructor(
    private loggingService: LoggingService,
    private http: HttpClient
  ) {}

  // Fonction qui permet de récupérer tous les matieres
  getAll(): Observable<Subject[] | ErrorRequest> {
    this.loggingService.log('SubjectsService', 'GET ALL');
    return this.http
      .get<Subject[]>(`${this.apiUrl}/`)
      .pipe(catchError(Utils.handleError<ErrorRequest>('subjectAll')));
  }

  // Fonction qui permet de récupérer une matiere en fonction de son id
  get(id: string): Observable<Subject | ErrorRequest> {
    this.loggingService.log('Subject', `GET ${id}`);
    return this.http
      .get<Subject>(`${this.apiUrl}/${id}`)
      .pipe(catchError(Utils.handleError<ErrorRequest>('subjectGet')));
  }
}
