import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { AssignmentService } from '../shared/services/assignment/assignment.service';
import { Assignment } from '../shared/models/assignment.model';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { SearchAssignment } from '../shared/api/assignment/search.assignment.model';
import { ErrorRequest } from '../shared/api/error.model';
import { LoggingService } from '../shared/services/logging/logging.service';
import { Utils } from '../shared/utils/Utils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentSearch } from '../shared/models/assignment.search.model';
import { SuccessRequest } from '../shared/api/success.model';
import { LoadingService } from '../shared/services/loading/loading.service';
import { BaseComponent } from '../base/base.component';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css'],
})
export class AssignmentComponent extends BaseComponent implements OnInit {
  searchAssignment!: SearchAssignment;
  datasource: MatTableDataSource<AssignmentSearch> = new MatTableDataSource();

  filterOptions: FilterOptions = new FilterOptions();

  //@ts-ignore
  @ViewChild('paginator') paginator: MatPaginator;
  //@ts-ignore
  @ViewChild(MatSort) sort: MatSort;
  //@ts-ignore
  displayedColumns: string[] = [
    'title',
    'dueDate',
    'hasSubmission',
    'hasRating',
    'actions',
  ];

  // Add ref of AppComponent to use it in the template
  constructor(
    private _assignementService: AssignmentService,
    loggingService: LoggingService,
    snackBar: MatSnackBar,
    loadingService: LoadingService,
    dialog: MatDialog
  ) {
    super(loadingService, snackBar, loggingService, dialog);
    this.loadingState(true);
  }

  ngOnInit(): void {
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
  }

  ngAfterViewInit(): void {
    this.loadAssignments();
  }

  // Fonction qui permet de supprimer une devoir
  onDeleteAssignment(id: string) {
    this._loggingService.event();
    this._assignementService.delete(id).subscribe((data) => {
      this.handleDeleteAssignment(data);
    });
  }

  // Fonction qui permet de gérer la suppression d'un devoir
  handleDeleteAssignment(data: SuccessRequest | ErrorRequest) {
    if (data instanceof ErrorRequest) {
      this.handleErrorSoft(data);
      return;
    }
    if (!data.success) {
      this.handleErrorSoft('Une erreur est survenue');
      return;
    }

    Utils.snackBarSuccess(this._snackBar, 'Devoir supprimé avec succès');
    this.paginator.page.emit();
  }

  // Fonction qui permet de charger les devoirs
  loadAssignments(): void {
    this._loggingService.event();
    merge(
      this.sort.sortChange,
      this.paginator.page,
      this.filterOptions.submitFilter,
      this.filterOptions.ratingFilter,
      this.filterOptions.searchText,
      this.filterOptions.yearFilter,
      this.filterOptions.monthFilter
    )
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loadingState(true);
          return this._assignementService.search(
            this.getFilter(),
            this.getOrder(),
            {
              page: this.paginator.pageIndex,
              limit: this.paginator.pageSize,
            }
          );
        }),
        map((data) => {
          if (data instanceof ErrorRequest) {
            this.paginator.length = 0;
            this.handleError(data);
            return [];
          }
          this.paginator.length = data.totalItems;
          this.loadingState(false);
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

  onNewSearch(state: any) {
    if (!state) state = '';
    this._loggingService.event(state);

    this.filterOptions.searchText.next(state);
  }

  onFilterSubmit(state: any) {
    if (!state) state = '';
    this._loggingService.event(state);

    this.filterOptions.submitFilter.next(state);
  }

  onFilterRate(state: any) {
    if (!state) state = '';
    this._loggingService.event(state);

    this.filterOptions.ratingFilter.next(state);
  }

  onFilterYear(state: any) {
    if (!state) state = -1;
    this._loggingService.event(state);

    this.filterOptions.yearFilter.next(state);
  }

  onFilterMonth(state: any) {
    if (!state) state = -1;
    this._loggingService.event(state);

    this.filterOptions.monthFilter.next(state);
  }

  // Fonction qui permet de filtrer les données
  getFilter() {
    let json = {};
    if (this.filterOptions.searchText.getValue() !== '') {
      json = {
        ...json,
        ...{ title: this.filterOptions.searchText.getValue() },
      };
    }
    if (this.filterOptions.submitFilter.getValue() !== '') {
      json = {
        ...json,
        ...{
          submission:
            this.filterOptions.submitFilter.getValue() === 'submit'
              ? null
              : false,
        },
      };
    }
    if (this.filterOptions.ratingFilter.getValue() !== '') {
      json = {
        ...json,
        ...{
          rating:
            this.filterOptions.ratingFilter.getValue() === 'rated'
              ? null
              : false,
        },
      };
    }
    // todo check if it's right
    if (this.filterOptions.yearFilter.getValue() !== -1) {
      json = { ...json, ...{ year: this.filterOptions.yearFilter.getValue() } };
    }
    if (this.filterOptions.monthFilter.getValue() !== -1) {
      json = {
        ...json,
        ...{ month: this.filterOptions.monthFilter.getValue() },
      };
    }

    return json;
  }
}

class FilterOptions {
  searchText: BehaviorSubject<string> = new BehaviorSubject('');
  submitFilter: BehaviorSubject<string> = new BehaviorSubject('');
  ratingFilter: BehaviorSubject<string> = new BehaviorSubject('');
  yearFilter: BehaviorSubject<number> = new BehaviorSubject(-1);
  monthFilter: BehaviorSubject<number> = new BehaviorSubject(-1);

  getSearchFilter(): string {
    return this.searchText.getValue().trim().toLowerCase();
  }
}
