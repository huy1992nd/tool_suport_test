import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'search_by_key'
})
export class SearchByKeyPipe implements PipeTransform {
 
  transform(value: any, args1: any , args2:any): any {
    if (!args2) {
      return value;
    }
    return value.filter((val) => {
      if(val[args1] != undefined){
        let rVal = val[args1].toLocaleLowerCase().includes(args2);
        return rVal;
      }
      
    })

  }

}