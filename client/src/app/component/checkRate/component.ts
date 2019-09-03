/**
 * Created by HAI on 5/24/2017.
 */
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input
} from '@angular/core';

import  * as global from '../../common/settingManager';

import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SocketService } from '../../service/socket/socket.client.service';
import { DataService } from '../../service/data/data.service';
import { Result } from 'range-parser';
import { Content } from '@angular/compiler/src/render3/r3_ast';

@Component({
  selector: 'check-rate',  // <home></home>
  providers: [

  ],
  templateUrl: './component.html',
  styleUrls: [
    "./all.css"
  ],
})

export class CheckRateComponent implements OnInit {
  // Set our default values
  errorMessage: string;
  dataSubcription: Subscription;
  list_gateway = [
    {"name":"bitbank"}, 
    {"name":"hitbtc"}, 
    {"name":"huobi"}, 
    {"name":"poloniex"}, 
    {"name":"okexws"}, 
    {"name":"okexrest"}, 
    {"name":"bitflyer1"}, 
    {"name":"bitflyer2"},
    {"name":"bithumb"},
    {"name":"coinone"},
    {"name":"okcoin"},
    {"name":"itbit"},
    {"name":"coincheck"}, 
    {"name":"kraken"},
    {"name":"bitfinex"},
    {"name":"quoine"},
    {"name":"gemini"},
    {"name":"binance1"}, 
    {"name":"binance2"},
    {"name":"bitmex"},
    {"name":"coinbasepro"},
    {"name":"bittrex"},
    {"name":"bitstamp"}
  ];
 
  
  list_config = [
    { 'name': "dev" },
    { 'name': "localhost" },
    { 'name': "test" },
    { 'name': "staging" },
    { 'name': "production" }
  ];
  
  list_number_content = [
    { 'value': 1 },
    { 'value': 2 },
    { 'value': 3 },
    { 'value': 4 },
    { 'value': 5 }
  ];
  
  form_data = {
    current_config:{
      name:"staging"
    },
    number_content:{
      "value":3
    },
    list_symbol :{},
    current_symbol:{},
    list_order_book:{},
    array_exchange:[],
    number_row:{},
    lot_limmit:{},
    price:{},
    current_gateway:{}
  }

  @Input() current_user;

  constructor(
    public router: Router,
    private socketSrevice: SocketService,
    private dataService : DataService
  ) {
  }

  initFormData(){
    for(let j = 0; j <  this.form_data.number_content.value ; j++){
      this.form_data.list_symbol[j] = null;
      this.form_data.current_gateway[j] = null;
      this.form_data.list_order_book[j] = null;
      this.form_data.number_row[j] = 20;
      this.form_data.lot_limmit[j] = 10;
      this.form_data.price[j] = {
        bid:0,
        ask:0,
        mid:0
      };
      this.form_data.array_exchange.push(j);
    }
  }

  public ngOnInit() {
    this.socketSrevice.sendData(global.MESSAGESOCKET.CHECK_RATE_ENVIRONMENT,{
      token:this.current_user.token_authen
    });

    this.initFormData();
   
    this.dataSubcription = this.dataService.checkRate.subscribe(data=>{
      switch (data.type) {
        case global.MESSAGESOCKET.CHECK_RATE_CHANGE_ENVIRONMENT:
          break;

        case global.MESSAGESOCKET.CHECK_RATE_ENVIRONMENT:
           this.form_data = data.data.status;
          break;

        case global.MESSAGESOCKET.CHECK_RATE_DATA:
          this.getPrice(data.data.list_order_book.bid , data.data.list_order_book.ask, data.data.type);
          this.form_data.list_order_book[data.data.type] = this.mergerData(data.data.list_order_book.bid,data.data.list_order_book.ask, this.form_data.number_row[data.data.type], data.data.type , this.form_data.lot_limmit[data.data.type]);
          break;

        case global.MESSAGESOCKET.CHECK_RATE_LIST_SYMBOL:
          this.form_data.list_symbol[data.data.type] = data.data.list_symbol;
          this.form_data.current_symbol[data.data.type] = data.data.list_symbol[0];
          this.socketSrevice.sendData(global.MESSAGESOCKET.CHECK_RATE_SAVE_FORM_DATA,{
            token:this.current_user.token_authen,
            form_data:this.form_data
          });
          break;
      
        default:
          break;
      }
    });
  }

  changeGateway(o,type){
    this.form_data.current_gateway[type] = o;
    this.form_data.list_order_book[type] = null;
    this.form_data.list_symbol[type]= null;
    this.form_data.current_symbol[type] = null;
    this.socketSrevice.sendData(global.MESSAGESOCKET.CHECK_RATE_LIST_SYMBOL,{
      token:this.current_user.token_authen,
      gateway:o.name,
      form_data:this.form_data,
      type: type
    });
  }

