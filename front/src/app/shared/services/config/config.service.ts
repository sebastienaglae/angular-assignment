import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { Observable } from 'rxjs';
import { AssignmentAddComponent } from 'src/app/assignment/assignment-add/assignment-add.component';
import { AssignmentDetailComponent } from 'src/app/assignment/assignment-detail/assignment-detail.component';
import { AssignmentGenComponent } from 'src/app/assignment/assignment-gen/assignment-gen.component';
import { AssignmentModifyComponent } from 'src/app/assignment/assignment-modify/assignment-modify.component';
import { AssignmentRateComponent } from 'src/app/assignment/assignment-rate/assignment-rate.component';
import { AssignmentSubmitComponent } from 'src/app/assignment/assignment-submit/assignment-submit.component';
import { AssignmentComponent } from 'src/app/assignment/assignment.component';
import { ConnexionComponent } from 'src/app/connexion/connexion.component';
import { RegisterComponent } from 'src/app/register/register.component';
import { TeacherDetailComponent } from 'src/app/teacher/teacher-detail/teacher-detail.component';
import { AuthGuard } from '../auth/auth.guard';
import { DebugComponent } from 'src/app/debug/debug/debug.component';

export const configFactory = (
  config: ConfigService
): (() => Observable<any>) => {
  return () => config.loadConfig();
};
@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: any;

  constructor(private _http: HttpClient, private router: Router) {}

  loadConfig(): Observable<boolean> {
    return new Observable((observer) => {
      this._http.get('assets/json/config.json').subscribe((config: any) => {
        this.config = config;
        this.router.resetConfig(getRoutes(this));
        observer.next(true);
        observer.complete();
      });
    });
  }

  getConfig() {
    return this.config;
  }

  setConfig(config: any) {
    this.config = config;
  }

  getServerUrl(): string {
    return `${this.config.server.transport}://${this.config.server.host}:${this.config.server.port}`;
  }

  getServer() {
    return this.config.server;
  }

  getAuth() {
    return this.config.auth;
  }

  getSubject() {
    return this.config.subject;
  }

  getTeacher() {
    return this.config.teacher;
  }

  getAssignment() {
    return this.config.assignment;
  }

  getPermsPath() {
    return this.config.permsPath;
  }
}

export function getRoutes(config: ConfigService): Routes {
  const routes: Routes = [
    {
      path: config.getPermsPath()['home'].path,
      component: AssignmentComponent,
    },
    {
      path: config.getPermsPath()['addAss'].path,
      component: AssignmentAddComponent,
      canActivate: [AuthGuard],
    },
    {
      path: config.getPermsPath()['getAss'].path,
      component: AssignmentDetailComponent,
      canActivate: [AuthGuard],
    },
    {
      path: config.getPermsPath()['gen'].path,
      component: AssignmentGenComponent,
      canActivate: [AuthGuard],
    },
    {
      path: config.getPermsPath()['editAss'].path,
      component: AssignmentModifyComponent,
      canActivate: [AuthGuard],
    },
    {
      path: config.getPermsPath()['submitAss'].path,
      component: AssignmentSubmitComponent,
      canActivate: [AuthGuard],
    },
    {
      path: config.getPermsPath()['rateAss'].path,
      component: AssignmentRateComponent,
      canActivate: [AuthGuard],
    },
    {
      path: config.getPermsPath()['login'].path,
      component: ConnexionComponent,
      canActivate: [AuthGuard],
    },
    {
      path: config.getPermsPath()['register'].path,
      component: RegisterComponent,
      canActivate: [AuthGuard],
    },
    {
      path: config.getPermsPath()['getTeacher'].path,
      component: TeacherDetailComponent,
      canActivate: [AuthGuard],
    },
    {
      path: config.getPermsPath()['debug'].path,
      component: DebugComponent,
      canActivate: [AuthGuard],
    },
  ];

  return routes;
}
