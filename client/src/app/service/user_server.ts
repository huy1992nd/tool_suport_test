import { Injectable }              from '@angular/core';

import {ParentService} from './parent_server'

@Injectable()
export class UserService extends ParentService {

  getListUser(data :any): Promise<any>{
    return this.sendPost(data,'list_user');
  }

  updateUser(data :any): Promise<any>{
    return this.sendPost(data,'update_user');
  }

  addUser(data :any): Promise<any>{
    return this.sendPost(data,'insert_user');
  }

  login(data :any): Promise<any>{
    return this.sendPost(data,'login_web');
  }

  checkAut(data :any): Promise<any>{
    return this.sendPost(data,'check_aut');
  }

  remove(data :any): Promise<any>{
    return this.sendPost(data,'remove_user');
  }

}
