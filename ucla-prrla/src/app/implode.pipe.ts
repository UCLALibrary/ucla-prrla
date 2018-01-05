import {Pipe, PipeTransform} from '@angular/core';

/**
 * Implodes arguments
 * this Pipe separate values
 */
@Pipe({
    name: 'implode',
    pure: false
})
export class ImplodePipe implements PipeTransform {
    transform(value, args): string {
        return value.join(args);
    }
}