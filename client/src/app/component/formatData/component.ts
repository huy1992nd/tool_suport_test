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
import * as XLSX from 'xlsx';
import { DataService } from '../../service/data/data.service';
import { Subscription } from 'rxjs';
import { SocketService } from '../../service/socket/socket.client.service';
@Component({
  selector: 'format-data',  // <home></home>
  providers: [

  ],
  templateUrl: './component.html',
  styleUrls: [
    "./all.css"
  ],
})

export class FormatDataComponent implements OnInit {
  // Set our default values
  errorMessage: string;
  data_input:any;
  lot_limit:any =10;
  number_point:any = 8;
  data_show : any; 
  action = '';
  list_select:any;
  current_select = {'name':'Nhập tay', 'value':1};
  dataSubcription: Subscription;
  key_redis:any='bitflyer1_btcjpy';
  auto_time:any =1;
  @Input() current_user;
  constructor(
    public router: Router,
    private socketSrevice: SocketService,
    private dataService : DataService
  ) {
  }

  public ngOnInit() {
    this.list_select = [
      {'name':'Nhập tay', 'value':1},
      {'name':'Auto', 'value':2}
    ];

    this.dataSubcription = this.dataService.formatData.subscribe(data=>{
      switch (data.type) {
        case global.MESSAGESOCKET.FORMAT_DATA_GET_LIST_ORDER_BOOK:
          if(this.current_select.value == 2){
            this.data_input = data.data.list_order_book;
            this.show_data_detail(2);
          }
         
          break;
      
        default:
          break;
      }
    });
  }

  export_excel(){
      console.log('data input is', this.data_input);
      if(!this.lot_limit || !this.data_input){
        alert('Bạn phải nhập lot limit và dữ liệu');
      }else{
        try {
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          var data_bid = this.formatData(JSON.parse(this.data_input).bid,1);
          var data_ask = this.formatData(JSON.parse(this.data_input).ask,2);
          var bid_price = this.getPrice(data_bid,this.lot_limit);
          var ask_price = this.getPrice(data_ask,this.lot_limit);
          var data_output = this.mergerData(data_bid, data_ask, bid_price, ask_price , this.lot_limit )
          XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(data_output), 'parse');
          XLSX.writeFile(wb, 'report_data_nop.xlsx');
        } catch (error) {
          alert('Dữ liệu đầu vào không đúng');
          console.log('error', error)
        }
      }
  };

  select(c){
    this.current_select = c;
  }

  show_data(){
 switch (this.current_select.value) {
   case 1:
     this.show_data_detail(1);
     break;

   case 2:
      this.socketSrevice.sendData(global.MESSAGESOCKET.FORMAT_DATA_GET_LIST_ORDER_BOOK,{
        token:this.current_user.token_authen,
        key:this.key_redis,
        time : this.auto_time
      });
     break;
 
   default:
     break;
 }
  }

  show_data_detail(type){
    console.log('data input is', this.data_input);
    if(!this.lot_limit || !this.data_input){
      alert('Bạn phải nhập lot limit và dữ liệu');
    }else{
      try {
        switch (type) {
          case 1:
            var data_bid = this.formatData(JSON.parse(this.data_input).bid,1);
            var data_ask = this.formatData(JSON.parse(this.data_input).ask,2);
            break;

          case 2:
          var data_bid = this.formatData(this.data_input.bid,1);
          var data_ask = this.formatData(this.data_input.ask,2);
            break;
        
          default:
            break;
        }
      
        var bid_price = this.getPrice(data_bid,this.lot_limit);
        var ask_price = this.getPrice(data_ask,this.lot_limit);
        this.data_show = this.mergerData(data_bid, data_ask, bid_price, ask_price , this.lot_limit );
      } catch (error) {
        alert('Dữ liệu đầu vào không đúng');
        console.log('error', error)
      }
    }
  }

  getPrice(input,lotLimit){
    var total = 0;
    var flag = 1;
    var price = 0;
    input.map(e=>{
      if(flag){
        total = total+ parseFloat(e[1]);
        if(total > lotLimit){
          flag = 0;
          price = e[0];
        }
      }
    });
    return price;
  }

  mergerData(bid, ask, bid_price , ask_price, lotlimit){
    var result = [];
    result.push(
      [
        "Bid_price: "+ bid_price,
        "",
        "Mid price: " + ((parseFloat(bid_price)+parseFloat(ask_price))/2).toFixed(this.number_point),
        "",
        "Ask_price: "+ask_price,
        ""
      ]);
      result.push(
      [
        "",
        "",
        "Lot limit: " +lotlimit,
        "",
        "",
        ""
      ]);
      result.push(
      [
        "BID",
        "",
        "",
        "",
        "ASK",
        ""
      ]
    ),
      result.push(
      [
        "Price",
        "Amount",
        "",
        "",
        "Price",
        "Amount"
      ]
    )
    if(bid.length > ask.length){
      bid.map((e,i)=>{
        if(ask.length > i){
          result.push(
            [
              e[0],
              e[1],
              "",
              "",
              ask[i][0],
              ask[i][1]
            ]
          );
        }else{
          result.push(
            [
              e[0],
              e[1],
              "",
              "",
              "",
              ""
            ]
          );
        }
      })
    }else{
      ask.map((e,i)=>{
        if(bid.length > i){
          result.push(
            [
              bid[i][0],
              bid[i][1],
              "",
              "",
              e[0],
              e[1]
              
            ]
          );
        }else{
          result.push(
            [
              "",
              "",
              "",
              "",
              e[0],
              e[1]
            ]
          );
        }
      })
    };

    return result;
  }
 
  formatData(data, type){
        data.map(e=>{
          e.price = parseFloat(e.price);
          e.amount = parseFloat(e.amount);
          return e;
        })
        var result =[];
        switch (type) {
          case 1:
            data.sort((a,b) => (a.price < b.price) ? 1 : ((b.price < a.price) ? -1 : 0)); 
            break;
          
          case 2:
            data.sort((a,b) => (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0)); 
            break;
        
          default:
            break;
        }

        data.map(e=>{
            result.push( [
              e.price,
              e.amount
            ]
          );
        });

        return result;
  }

  ngOnDestroy() {
    this.dataSubcription.unsubscribe();
 }

}
