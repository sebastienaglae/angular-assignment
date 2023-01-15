import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'size' })
export class SizePipe implements PipeTransform {
  transform(value: number | undefined): string {
    let unit = 'o';
    if (value === undefined || value === null) return '0 ' + unit;
    let result = value;
    let unitName = unit;
    if (value >= 1024) {
      result = value / 1024;
      unitName = 'k' + unit;
    }
    if (result >= 1024) {
      result = result / 1024;
      unitName = 'm' + unit;
    }
    if (result >= 1024) {
      result = result / 1024;
      unitName = 'g' + unit;
    }
    if (result >= 1024) {
      result = result / 1024;
      unitName = 't' + unit;
    }
    if (result >= 1024) {
      result = result / 1024;
      unitName = 'p' + unit;
    }
    if (result >= 1024) {
      result = result / 1024;
      unitName = 'e' + unit;
    }
    if (result >= 1024) {
      result = result / 1024;
      unitName = 'z' + unit;
    }
    if (result >= 1024) {
      result = result / 1024;
      unitName = 'y' + unit;
    }
    return result.toFixed(2) + ' ' + unitName;
  }
}
