import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate() {
    var key =localStorage.getItem('id_token');
    if(key == "ad2g3342daabvcdgfgh432dfgfhd")
      return true;
    else {
      this.router.navigate(['login']);
      return false;
    }
  }
}
