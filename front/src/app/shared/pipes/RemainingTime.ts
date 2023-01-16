import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'remaining' })
export class RemainingTimePipe implements PipeTransform {
  transform(value: any | undefined): string {
    console.log(value)
    if (value === undefined) {
      return '';
    }
    let result = '';
    let now = new Date().getTime();
    let due = new Date(value).getTime();
    let seconds = (due - now) / 1000;
    if (seconds < 0) {
      return '0s';
    }
    let years = Math.floor(seconds / (3600 * 24 * 365));
    seconds -= years * 3600 * 24 * 365;
    let months = Math.floor(seconds / (3600 * 24 * 30));
    seconds -= months * 3600 * 24 * 30;
    let weeks = Math.floor(seconds / (3600 * 24 * 7));
    seconds -= weeks * 3600 * 24 * 7;
    let days = Math.floor(seconds / (3600 * 24));
    seconds -= days * 3600 * 24;
    let hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    let minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    if (years > 0) {
      result += years + 'a ';
    }
    if (months > 0) {
      result += months + 'm ';
    }
    if (weeks > 0) {
      result += weeks + 's ';
    }
    if (days > 0) {
      result += days + 'j ';
    }
    if (hours > 0) {
      result += hours + 'h ';
    }
    if (minutes > 0) {
      result += minutes + 'm ';
    }
    return result;
  }
}
