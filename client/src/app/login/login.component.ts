import {
  Component,
  OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import  { UserService } from '../service/user_server';
import { SocketService } from '../service/socket/socket.client.service';

@Component({
  selector: 'login',
  styles: [`
  `],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  public localState: any;
  public  account : any;
  public errorMessage:string;
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private userService : UserService,
    private socketService: SocketService
  ) {}

  public ngOnInit() {
    this.account = {
      username:"",
      password:""
    }
    this.route
      .data
      .subscribe((data: any) => {
        /**
         * Your resolved data from route.
         */
        this.localState = data.yourData;
      });

    console.log('hello `Login` component');
    /**
     * static data that is bundled
     * var mockData = require('assets/mock-data/mock-data.json');
     * console.log('mockData', mockData);
     * if you're working with mock data you can also use http.get('assets/mock-data/mock-data.json')
     */
    this.asyncDataWithWebpack();
  }
  private asyncDataWithWebpack() {
    /**
     * you can also async load mock data with 'es6-promise-loader'
     * you would do this if you don't want the mock-data bundled
     * remember that 'es6-promise-loader' is a promise
     */
    setTimeout(() => {

      import('../../assets/mock-data/mock-data.json')
        .then((json) => {
          console.log('async mockData', json);
          this.localState = json;
        });

    });
  }
  login(){
    this.userService.login(this.account).then(data=>{
      console.log('data is', data);
      if(data.resultCode == 0){
        localStorage.setItem('currentUser', JSON.stringify(data));   
        // this.socketService.sendData('bpex_client', { username: data.username })   
        this.router.navigate(['home']);
      }else{
        this.errorMessage = 'Username or password is incorrect';
      }
    }).catch(err=>{
      this.errorMessage = 'Username or password is incorrect';
      console.log(this.errorMessage);
    })
  }

}
