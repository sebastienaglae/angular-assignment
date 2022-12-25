import { SchoolSubject } from '../SchoolSubject';

export abstract class Utils {
  public static compare(
    a: number | string,
    b: number | string,
    isAsc: boolean
  ) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  public static compareDate(a: Date, b: Date, isAsc: boolean) {
    return (a.getTime() < b.getTime() ? -1 : 1) * (isAsc ? 1 : -1);
  }

  public static randomDate(startYear: number, endYear: number): Date {
    let date = new Date(
      startYear + Math.random() * (endYear - startYear),
      Math.random() * 12,
      Math.random() * 28
    );
    return date;
  }

  public static randomSubject(): SchoolSubject {
    let keys = Object.keys(SchoolSubject);
    let randomKey = keys[Math.floor(Math.random() * keys.length)];
    let randomSubject = SchoolSubject[randomKey as keyof typeof SchoolSubject];
    return randomSubject;
  }
}
