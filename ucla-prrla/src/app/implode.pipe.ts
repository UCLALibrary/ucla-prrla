import {Pipe, PipeTransform, Sanitizer} from '@angular/core';

@Pipe({
    name: 'implode',
    pure: false
})
export class ImplodePipe implements PipeTransform{
    transform(value, args) : string {
        return value.join(args);
    }
}