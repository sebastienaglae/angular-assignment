import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Assignment } from './shared/assignment.model';
import { LoggingService } from './shared/logging.service';
import { SearchAssignment } from './shared/api/assignment/search.model';
import { ResultAssignment } from './shared/api/assignment/result.model';
import { CreateAssignment } from './shared/api/assignment/create.model';
import { DeleteAssignment } from './shared/api/assignment/delete.model';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  apiUrl = 'http://localhost:3000/assignments';
  constructor(
    private loggingService: LoggingService,
    private http: HttpClient
  ) {}

  getAssignments(): Observable<SearchAssignment> {
    this.loggingService.log('AssignmentService', 'GET ALL');
    return this.http.get<SearchAssignment>(`${this.apiUrl}/search`);
  }

  getAssignment(id: string): Observable<ResultAssignment> {
    this.loggingService.log('AssignmentService', `GET ${id}`);
    return this.http.get<ResultAssignment>(`${this.apiUrl}/${id}`);
  }

  addAssignment(assignment: Assignment): Observable<CreateAssignment> {
    this.loggingService.log('AssignmentService', `POST ${assignment._id}`);
    return this.http.post<CreateAssignment>(
      `${this.apiUrl}/create`,
      assignment
    );
  }

  deleteAssignment(id: string): Observable<DeleteAssignment> {
    this.loggingService.log('AssignmentService', `DELETE ${id}`);
    return this.http.delete<DeleteAssignment>(`${this.apiUrl}/${id}`);
  }

  deleteAll(): Observable<string> {
    this.getAssignments().subscribe((assignments) => {
      assignments.items.forEach((assignment) => {
        this.deleteAssignment(assignment._id).subscribe((data) => {
          console.log(data);
        });
      });
    });
    return of('All assignments deleted');
  }

  updateAssignment(assignment?: Assignment): Observable<string> {
    if (assignment === undefined)
      return of('No assignment deleted, empty assignment');

    this.loggingService.log(assignment.title, `PUT ${assignment._id}`);
    return this.http.put<string>(`${this.apiUrl}`, assignment);
  }
}
