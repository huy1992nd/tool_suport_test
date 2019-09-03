import { DateFormatOptions } from '@telerik/kendo-intl';

export class Order {
  public client_order_id  : string  ;
  public currency_pair_cd  : string  ;
  public fill_condition  : Number  ;
  public filled_quantity  : Number  ;
  public open_close  : Number  ;
  public order_book_time  : string   ;
  public order_id  : string  ;
  public order_price  : Number ;
  public order_quantity  : Number ;
  public order_status  : Number  ;
  public msg_type  : Number  ;
  public order_time  : string  ;
  public order_type  : Number  ;
  public remaining_quantity  : Number ; 
  public side  : Number  ;
  public is_new  : Number ;
  public is_orderbook  : Number  ;
  public update_time : string ;
  public created_time : string ;


    constructor(
    ) {
     this.client_order_id  ='';
     this.currency_pair_cd   ='' ;
     this.fill_condition   = 0 ;
     this.filled_quantity   = 0 ;
     this.open_close   = 0 ;
     this.order_book_time  = new Date().toISOString().replace('T',' ').replace('Z','') ;
     this.order_id   = '0' ;
     this.order_price   =0;
     this.order_quantity   =0;
     this.order_status   =0 ;
     this.msg_type   =0 ;
     this.order_time  = new Date().toISOString().replace('T',' ').replace('Z','') ;
     this.order_type   = 0 ;
     this.remaining_quantity   = 0; 
     this.side   = 0 ;
     this.is_new   = 1 ;
     this.is_orderbook   = 1 ;
     this.update_time  = new Date().toISOString().replace('T',' ').replace('Z','') ;
     this.created_time  = new Date().toISOString().replace('T',' ').replace('Z','') ;
    }

    public verify(){
      var message ='';
      if(
        !this.client_order_id  ||
        !this.currency_pair_cd  ||
        !this.fill_condition  ||
        !this.filled_quantity  ||
        !this.order_quantity  ||
        !this.order_price  ||
        !this.remaining_quantity  ||
        !this.order_id  
        ){
        message = 'Value not null';
      }
      if(
        this.filled_quantity   < 0 ||
        this.order_quantity  < 0 ||
        this.order_price  < 0 ||
        this.remaining_quantity < 0
        ){
        message = 'Negative value';
      }

      if(
        !( /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})\.(\d{3})$/.test(this.order_book_time))||
        !( /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})\.(\d{3})$/.test(this.order_time)) ||
        !( /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})\.(\d{3})$/.test(this.update_time))||
        !( /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})\.(\d{3})$/.test(this.created_time))
        )	
      {
        message = 'Time not in format'
      }
  
    if(message){
      return {
        status :true,
        message :message
      }
    }else {
      return {
        status :false,
        message : 'Everything ok'
      }
    }
    }
  
  }