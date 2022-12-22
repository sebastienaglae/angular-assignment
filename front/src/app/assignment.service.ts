import { HttpClient } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Assignment } from './shared/assignment.model';
import { LoggingService } from './shared/logging.service';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  url = 'http://localhost:8010/api/assignments';
  constructor(
    private loggingService: LoggingService,
    private http: HttpClient
  ) {}

  getAssignments(): Observable<Assignment[]> {
    this.loggingService.log('AssignmentService', 'GETS');

    return this.http.get<Assignment[]>(this.url);
  }

  getAssignment(uuid: string): Observable<Assignment | undefined> {
    this.loggingService.log('AssignmentService', 'GET');
    return this.http.get<Assignment>(`${this.url}/${uuid}`);
  }

  addAssignment(assignment: Assignment): Observable<string> {
    this.loggingService.log('AssignmentService', 'POST');
    return this.http.post<string>(this.url, assignment);
  }

  deleteAssignment(assignment?: Assignment): Observable<string> {
    if (assignment === undefined)
      return of('No assignment deleted, empty assignment');
    this.loggingService.log('AssignmentService', 'DELETE');
    return this.http.delete<string>(`${this.url}/${assignment._id}`);
  }

  updateAssignment(assignment?: Assignment): Observable<string> {
    if (assignment === undefined)
      return of('No assignment deleted, empty assignment');

    this.loggingService.log(assignment.nom, 'UPDATE');
    return this.http.put<string>(`${this.url}`, assignment);
  }
}
