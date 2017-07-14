import { Pipe, PipeTransform } from '@angular/core';

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
