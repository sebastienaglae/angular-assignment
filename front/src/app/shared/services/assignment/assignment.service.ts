import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { Assignment } from '../../models/assignment.model';
import { LoggingService } from '../logging/logging.service';
import { SearchAssignment } from '../../api/assignment/search.assignment.model';
import { Config } from '../../tools/Config';
import { ErrorRequest } from '../../api/error.model';
import { Utils } from '../../tools/Utils';
import { SuccessRequest } from '../../api/success.model';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  apiUrl = `${Config.getServerUrl()}/${Config.assignment.route}`;
  constructor(
    private loggingService: LoggingService,
    private http: HttpClient
  ) {}

  // Fonction qui permet de récupérer tous les assignments avec pagination et tri
  search(options: {
    page: number;
    pageOffset: number;
    pageSize: number;
  }): Observable<SearchAssignment | ErrorRequest> {
    this.loggingService.log(
      'AssignmentService',
      `GET ALL page ${options.page + options.pageOffset} pageSize ${
        options.pageSize
      }`
    );
    return this.http
      .get<SearchAssignment>(
        `${this.apiUrl}/search?page=${
          options.page + options.pageOffset
        }&limit=${options.pageSize}`
      )
      .pipe(catchError(Utils.handleError<ErrorRequest>('assignmentSearch')));
  }

  // Fonction qui permet de récupérer un assignment en fonction de son id
  get(id: string): Observable<Assignment | ErrorRequest> {
    this.loggingService.log('AssignmentService', `GET ${id}`);
    return this.http
      .get<Assignment>(`${this.apiUrl}/${id}`)
      .pipe(catchError(Utils.handleError<ErrorRequest>('assignmentGet')));
  }

  // Fonction qui permet de créer un assignment
  add(assignment: Assignment): Observable<Assignment | ErrorRequest> {
    this.loggingService.log('AssignmentService', `POST ${assignment._id}`);
    return this.http
      .post<Assignment>(`${this.apiUrl}/create`, assignment)
      .pipe(catchError(Utils.handleError<ErrorRequest>('assignmentAdd')));
  }

  delete(id: string): Observable<SuccessRequest | ErrorRequest> {
    this.loggingService.log('AssignmentService', `DELETE ${id}`);
    return this.http
      .delete<SuccessRequest>(`${this.apiUrl}/${id}`)
      .pipe(catchError(Utils.handleError<ErrorRequest>('assignmentDelete')));
  }

  deleteAll(): Observable<SuccessRequest> {
    // TODO : implement
    throw new Error('Method not implemented.');
  }

  // Fonction qui permet de mettre à jour un assignment
  updateAssignment(
    assignment?: Assignment
  ): Observable<SuccessRequest | ErrorRequest> {
    if (assignment === undefined) {
      let error = new ErrorRequest();
      error.name = 'AssignmentService';
      error.message = 'Assignment is undefined';
      return of(error);
    }

    this.loggingService.log(assignment.title, `PUT ${assignment._id}`);
    return this.http
      .put<SuccessRequest>(`${this.apiUrl}`, assignment)
      .pipe(catchError(Utils.handleError<ErrorRequest>('assignmentUpdate')));
  }
}
