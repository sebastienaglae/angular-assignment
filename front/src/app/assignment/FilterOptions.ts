import { BehaviorSubject, skip } from 'rxjs';

export class FilterOptions {
  filterArgs: BehaviorSubject<any> = new BehaviorSubject('');
  filterLast: string = '';
  searchText: string = '';

  constructor() {
    this.filterArgs
      .pipe(skip(1))
      .subscribe((value) => (this.filterLast = value));
  }

  wasUpdated() {
    return this.filterLast !== this.filterArgs.getValue();
  }
}
