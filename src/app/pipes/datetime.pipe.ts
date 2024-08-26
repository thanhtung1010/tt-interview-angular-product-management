import { Pipe, PipeTransform } from "@angular/core";
import { environment } from "~environments/environment";
import { format } from 'date-fns';

@Pipe({
  name: 'TTDateTimePipe',
  standalone: true,
})
export class DateTimePipe implements PipeTransform {
  constructor() {}

  transform(value: number, formatDate?: string, ...args: any[]) {
    const _format: string = formatDate ?? environment.dateTimeFormat;

    return format(value, _format);
  }
}
