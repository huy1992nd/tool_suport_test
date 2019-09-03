import {
  Component,
  OnInit
} from '@angular/core';

import { AppState } from '../app.service';
import { Title } from './title';
import { XLargeDirective } from './x-large';

import { Router } from '@angular/router';
import { Result } from 'range-parser';
import { UserService } from '../service/user_server';
import { SocketService } from '../service/socket/socket.client.service';
import { current_user } from 'app/common';

@Component({
  /**
   * The selector is what angular internally uses
   * for `document.querySelectorAll(selector)` in our index.html
   * where, in this case, selector is the string 'home'.
   */
  selector: 'home',  // <home></home>
  /**
   * We need to tell Angular's Dependency Injection which providers are in our app.
   */
  providers: [
    Title
  ],
  /**
   * Our list of styles in our component. We may add more to compose many styles together.
   */
  styleUrls: ['./home.component.css'],
  /**
   * Every Angular template is first compiled by the browser before Angular runs it's compiler.
   */
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  /**
   * Set our default values
   */
  public current_tab: String = "command";
  public current_group: any;
  public localState = { value: '' };
  public current_user: any;
  /**
   * TypeScript public modifiers
   */
  constructor(
    public appState: AppState,
    public title: Title,
    public router: Router,
    private userService: UserService,
    private socketService: SocketService,

  ) {

  }

  public ngOnInit() {

    console.log('hello `Home` component');
    /**
     * this.title.getData().subscribe(data => this.data = data);
     */
    this.current_user = JSON.parse(localStorage.getItem('currentUser'));
    if (!this.current_user) {
      this.router.navigate(['login']);
    } else {
      this.userService.checkAut({ token: this.current_user.token_authen })
        .then(data => {
          if (data.resultCode == 0) {
            this.socketService.sendData('bpex_client', { username: this.current_user.username })
          } else {
            this.router.navigate(['login']);
          }
        })
        .catch(err => {
          console.log('Have some err when login', err);
          this.router.navigate(['login']);
        })

      if (!this.current_user) {
        this.router.navigate(['login']);
      } else {
        this.current_tab = this.getpageHome();
      }
    }
  }


  getpageHome() {
    let page_home = '';
    switch (this.current_user.permission) {
      case 1:
      case 2:
        page_home = 'check-log';
        break;

      case 3:
        page_home = 'format-data';
        break;

      default:
        break;
    }

    return page_home;
  }

  public submitState(value: string) {
    console.log('submitState', value);
    this.appState.set('value', value);
    this.localState.value = '';
  }

  public changeCurrentTab(tab: String) {
    this.current_tab = tab;
  }

  public logout() {
    // this.globals.current_user ='';
    localStorage.removeItem('currentUser');
    this.router.navigate(['login']);
  }

  checkPermission(tab) {
    var result = false;
    switch (this.current_user.permission) {

      case 1:
        switch (tab) {
          case 'check-nop':
          case 'format-data':
          case 'check-rate':
          case 'check-log':
            result = true;
            break;
          default:
            break;
        }
        break;

      case 2:
        switch (tab) {
          case 'format-data':
            result = true;
            break;
          default:
            break;
        }
        break;

      case 3:
        switch (tab) {
          case 'export-analyse':
          case 'check-rate':
            result = false;
            break;

          case 'format-data':
            result = true;
            break;

          default:
            break;
        }
        break;

      default:
        break;
    }

    return result;
  }
}
