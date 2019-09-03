/**
 * Created by HAI on 5/24/2017.
 */
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  Input
} from '@angular/core';

import * as global from '../../common/settingManager';

import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { Subscription } from 'rxjs';
import { SocketService } from '../../service/socket/socket.client.service';
import { DataService } from '../../service/data/data.service';

@Component({
  selector: 'check-log',  // <home></home>
  providers: [

  ],
  templateUrl: './checkLog.component.html',
  styleUrls: [
    "./all.css"
  ],
  encapsulation: ViewEncapsulation.None
})

export class CheckLogComponent implements OnInit {
  @ViewChild('close_modal') modelId: ElementRef;
  objectKeys = Object.keys;
  // Set our default values
  dataSubcription: Subscription;
  errorMessage: string;

  process: Boolean = false;
  result: Array<any> = [];
  
  list_config = [
    { 'name': "dev" },
    { 'name': "localhost" },
    { 'name': "test" },
    { 'name': "staging" },
    { 'name': "production" }
  ];

  list_file_log = [];
  dropdownSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'file_name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 1,
    allowSearchFilter: true
  };

  form_data = {
    running: 0,
    list_log_select: {},
    current_config: {
      name: "test"
    },
    pattern: {
      mysql: "[Warning]\n[ERROR]",
      nop: "",
      bpex_core: "terminate\nERROR",
      price_engine: "terminate\nERROR",
      gateway: "[SyntaxError]\n[rate not true]",
      api_spot: "[RestartAPI Error]\n[port die]\n[FAILED]\n[App not ready]",
      api_margin: "[FAILED]"
    }
  }

  list_pattern = Object.keys(this.form_data.pattern);

  checkValidate() {
    if (Object.keys(this.form_data.list_log_select).length > 0) {
      return true;
    } else {
      alert('Bạn phải nhập danh sách file log và ký tự bắt lỗi ');
      return false;
    }
  }


  is_config: Boolean = false;


  @Input() current_user;

  constructor(
    public router: Router,
    private socketSrevice: SocketService,
    private dataService: DataService
  ) {

  }

  public ngOnInit() {
    this.socketSrevice.sendData(global.MESSAGESOCKET.CHECK_LOG_CONFIG, {
      token: this.current_user.token_authen,
      environment: this.form_data.current_config.name,
    });

    this.socketSrevice.sendData(global.MESSAGESOCKET.CHECK_LOG_STATUS, {
      token: this.current_user.token_authen
    });

    this.dataSubcription = this.dataService.checkLog.subscribe(data => {
      switch (data.type) {
        case global.MESSAGESOCKET.CHECK_LOG_LIST_FILE:
          this.list_file_log = [];
          data.data.list_file_log.map((list_file) => {
            list_file.map((file, i) => {
              this.list_file_log.push(
                {
                  item_id: `${file.module}_____${file.filename}`,
                  item_text: file.filename,
                  file_name: file.filename + ` (${file.module})`,
                  module: file.module
                }
              )
            })
          })
          this.is_config = true;
          break;

        case global.MESSAGESOCKET.CHECK_LOG_RESULT:
          this.result = data.data.result;
          this.process = false;
          break;

        case global.MESSAGESOCKET.CHECK_LOG_STOP:
          this.form_data.running = 0;
          this.process = false;
          break;

        case global.MESSAGESOCKET.CHECK_LOG_STATUS:
          if (Object.keys(data.data.status.data).length > 0) {
            this.form_data = data.data.status.data.form_data;
            this.result = data.data.status.list_log;
          }
          break;

        default:
          break;
      }
    })
  }

  downloadFile(url: string) {
    window.open(url, "_blank");
  }

  ngOnDestroy() {
    this.dataSubcription.unsubscribe();
  }

  changeConfig(o) {
    this.form_data.current_config = o;
    this.socketSrevice.sendData(global.MESSAGESOCKET.CHECK_LOG_CONFIG, {
      token: this.current_user.token_authen,
      environment: this.form_data.current_config.name,
    });
  }

  onItemSelect(item: any) {
    console.log(item);
  }

  onSelectAll(items: any) {
    console.log(items);
  }

  run() {
    if (!this.process && this.checkValidate()) {
      this.process = false;
      this.result = [];
      this.form_data.running =  1;
      this.socketSrevice.sendData(global.MESSAGESOCKET.CHECK_LOG_RESULT, {
        token: this.current_user.token_authen,
        form_data: this.form_data
      });
     
    }
  }

  stop() {
    this.socketSrevice.sendData(global.MESSAGESOCKET.CHECK_LOG_STOP, {
      token: this.current_user.token_authen
    });
  }

}
