import { Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AssignmentComponent } from './assignment/assignment.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterModule } from '@angular/router';
import { ConnexionComponent } from './connexion/connexion.component';
import { RegisterComponent } from './register/register.component';
import { AssignmentDetailComponent } from './assignment/assignment-detail/assignment-detail.component';
import { AssignmentAddComponent } from './assignment/assignment-add/assignment-add.component';
import { AssignmentModifyComponent } from './assignment/assignment-modify/assignment-modify.component';
import { AssignmentGenComponent } from './assignment/assignment-gen/assignment-gen.component';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import {
  NgxMatTimepickerModule,
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
} from '@angular-material-components/datetime-picker';
import { MatExpansionModule } from '@angular/material/expansion';
import { AssignmentSubmitComponent } from './assignment/assignment-submit/assignment-submit.component';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { CdkColumnDef } from '@angular/cdk/table';
import { AssignmentRateComponent } from './assignment/assignment-rate/assignment-rate.component';
import { MatMenuModule } from '@angular/material/menu';
import { TeacherDetailComponent } from './teacher/teacher-detail/teacher-detail.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { SizePipe } from './shared/tools/SizePipe'
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { BottomSheetAssignmentOptions } from './assignment/assignment-detail/assignment-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    AssignmentComponent,
    ConnexionComponent,
    RegisterComponent,
    AssignmentDetailComponent,
    AssignmentAddComponent,
    AssignmentModifyComponent,
    AssignmentGenComponent,
    AssignmentSubmitComponent,
    AssignmentRateComponent,
    TeacherDetailComponent,
    SizePipe,
    BottomSheetAssignmentOptions
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatCardModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatInputModule,
    MatCheckboxModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatSlideToggleModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatStepperModule,
    NgxMatTimepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    MatExpansionModule,
    NgxMatFileInputModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatTabsModule,
    MatMenuModule,
    MatBadgeModule,
    MatChipsModule,
    MatBottomSheetModule,
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
    {
      provide: CdkColumnDef,
    },
  ],
  bootstrap: [AppComponent],
  exports: [AppRoutingModule],
})
export class AppModule { }
