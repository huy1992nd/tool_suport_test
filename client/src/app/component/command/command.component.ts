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

import  * as global from '../../common/settingManager';

import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { Subscription } from 'rxjs';
import { SocketService } from '../../service/socket/socket.client.service';
import { DataService } from '../../service/data/data.service';

@Component({
  selector: 'command',  // <home></home>
  providers: [

  ],
  templateUrl: './command.component.html',
  styleUrls: [
    "./all.css"
  ],
  encapsulation: ViewEncapsulation.None
})

export class CommandComponent implements OnInit {
  @ViewChild('close_modal') modelId: ElementRef;
  objectKeys = Object.keys;
  // Set our default values
  dataSubcription: Subscription;
  errorMessage: string;

  
  nop_realtime : any ;
  nop_price_engine : any ;
  
  process:Boolean=false;
  
  list_config = [
    { 'name': "dev" },
    { 'name': "localhost" },
    { 'name': "test" },
    { 'name': "staging" },
    { 'name': "production" }
  ];
  
  list_market = [
    { 'name': "spot" },
    { 'name': "margin" }
  ];
  
  current_config = {
    name:""
  };

  current_market = {
    name:"spot"
  };

  
  list_symbol = [
    {item_id:5,item_text: "BTC_JPY"},
    {item_id:4,item_text: "BTC_USD"},
    {item_id:3,item_text: "BTC_HKD"},
    {item_id:2,item_text: "BTC_EUR"},
    {item_id:1,item_text: "BTC_KRW"},
    {item_id:9,item_text: "BTC_TWD"},
    {item_id:8,item_text: "BTC_SGD"},
    {item_id:7,item_text: "BTC_MYR"},
    {item_id:6,item_text: "BTC_THB"},
    {item_id:14,item_text:"ETH_JPY"},
    {item_id:13,item_text:"ETH_USD"},
    {item_id:12,item_text:"ETH_HKD"},
    {item_id:11,item_text:"ETH_EUR"},
    {item_id:10,item_text:"ETH_KRW"},
    {item_id:18,item_text:"ETH_TWD"},
    {item_id:17,item_text:"ETH_SGD"},
    {item_id:16,item_text:"ETH_MYR"},
    {item_id:15,item_text:"ETH_THB"},
    {item_id:23,item_text:"BCC_JPY"},
    {item_id:22,item_text:"BCC_USD"},
    {item_id:21,item_text:"BCC_HKD"},
    {item_id:20,item_text:"BCC_EUR"},
    {item_id:19,item_text:"BCC_KRW"},
    {item_id:27,item_text:"BCC_TWD"},
    {item_id:26,item_text:"BCC_SGD"},
    {item_id:25,item_text:"BCC_MYR"},
    {item_id:24,item_text:"BCC_THB"},
    {item_id:32,item_text:"LTC_JPY"},
    {item_id:31,item_text:"LTC_USD"},
    {item_id:30,item_text:"LTC_HKD"},
    {item_id:29,item_text:"LTC_EUR"},
    {item_id:28,item_text:"LTC_KRW"},
    {item_id:36,item_text:"LTC_TWD"},
    {item_id:35,item_text:"LTC_SGD"},
    {item_id:34,item_text:"LTC_MYR"},
    {item_id:33,item_text:"LTC_THB"},
    {item_id:41,item_text:"XRP_JPY"},
    {item_id:40,item_text:"XRP_USD"},
    {item_id:39,item_text:"XRP_HKD"},
    {item_id:38,item_text:"XRP_EUR"},
    {item_id:37,item_text:"XRP_KRW"},
    {item_id:45,item_text:"XRP_TWD"},
    {item_id:44,item_text:"XRP_SGD"},
    {item_id:43,item_text:"XRP_MYR"},
    {item_id:42,item_text:"XRP_THB"},
    {item_id:46,item_text:"BBB_BTC"},
    {item_id:47,item_text:"XRP_BTC"},
    {item_id:48,item_text:"LTC_BTC"},
    {item_id:49,item_text:"BCC_BTC"},
    {item_id:50,item_text:"ETH_BTC"},
    {item_id:51,item_text:"BBB_ETH"}
  ];
  
  dropdownSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 1,
    allowSearchFilter: true
  };
  
  list_symbol_select: any ;
  
  list_screen = [
    { 'name': "nop_daily" },
    { 'name': "nop_realtime" },
    { 'name': "price_engine" }
  ];
  
  current_screen = {
    name:"nop_daily"
  };

  is_config : Boolean = false;

  name_action = {
    'redis_setting': 'Set config',
    'pause': 'Pause',
    'resume': 'Resume',
    'add_order': 'add order',
    'update_order': 'Update order',
    'get_list_order': "Get list"
  }

  action = '';
  code_secure = null;
  waiting_check_code = '';
  @Input() current_user;

  constructor(
    public router: Router,
    private socketSrevice: SocketService,
    private dataService : DataService
  ) {

  }

  public ngOnInit() {
    this.list_symbol_select =  [
      {item_id:5,item_text: "BTC_JPY"}
    ];
    this.dataSubcription = this.dataService.checkNOP.subscribe(data=>{
      switch (data.type) {
        case global.MESSAGESOCKET.SET_CONFIG_CHECK_NOP_OK:
           this.is_config = true;
          break;

        case global.MESSAGESOCKET.CHECK_NOP_RESULT:
           this.downloadFile(data.link);
           this.nop_price_engine = null;
           this.process = false;
          break;

        case global.MESSAGESOCKET.ERROR_PARSE_SCREEN_PRICE_ENGINE:
           alert('Có lỗi khi đọc dữ liệu phân tích màn hình price_engine, hãy thử lại');
           this.process = false;
          break;

        case global.MESSAGESOCKET.PARSE_SCREEN_PRICE_ENGINE_OK:
           this.nop_price_engine = data.data.data;
          //  this.export_excel(data.data.data);
           this.downloadFile(data.data.link);
           this.nop_realtime = null;
           this.process = false;
           
          break;
      
        default:
          break;
      }
    })
  }

  downloadFile(url:string) {
    window.open(url, "_blank");
  }

  export_excel(data_input){
    try {
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      Object.keys(data_input).map(symbol=>{
        var data_format = this.formatData(data_input[symbol]);
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(data_format), symbol);
      })
      XLSX.writeFile(wb, 'report_price_engine.xlsx');
    } catch (error) {
      alert('Dữ liệu đầu vào không đúng');
      console.log('error', error)
    }
  }

  formatData(data_input){
      var result =  [];
      result.push(
        [
          "Exchange",
          "%",
          "Price"
        ]);
        Object.keys(data_input.list_data_detail).map(exchange=>{
          result.push([
            exchange,
            data_input.list_data_detail[exchange].percen,
            data_input.list_data_detail[exchange].value
          ])
        });
        result.push([
          "",
          "total_percen : "+ data_input.total_percen_all,
          "fair_value : "+ data_input.fair_value
        ]);

        return result;
  }

  ngOnDestroy() {
    this.dataSubcription.unsubscribe();
  }

  changeConfig(o){
    this.current_config = o;
    this.saveEnvironment();
  }

  changeMarket(o){
    this.current_market = o;
  }

  onItemSelect(item: any) {
    console.log(item);
  }

  onSelectAll(items: any) {
    console.log(items);
  }

  changeScreen(o){
    this.current_screen = o;
  }

  check(){
    if(!this.process){
      this.socketSrevice.sendData(global.MESSAGESOCKET.NOP_SCREEN_CHECK,{
        token:this.current_user.token_authen,
        screen:this.current_screen.name,
        market:this.current_market.name,
        list_symbol:this.list_symbol_select
      });
      this.process = true;
    }
  }

  private saveEnvironment() {
    this.socketSrevice.sendData(global.MESSAGESOCKET.NOP_SCREEN_SETTING,{
      token:this.current_user.token_authen,
      environment:this.current_config.name,
    });
  }

}
