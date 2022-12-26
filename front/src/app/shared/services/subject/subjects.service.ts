import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggingService } from '../logging/logging.service';
import { Observable } from 'rxjs';
import { Subject } from '../../api/subject/subject.model';

@Injectable({
  providedIn: 'root',
})
export class SubjectsService {
  apiUrl = 'http://localhost:3000/subjects';
  constructor(
    private loggingService: LoggingService,
    private http: HttpClient
  ) {}

  getAssignments(): Observable<Subject[]> {
    this.loggingService.log('SubjectsService', 'GET ALL');
    return this.http.get<Subject[]>(`${this.apiUrl}/`);
  }

  getAssignment(id: string): Observable<Subject> {
    this.loggingService.log('Subject', `GET ${id}`);
    return this.http.get<Subject>(`${this.apiUrl}/${id}`);
  }
}
