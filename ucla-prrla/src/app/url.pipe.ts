import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name:'url'})
export class UrlPipe implements PipeTransform {
    transform(value: string, arg?: any): any {
        if (value.indexOf('http') === 0) {
            return '<a href="' + value + '" target="_blank">' + value + '</a>';
        } else {
            return '<span>' + value + '</span>';
        }
    }
}