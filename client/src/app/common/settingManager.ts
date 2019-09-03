/**
 * Created by HAI on 5/23/2017.
 */
import {ToasterModule, ToasterService, ToasterConfig,Toast} from 'angular2-toaster';
import {Stringifier} from "postcss";
import { YearCellTemplateDirective } from '@progress/kendo-angular-dateinputs/dist/es2015/calendar/templates/year-cell-template.directive';
export var server: string = 'http://172.16.4.33:6789';
export var server_socket: string = 'http://172.16.20.130:5678';
// export var server: string = 'http://172.16.20.130:6789';
// export var server_socket: string = 'http://172.16.20.130:6789';
export var number_one_page = 50 ;
//Đợi 1 phút để hỏi lại mã code an toàn 
export var time_wait = 600000;

export var current_user:any;

export var list_crypto_2 = ["ETH_BTC","BCC_BTC","LTC_BTC","XRP_BTC"];

export var list_crypto_1 = [
  "BBB_BTC",
  "BBB_ETH"
];

export var MESSAGESOCKET = {
  "LIST_FILE_LOG":"list_file_log",
  "DATA_NOP":"data_nop",
  "CHECK_NOP":"check_nop",
  "DATA_DB":"data_db",
  "BPEX_COMMAND":"bpex_command",
  "EXPORT_FILE_LOG_ANALYSE":"export_file_log_analyse",
  "PARSE_FILE_LOG_OK":"parse_file_log_ok",
  "FALLER_AUTHEN":"faller_authen",
  "NOP_SCREEN_SETTING":'nop_screen_setting',
  "NOP_SCREEN_CHECK":'nop_screen_check',
  "SET_CONFIG_CHECK_NOP_OK":'set_config_check_nop_ok',
  "CHECK_NOP_RESULT":'check_nop_result',
  "ERROR_PARSE_SCREEN_PRICE_ENGINE":'error_parse_screen_price_enigne',
  "PARSE_SCREEN_PRICE_ENGINE_OK":'parse_screen_price_enigne_ok',
  "CHECK_RATE_ENVIRONMENT":'check_rate_environment',
  "CHECK_RATE_LIST_SYMBOL":'check_rate_list_symbol',
  "CHECK_RATE_DATA":'check_rate_data',
  "CHECK_RATE_SAVE_FORM_DATA":'check_rate_save_form_data',
  "CHECK_RATE_CHANGE_ENVIRONMENT":'check_rate_change_environment',
  "CHECK_RATE_CHANGE_NUMBER_EXCHANGE":'check_rate_change_number_exchange',
  "FORMAT_DATA_GET_LIST_ORDER_BOOK":'format_data_get_list_order_book',
  "CHECK_LOG_LIST_FILE":'check_log_list_file',
  "CHECK_LOG_CONFIG":'check_log_config',
  "CHECK_LOG_RESULT":'check_log_result',
  "CHECK_LOG_STATUS":'check_log_status',
  "CHECK_LOG_STOP":'check_log_stop'
}

export var number_order_book = 20;
export var lotlimit_rescale_ratio = 0.8;
export var number_log_show = 30;

