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
import { AuthService } from '../auth/auth.service';
import { Rating } from '../../models/rating.model';
import { Submission } from '../../models/submission.model';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  apiUrl = `${Config.getServerUrl()}/${Config.assignment.route}`;
  constructor(
    private loggingService: LoggingService,
    private authService: AuthService,
    private http: HttpClient
  ) { }

  // Fonction qui permet de récupérer tous les assignments avec pagination et tri
  search(
    filter?: any,
    order?: any, pagi?: {
      page: number;
      limit: number;
    }): Observable<SearchAssignment | ErrorRequest> {
    this.loggingService.log(
      `GET SEARCH`
    );
    //TODO OFFSET
    if (pagi !== undefined)
      pagi.page += 1;

    const query = Utils.searchFilterOrderPagination(filter, order, pagi);

    return this.http
      .get<SearchAssignment>(`${this.apiUrl}/search${query}`)
      .pipe(catchError(Utils.handleError<ErrorRequest>('assignmentSearch')));
  }

  // Fonction qui permet de récupérer un assignment en fonction de son id
  get(id: string): Observable<Assignment | ErrorRequest> {
    this.loggingService.log(`GET ${id}`);
    return this.http
      .get<Assignment>(`${this.apiUrl}/${id}`)
      .pipe(catchError(Utils.handleError<ErrorRequest>('assignmentGet')));
  }

  // Fonction qui permet de créer un assignment
  create(assignment: Assignment): Observable<Assignment | ErrorRequest> {
    this.loggingService.log(`POST ${assignment.id}`);
    return this.http
      .post<Assignment>(`${this.apiUrl}/create`, assignment,
        Utils.httpOptionsToken(this.authService.getToken()))
      .pipe(catchError(Utils.handleError<ErrorRequest>('assignmentAdd')));
  }

  delete(id: string): Observable<SuccessRequest | ErrorRequest> {
    this.loggingService.log(`DELETE ${id}`);
    return this.http
      .delete<SuccessRequest>(`${this.apiUrl}/${id}`, Utils.httpOptionsToken(this.authService.getToken()))
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
    this.loggingService.log(`PUT ASSIGNMENT ${assignment.id}`);
    return this.http
      .put<SuccessRequest>(
        `${this.apiUrl}/${assignment.id}/info`,
        assignment
      )
      .pipe(catchError(Utils.handleError<ErrorRequest>('assignmentUpdateAssignment')));
  }

  // Fonction qui permet de mettre à jour un assignment
  updateRating(id: string, rating: Rating) {
    this.loggingService.log(`PUT RATING ${id}`);
    return this.http
      .put<SuccessRequest>(
        `${this.apiUrl}/${id}/rating`,
        rating,
        Utils.httpOptionsToken(this.authService.getToken())
      )
      .pipe(catchError(Utils.handleError<ErrorRequest>('assignmentUpdateRating')));
  }

  // Fonction qui permet de mettre à jour un assignment
  updateSubmission(id: string | undefined, submission: Submission, file: File) {
    if (id === undefined) {
      let error = new ErrorRequest();
      error.name = 'AssignmentService';
      error.message = 'Assignment id is undefined';
      return of(error);
    }
    this.loggingService.log(`PUT SUBMISSION ${id}`);
    let formData = new FormData();
    formData.append('submission', file, file.name);
    formData.append('submission', JSON.stringify(submission));

    return this.http
      .put<SuccessRequest>(
        `${this.apiUrl}/${id}/submission`,
        formData,
        {
          headers: new HttpHeaders({
            'Authorization': `Bearer ${this.authService.getToken()}`
          })
        }).pipe(
          catchError(Utils.handleError<ErrorRequest>('assignmentUpdateSubmission'))
        );
  }
}
