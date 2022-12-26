import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Assignment } from '../../models/assignment.model';
import { LoggingService } from '../logging/logging.service';
import { SearchAssignment } from '../../api/assignment/search.assignment.model';
import { ResultAssignment } from '../../api/assignment/result.assignment.model';
import { CreateAssignment } from '../../api/assignment/create.assignment.model';
import { DeleteAssignment } from '../../api/assignment/delete.assignment.model';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  apiUrl = 'http://localhost:3000/assignments';
  constructor(
    private loggingService: LoggingService,
    private http: HttpClient
  ) {}

  search(options: {
    page: number;
    pageOffset: number;
    pageSize: number;
  }): Observable<SearchAssignment> {
    this.loggingService.log('AssignmentService', 'GET ALL');
    return this.http.get<SearchAssignment>(
      `${this.apiUrl}/search?page=${options.page + options.pageOffset}&limit=${
        options.pageSize
      }`
    );
  }

  get(id: string): Observable<ResultAssignment> {
    this.loggingService.log('AssignmentService', `GET ${id}`);
    return this.http.get<ResultAssignment>(`${this.apiUrl}/${id}`);
  }

  add(assignment: Assignment): Observable<CreateAssignment> {
    this.loggingService.log('AssignmentService', `POST ${assignment._id}`);
    return this.http.post<CreateAssignment>(
      `${this.apiUrl}/create`,
      assignment
    );
  }

  delete(id: string): Observable<DeleteAssignment> {
    this.loggingService.log('AssignmentService', `DELETE ${id}`);
    return this.http.delete<DeleteAssignment>(`${this.apiUrl}/${id}`);
  }

  deleteAll(): Observable<string> {
    throw new Error('Method not implemented.');
  }

  updateAssignment(assignment?: Assignment): Observable<string> {
    if (assignment === undefined)
      return of('No assignment deleted, empty assignment');

    this.loggingService.log(assignment.title, `PUT ${assignment._id}`);
    return this.http.put<string>(`${this.apiUrl}`, assignment);
  }
}
