import { Injectable }              from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import  * as global from '../common/settingManager'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/operator/delay';
import 'rxjs/operator/mergeMap';
import 'rxjs/operator/switchMap';
import { map } from 'rxjs/operators';
import {User} from '../model/user_model';

@Injectable()
export class ParentService {
  constructor (public http: Http) {}

  sendPost(data,path){
    var current_user = JSON.parse(localStorage.getItem('currentUser'));
    var token_authen =''
    switch (path) {
      case 'login':
      case 'login_web':
      case 'register':
        break;

      default:
        token_authen = current_user.token_authen;
        break;
    }

    let url = global.server+'/'+path;
    let headers = new Headers(); 
    headers.append('Content-Type','application/json');
    headers.append('Authorization',token_authen);
    let options = new RequestOptions({ headers: headers });
    console.log(`data ${path} is`, data);
    return this.http.post(url,data, options).pipe(map((response) => response.json())).toPromise();
  }

}

