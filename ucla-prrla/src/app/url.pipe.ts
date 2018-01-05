import {Pipe, PipeTransform} from '@angular/core';

/**
 * Wraps url with HTML Tag
 * made links from solr array data like 'Identifiers'
 */
@Pipe({name: 'url'})
export class UrlPipe implements PipeTransform {
    transform(value: string, arg?: any): any {
        if (value.indexOf('http') === 0) {
            return '<a href="' + value + '" target="_blank">' + value + '</a>';
        } else {
            return '<span>' + value + '</span>';
        }
    }
}