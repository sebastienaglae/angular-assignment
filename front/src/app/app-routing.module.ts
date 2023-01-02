import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { ConnexionComponent } from './connexion/connexion.component';
import { RegisterComponent } from './register/register.component';
import { AssignmentModifyComponent } from './assignment/assignment-modify/assignment-modify.component';
import { AssignmentAddComponent } from './assignment/assignment-add/assignment-add.component';
import { AssignmentComponent } from './assignment/assignment.component';
import { AssignmentDetailComponent } from './assignment/assignment-detail/assignment-detail.component';
import { AuthGuard } from './shared/services/auth/auth.guard';
import { AssignmentGenComponent } from './assignment/assignment-gen/assignment-gen.component';
import { AssignmentSubmitComponent } from './assignment/assignment-submit/assignment-submit.component';
import { AssignmentRateComponent } from './assignment/assignment-rate/assignment-rate.component';
import { TeacherDetailComponent } from './teacher/teacher-detail/teacher-detail.component';
import { Config } from './shared/utils/Config';

const routes: Routes = [
  { path: Config.permsPath['home'].path, component: AssignmentComponent },
  {
    path: Config.permsPath['addAss'].path,
    component: AssignmentAddComponent,
    canActivate: [AuthGuard],
  },
  {
    path: Config.permsPath['getAss'].path,
    component: AssignmentDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: Config.permsPath['gen'].path,
    component: AssignmentGenComponent,
    canActivate: [AuthGuard],
  },
  {
    path: Config.permsPath['editAss'].path,
    component: AssignmentModifyComponent,
    canActivate: [AuthGuard],
  },
  {
    path: Config.permsPath['submitAss'].path,
    component: AssignmentSubmitComponent,
    canActivate: [AuthGuard],
  },
  {
    path: Config.permsPath['rateAss'].path,
    component: AssignmentRateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: Config.permsPath['login'].path,
    component: ConnexionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: Config.permsPath['register'].path,
    component: RegisterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: Config.permsPath['getTeacher'].path,
    component: TeacherDetailComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
