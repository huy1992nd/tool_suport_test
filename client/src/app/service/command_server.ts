import { Injectable } from '@angular/core';
import {ParentService} from './parent_server';
@Injectable()
export class CommandService  extends ParentService {
  
  get_list_order(data :any): Promise<any>{
    return this.sendPost(data,'get_list_order');
  }
  
  set_config_redis(data :any): Promise<any>{
    return this.sendPost(data,'set_config_redis');
  }

  pause_order(data :any): Promise<any>{
    return this.sendPost(data,'pause_order');
  }

  resume_order(data :any): Promise<any>{
    return this.sendPost(data,'resume_order');
  }

  add_order(data :any): Promise<any>{
    return this.sendPost(data,'add_order');
  }

  update_order(data :any): Promise<any>{
    return this.sendPost(data,'update_order');
  }

  delete_order(data :any): Promise<any>{
    return this.sendPost(data,'delete_order');
  }

}
