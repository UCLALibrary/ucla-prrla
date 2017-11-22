import { Pipe, PipeTransform } from '@angular/core';

/**
 * This Pipe is used to transform key - value array `{key1: 'value1', key2: 'value2'}`
 * to array with objects `[{key: 'key1', value: 'value1}, {key: 'key2', value: 'value2}]`
 */
@Pipe({
  name: 'parseJson'
})
export class ParseJsonPipe implements PipeTransform {

  // transform(value: any, args?: any): any {
  //   return null;
  // }
  transform(value, args:string[]) : any {
    if (!value) {
      return value;
    }

    let keys = [];
    for (let key in value) {
      keys.push({key: key, value: value[key]});
    }
    return keys;
  }

}
