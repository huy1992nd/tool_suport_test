import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';
import  * as global from '../../common/settingManager';
import { DataService } from '../data/data.service';

@Injectable()

export class SocketService {

  // Our socket connection
  public  socket;

  constructor(
    private dataService:DataService
  ) { 
      this.InitSocket();
  }

  InitSocket(){
    this.socket = io(global.server_socket);
    this.socket.on('connect', ()=>{
        console.log('connected to server socket ', global.server_socket);
    });

    this.socket.on('fx_rates', (data)=>{
       console.log('data_fx_rate is', data)
    });
    this.socket.on('fx_message', (data)=>{
       console.log('data_fx_message is', data)
    });
    this.socket.on('fx_markup', (data)=>{
       console.log('data_fx_markup is', data);
    });

    this.socket.on(global.MESSAGESOCKET.SET_CONFIG_CHECK_NOP_OK, (data)=>{
      data.type = global.MESSAGESOCKET.SET_CONFIG_CHECK_NOP_OK;
      this.dataService.checkNOP.next(data);
    });

    this.socket.on(global.MESSAGESOCKET.CHECK_NOP_RESULT, (data)=>{
      data.type = global.MESSAGESOCKET.CHECK_NOP_RESULT;
      this.dataService.checkNOP.next(data);
    });

    this.socket.on(global.MESSAGESOCKET.ERROR_PARSE_SCREEN_PRICE_ENGINE, (data)=>{
      data = global.MESSAGESOCKET.ERROR_PARSE_SCREEN_PRICE_ENGINE;
      this.dataService.checkNOP.next(
        {
          type:global.MESSAGESOCKET.ERROR_PARSE_SCREEN_PRICE_ENGINE,
          data:data
        }
        );
    });

    this.socket.on(global.MESSAGESOCKET.PARSE_SCREEN_PRICE_ENGINE_OK, (data)=>{
      this.dataService.checkNOP.next(
          {
            type:global.MESSAGESOCKET.PARSE_SCREEN_PRICE_ENGINE_OK,
            data:data
          }
        );
    });

    this.socket.on(global.MESSAGESOCKET.CHECK_RATE_CHANGE_ENVIRONMENT, (data)=>{
      this.dataService.checkNOP.next(
          {
            type:global.MESSAGESOCKET.CHECK_RATE_CHANGE_ENVIRONMENT,
            data:data
          }
        );
    });

    this.socket.on(global.MESSAGESOCKET.CHECK_RATE_ENVIRONMENT, (data)=>{
      this.dataService.checkRate.next(
          {
            type:global.MESSAGESOCKET.CHECK_RATE_ENVIRONMENT,
            data:data
          }
        );
    });

    this.socket.on(global.MESSAGESOCKET.CHECK_RATE_LIST_SYMBOL, (data)=>{
      this.dataService.checkRate.next(
          {
            type:global.MESSAGESOCKET.CHECK_RATE_LIST_SYMBOL,
            data:data
          }
        );
    });

    this.socket.on(global.MESSAGESOCKET.CHECK_RATE_DATA, (data)=>{
      this.dataService.checkRate.next(
          {
            type:global.MESSAGESOCKET.CHECK_RATE_DATA,
            data:data
          }
        );
    });
    
    this.socket.on(global.MESSAGESOCKET.FORMAT_DATA_GET_LIST_ORDER_BOOK, (data)=>{
      this.dataService.formatData.next(
          {
            type:global.MESSAGESOCKET.FORMAT_DATA_GET_LIST_ORDER_BOOK,
            data:data
          }
        );
    });

    this.socket.on(global.MESSAGESOCKET.CHECK_LOG_LIST_FILE, (data)=>{
      this.dataService.checkLog.next(
          {
            type:global.MESSAGESOCKET.CHECK_LOG_LIST_FILE,
            data:data
          }
        );
    });

    this.socket.on(global.MESSAGESOCKET.CHECK_LOG_RESULT, (data)=>{
      this.dataService.checkLog.next(
          {
            type:global.MESSAGESOCKET.CHECK_LOG_RESULT,
            data:data
          }
        );
    });

    this.socket.on(global.MESSAGESOCKET.CHECK_LOG_STATUS, (data)=>{
      this.dataService.checkLog.next(
          {
            type:global.MESSAGESOCKET.CHECK_LOG_STATUS,
            data:data
          }
        );
    });

    this.socket.on(global.MESSAGESOCKET.CHECK_LOG_STOP, (data)=>{
      this.dataService.checkLog.next(
          {
            type:global.MESSAGESOCKET.CHECK_LOG_STOP,
            data:data
          }
        );
    });

    this.socket.on('event', function(data){});
    this.socket.on('disconnect', function(){});
 }
 
 sendData(type,data) {
     this.socket.emit(type,data);
 }
         
}