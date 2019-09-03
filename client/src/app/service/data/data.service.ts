import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  checkNOP: Subject<any>;
  checkLog: Subject<any>;
  checkRate: Subject<any>;
  formatData: Subject<any>;

  constructor() {
    this.checkNOP = new Subject<any>();
    this.checkLog = new Subject<any>();
    this.checkRate = new Subject<any>();
    this.formatData = new Subject<any>();
  }
}
