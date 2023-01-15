import { Component, OnInit, ViewChild } from '@angular/core';
import { AssignmentService } from '../shared/services/assignment/assignment.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, skip, startWith, switchMap } from 'rxjs/operators';
import { SearchAssignment } from '../shared/api/assignment/search.assignment.model';
import { ErrorRequest } from '../shared/api/error.model';
import { LoggingService } from '../shared/services/logging/logging.service';
import { Utils } from '../shared/utils/Utils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssignmentSearch } from '../shared/models/assignment.search.model';
import { SuccessRequest } from '../shared/api/success.model';
import { LoadingService } from '../shared/services/loading/loading.service';
import { BaseComponent } from '../base/base.component';
import { MatDialog } from '@angular/material/dialog';
import { FilterOptions } from './FilterOptions';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css'],
})
export class AssignmentComponent extends BaseComponent implements OnInit {
  searchAssignment!: SearchAssignment;
  datasource: MatTableDataSource<AssignmentSearch> = new MatTableDataSource();
  filterOptions!: FilterOptions;

  //@ts-ignore
  @ViewChild('paginator') paginator: MatPaginator;
  //@ts-ignore
  @ViewChild(MatSort) sort: MatSort;
  //@ts-ignore
  @ViewChild('ratingChips', { static: true }) ratingChips: MatChipList;
  //@ts-ignore
  @ViewChild('submitChips', { static: true }) submitChips: MatChipList;
  //@ts-ignore
  @ViewChild('yearChips', { static: true }) yearChips: MatChipList;
  //@ts-ignore
  @ViewChild('monthChips', { static: true }) monthChips: MatChipList;
  displayedColumns: string[] = [
    'title',
    'dueDate',
    'submission',
    'rating',
    'actions',
  ];

  months = [
    { value: '1', viewValue: 'Janvier', color: 'warn' },
    { value: '2', viewValue: 'Février', color: 'warn' },
    { value: '3', viewValue: 'Mars', color: 'warn' },
    { value: '4', viewValue: 'Avril', color: 'accent' },
    { value: '5', viewValue: 'Mai', color: 'accent' },
    { value: '6', viewValue: 'Juin', color: 'accent' },
    { value: '7', viewValue: 'Juillet', color: 'warn' },
    { value: '8', viewValue: 'Août', color: 'warn' },
    { value: '9', viewValue: 'Septembre', color: 'warn' },
    { value: '10', viewValue: 'Octobre', color: 'accent' },
    { value: '11', viewValue: 'Novembre', color: 'accent' },
    { value: '12', viewValue: 'Décembre', color: 'accent' },
  ];

  years = [
    { value: '2022', viewValue: '2022', color: 'warn' },
    { value: '2023', viewValue: '2023', color: 'accent' },
    { value: '2024', viewValue: '2024', color: 'primary' },
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
    this.filterOptions = new FilterOptions();
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
    this.filterOptions.filterArgs.subscribe(
      () => (this.paginator.pageIndex = 0)
    );
    merge(
      this.sort.sortChange,
      this.paginator.page,
      this.filterOptions.filterArgs.pipe(skip(1))
    )
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loadingState(true);
          let page = this.filterOptions.wasUpdated()
            ? 0
            : this.paginator.pageIndex;
          this.paginator.pageIndex = page;
          return this._assignementService.search(
            this.filterOptions.filterArgs.getValue(),
            this.getOrder(),
            {
              page: page,
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
    this.filterOptions.searchText = state;
    this.updateFilter();
  }

  onFilter() {
    this._loggingService.event();
    this.updateFilter();
  }

  onMonthFilter() {
    this._loggingService.event();
    if (this.yearChips.value === undefined) this.yearChips.value = '2023';
    this.updateFilter();
  }

  onYearFilter() {
    this._loggingService.event();
    if (this.yearChips.value === undefined) this.monthChips.value = undefined;
    this.updateFilter();
  }

  // Fonction qui permet de filtrer les données
  getFilter() {
    let json = {};
    if (this.filterOptions.searchText !== '') {
      json = {
        ...json,
        ...{ title: this.filterOptions.searchText },
      };
    }
    if (this.submitChips.value !== undefined) {
      json = {
        ...json,
        ...{
          submission: {
            $exists: this.submitChips.value === 'submit',
          },
        },
      };
    }
    if (this.ratingChips.value !== undefined) {
      json = {
        ...json,
        ...{
          rating: {
            $exists: this.ratingChips.value === 'rated',
          },
        },
      };
    }
    let interval = Utils.getIntervalTime(
      this.yearChips.value,
      this.monthChips.value
    );
    if (interval) {
      json = {
        ...json,
        ...{
          dueDate: {
            $gte: interval.start,
            $lte: interval.end,
          },
        },
      };
    }

    return json;
  }

  updateFilter() {
    this.filterOptions.filterArgs.next(this.getFilter());
  }
}
