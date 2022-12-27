import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggingService } from '../logging/logging.service';
import { Observable } from 'rxjs';
import { Subject } from '../../models/subject.model';
import { ResultSubject } from '../../api/subject/result.subject.model';
import { Config } from '../../tools/Config';

@Injectable({
  providedIn: 'root',
})
export class SubjectsService {
  apiUrl = `http://${Config.data.server.host}:${Config.data.server.port}/subjects`;
  constructor(
    private loggingService: LoggingService,
    private http: HttpClient
  ) {}

  getAll(): Observable<Subject[]> {
    this.loggingService.log('SubjectsService', 'GET ALL');
    return this.http.get<Subject[]>(`${this.apiUrl}/`);
  }

  get(id: string): Observable<ResultSubject> {
    this.loggingService.log('Subject', `GET ${id}`);
    return this.http.get<ResultSubject>(`${this.apiUrl}/${id}`);
  }
}
