import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name:'url'})
export class UrlPipe implements PipeTransform {
    transform(value: string, arg?: any): any {
        var exp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
        if (value) {
            return value.replace(exp, "<a href='$1' target='_blank'>'$1'</a>");
        } else {
            return value.replace(exp, "<span>'$1'</span>");
        }
    }
}