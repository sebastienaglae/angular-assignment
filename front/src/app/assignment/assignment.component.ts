import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AssignmentService } from '../shared/services/assignment/assignment.service';
import { Assignment } from '../shared/models/assignment.model';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { SearchAssignment } from '../shared/api/assignment/search.assignment.model';
import { ErrorRequest } from '../shared/api/error.model';
import { LoggingService } from '../shared/services/logging/logging.service';
import { Utils } from '../shared/tools/Utils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentSearch } from '../shared/models/assignment.search.model';
import { SuccessRequest } from '../shared/api/success.model';
import { LoadingService } from '../shared/services/loading/loading.service';
import { BaseComponent } from '../base/base.component';
@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css'],
})
export class AssignmentComponent extends BaseComponent {
  searchAssignment!: SearchAssignment;
  datasource: MatTableDataSource<AssignmentSearch> = new MatTableDataSource();

  filterOptions: FilterOptions = new FilterOptions();

  //@ts-ignore
  @ViewChild('paginator') paginator: MatPaginator;
  //@ts-ignore
  @ViewChild(MatSort) sort: MatSort;
  //@ts-ignore
  displayedColumns: string[] = ['title', 'dueDate', 'hasSubmission', 'hasRating', 'actions'];

  // Add ref of AppComponent to use it in the template
  constructor(
    private _assignementService: AssignmentService,
    private _loggingService: LoggingService,
    snackBar: MatSnackBar,
    loadingService: LoadingService,
  ) {
    super(loadingService, snackBar);
    this.loadingState(true);
  }


  onInit(): void {
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
  }

  ngAfterViewInit() {
    this.loadAssignments();
  }

  // Fonction qui permet de supprimer une devoir
  onDeleteAssignment(id: string) {
    this._loggingService.event();
    this._assignementService.delete(id).subscribe((data) => {
      this.handleDeleteAssignment(data);
    });
  }

  handleDeleteAssignment(data: SuccessRequest | ErrorRequest) {
    if (data instanceof ErrorRequest) {
      this.handleErrorSoft(data)
      return;
    }
    if (!data.success) {
      this.handleErrorSoft('Une erreur est survenue')
      return;
    }

    Utils.snackBarSuccess(this._snackBar, 'Devoir supprimé avec succès');
    this.loadAssignments();
  }

  loadAssignments(): void {
    this._loggingService.event();
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loadingState(true)
          return this._assignementService.search(this.getFilter(), this.getOrder(), {
            page: this.paginator.pageIndex,
            limit: this.paginator.pageSize,
          });
        }),
        map((data) => {
          if (data instanceof ErrorRequest) {
            this.paginator.length = 0;
            this.handleError(data)
            return [];
          }
          this.paginator.length = data.totalItems;
          this.loadingState(false)
          return data.items;
        }),
        catchError(() => {
          return observableOf([]);
        })
      )
      .subscribe((data) => {
        this.datasource.data = data;
      });
  }

  // Fonction qui permet de filtrer les données
  getOrder() {
    if (this.sort.direction === '') {
      return null;
    }

    const column = this.sort.active;
    const direction = this.sort.direction === 'asc' ? 1 : -1;

    return { [column]: direction };
  }

  // Fonction qui permet de filtrer les données
  getFilter() {
    let json = {}
    if (this.filterOptions.searchText !== '') {
      json = { ...json, ...{ title: this.filterOptions.searchText } }
    }
    if (this.filterOptions.submitFilter !== undefined) {
      json = { ...json, ...{ submission: this.filterOptions.submitFilter === 'submit' ? null : false } }
    }
    if (this.filterOptions.ratingFilter !== undefined) {
      json = { ...json, ...{ rating: this.filterOptions.ratingFilter === 'rated' ? null : false } }
    }
    // todo check if it's right
    if (this.filterOptions.yearFilter !== undefined) {
      json = { ...json, ...{ year: this.filterOptions.yearFilter } }
    }
    if (this.filterOptions.monthFilter !== undefined) {
      json = { ...json, ...{ month: this.filterOptions.monthFilter } }
    }

    return json;
  }
}

class FilterOptions {
  searchText: string = '';
  submitFilter: string | undefined = undefined;
  ratingFilter: string | undefined = undefined;
  yearFilter: number | undefined = undefined;
  monthFilter: number | undefined = undefined;

  getSearchFilter(): string {
    return this.searchText.trim().toLowerCase();
  }
}