  changeNumberExchange(o){
    this.form_data.number_content = o;
    this.form_data.list_symbol ={};
    this.form_data.current_gateway ={};
    this.form_data.list_order_book ={};
    this.form_data.array_exchange=[];
    for(let j = 0; j < o.value ; j++){
      this.form_data.array_exchange.push(j);
      if(!this.form_data.number_row[j]){
        this.form_data.list_symbol[j] = null;
        this.form_data.current_gateway[j] = null;
        this.form_data.list_order_book[j] = null;
        this.form_data.number_row[j] = 20;
        
      }
    };

    this.socketSrevice.sendData(global.MESSAGESOCKET.CHECK_RATE_CHANGE_NUMBER_EXCHANGE,{
      token:this.current_user.token_authen,
      form_data:this.form_data,
      number_exchange:o.value,
    });
  }

  changeConfig(o){
    this.form_data.current_config = o;
    this.form_data.list_symbol ={};
    this.form_data.current_gateway ={};
    this.form_data.list_order_book ={};
    this.form_data.array_exchange=[];
    for(let j = 0; j < this.form_data.number_content.value ; j++){
      this.form_data.array_exchange.push(j);
      if(!this.form_data.number_row[j]){
        this.form_data.list_symbol[j] = null;
        this.form_data.current_gateway[j] = null;
        this.form_data.list_order_book[j] = null;
        this.form_data.number_row[j] = 20;
        
      }
    };
    this.socketSrevice.sendData(global.MESSAGESOCKET.CHECK_RATE_CHANGE_ENVIRONMENT,{
      token:this.current_user.token_authen,
      environment:this.form_data.current_config.name,
      form_data:this.form_data
    });
  }

  selectSymbol(o, type){
    this.form_data.current_symbol[type] = o;
    this.socketSrevice.sendData(global.MESSAGESOCKET.CHECK_RATE_DATA,{
      token:this.current_user.token_authen,
      form_data:this.form_data,
      type : type
    });
  }

  mergerData(bid,ask, number, type, lot_limmit){
    var result = [];
    let data_bid = bid.slice(0,number);
    let data_ask = ask.slice(0,number);
    for(let j = 0 ; j < number ; j++){
        let b = data_bid[j]? data_bid[j] : ["---","---"];
        let a = data_ask[j]? data_ask[j] : ["---","---"];
        result.push(
          {
            bid:b,
            ask:a
          }
        )
    }
   return  result;
  }

  getPrice(data_bid , data_ask, type){
    let b_result  = this.getPriceDetail(data_bid, this.form_data.lot_limmit[type]);
    let a_result  = this.getPriceDetail(data_ask, this.form_data.lot_limmit[type]);
    if(b_result.status && a_result.status){
      this.form_data.price[type].bid = b_result.price;
      this.form_data.price[type].ask = a_result.price;
    }else{
      let lot_limmit_2 = Math.min(b_result.total,a_result.total) * global.lotlimit_rescale_ratio;
      let b_result_2  = this.getPriceDetail(data_bid,lot_limmit_2);
      let a_result_2  = this.getPriceDetail(data_ask, lot_limmit_2);
      this.form_data.price[type].bid = b_result_2.price;
      this.form_data.price[type].ask = a_result_2.price;
    }
    

    let bid_price = this.form_data.price[type].bid;
    let ask_price = this.form_data.price[type].ask;
    let p1 = bid_price.toString().split(".").length== 2 ? bid_price.toString().split(".")[1].length:0;
    let p2 = ask_price.toString().split(".").length== 2 ? ask_price.toString().split(".")[1].length:0;
    let p = p1>p2? p1 : p2;
    this.form_data.price[type].mid = ((parseFloat(bid_price)+parseFloat(ask_price))/2).toFixed(p+1);
  }

  getPriceDetail(input,lotLimit){
    var total = 0;
    var flag = 1;
    var price = 0;
    var last_price = 0;
    var last_total = 0;
    input.map(e=>{
      if(flag){
        total = total+ parseFloat(e[1]);
        if(total > lotLimit){
          flag = 0;
          price = e[0];
        }
      }
      last_price = e[0];
      last_total = e[2];
    });
    let rescale_value = last_total * global.lotlimit_rescale_ratio;
    if(!flag && total * global.lotlimit_rescale_ratio < rescale_value){
      return {price:price,status:true, total:last_total}
     
    }else{
      return {price:last_price,status:false, total: last_total}
    }
  }
  ngOnDestroy() {
     this.dataSubcription.unsubscribe();
  }

}
