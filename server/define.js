exports.task_status = {
  "run_now":[],
  "daily":[],
  "daily_2":[]
};
exports.export_trade_status =[];
exports.cron = {
  "task_export_log_cpu":"*/30 * * * * *",
  "task_export_trade":"0 1 14 * * *",
  "task_export_trade_2":"*/20 * * * * *",
  "task_show_trade":"1 * * * * *"
}
exports.Message_Type = {
  TASK_EXPORT_LOG_CPU: "task_export_log_cpu",
  TASK_EXPORT_TRADE: "task_export_trade",
  TASK_SHOW_TRADE: "task_show_trade",
  TASK_SHOW_RATE_WARNING: "task_show_rate_warning",
  TASK_RESTART_TRADE: "task_restart_trade",
  TASK_JOB_DAILY: "task_job_daily",
  TASK_EXPORT_DB: "task_export_db",
  TASK_EXPORT_LOG_ANALYSE: "task_export_log_analyse"
};
exports.logFileUrlStart = "/home/bpj/cpu-logs/cpu.log";
exports.number_pair_cd = 2;
exports.logFileUrl= {
  "task_export_log_cpu":"/home/bpj/cpu-logs/",
  "task_export_trade":[
      {
          type:"spot",
          pair_cd:"btc_jpy",
          url:"/home/bpj/bpex_release/api_spot/logs/",
          status:0,
          size:1
      },
      {
          type:"spot",
          pair_cd:"notbtc_jpy",
          url:"/home/bpj/bpex_release/api_spot/logs/",
          status:0
      },
      {
          type:"spot",
          pair_cd:"btc_others",
          url:"/home/bpj/bpex_release/api_spot/logs/",
          status:0
      },
      {
          type:"spot",
          pair_cd:"notbtc_other",
          url:"/home/bpj/bpex_release/api_spot/logs/",
          status:0
      },
      {
          type:"spot",
          pair_cd:"crypto_crypto",
          url:"/home/bpj/bpex_release/api_spot/logs/",
          status:0
      },
      {
          type:"margin",
          pair_cd:"btc_jpy",
          url:"/home/bpj/bpex_release/api_margin/logs/",
          status:0
      },
      {
          type:"margin",
          pair_cd:"margin_other",
          url:"/home/bpj/bpex_release/api_margin/logs/",
          status:0
      } 
  ],
  "task_export_log_analyse":"/home/bpex/.pm2/logs"
};
exports.pathFileTmp = "/log/tmp/";
exports.pathFileTemplate = {
  "task_export_log_cpu":"/files/template/task_export_log_cpu/cpu-ram-log_2018-07-20_15h50-16h20.xlsx",
  "task_export_trade":"/files/template/task_export_trade/template.xlsx",
  "task_export_db":"/files/template/task_export_db/report.xlsx"
} 
exports.str_fillter = {
  "task_export_trade":"log_monitor_trade_"
}
exports.pathFileEJS = "/files/ejs/";
exports.pathFileSave = "/log/save/";
exports.file_name_default = "api_list2-2018-08-15.log";
exports.dayBefore = {
  "task_export_log_cpu":0,
  "task_export_trade":86400000
  // "task_export_trade":0
}
exports.dayBeforeDelete = {
  "task_export_log_cpu":0,
  "task_export_trade":11
  // "task_export_trade":0
}
exports.url_server_socket = {
  "task_export_log_cpu":'',
  "task_export_trade":'',
  "task_show_trade":"http://118.70.13.177:8020",
  "task_show_rate_warning":"http://118.70.13.177:8020",
  "task_restart_trade":"http://118.70.13.177:8020",
  "task_job_daily":"http://118.70.13.177:8020",
}
exports.Message_Socket = 'warning_message';
exports.list_ip_filter = {
  "task_show_trade":[
      "172.18.1.228",
      "172.18.1.227",
      "172.18.1.230",
      "172.18.1.231"
  ]
}
exports.current_config_redis = "dev";
exports.code_command = "miyatsu@1";
exports.subscribe_cmd = '_manual_command_response_';
exports.key_list_order = '_manual_command_orders_list';
exports.publish_cmd = '_manual_command_';
exports.list_market = [
  'spot',
  'margin',
];
exports.redis_cli = null;
exports.data_nop = 'data_nop';
exports.data_db = 'data_db';
exports.bpex_command = 'bpex_command';
exports.MESSAGE_EMITER = {
  LIST_FILE_LOG:"list_file_log",
  PARSE_FILE_LOG:"parse_file_log",
  PARSE_FILE_LOG_OK:"parse_file_log_ok",
  SET_CONFIG_CHECK_NOP_OK:'set_config_check_nop_ok',
  CHECK_NOP_RESULT:'check_nop_result',
  ERROR_PARSE_SCREEN_PRICE_ENGINE:'error_parse_screen_price_enigne',
  PARSE_SCREEN_PRICE_ENGINE_OK:'parse_screen_price_enigne_ok',
  CHECK_RATE_LIST_SYMBOL:'check_rate_list_symbol',
  CHECK_RATE_DATA:'check_rate_data',
  CHECK_RATE_SAVE_FORM_DATA:'check_rate_save_form_data',
  CHECK_RATE_CHANGE_ENVIRONMENT:'check_rate_change_environment',
  CHECK_RATE_ENVIRONMENT:'check_rate_environment',
  CHECK_RATE_CHANGE_NUMBER_EXCHANGE:'check_rate_change_number_exchange',
  FORMAT_DATA_GET_LIST_ORDER_BOOK:'format_data_get_list_order_book',
  CHECK_LOG_LIST_FILE: "check_log_list_file",
  CHECK_LOG_CONFIG: "check_log_config",
  CHECK_LOG_RESULT: "check_log_result",
  CHECK_LOG_STATUS: "check_log_status",
  CHECK_LOG_STOP: "check_log_stop"
}

exports.MESSAGE_SOCKET = {
  LIST_FILE_LOG:"list_file_log",
  PARSE_FILE_LOG:"parse_file_log",
  EXPORT_FILE_LOG_ANALYSE:"export_file_log_analyse",
  FALLER_AUTHEN:"faller_authen",
  NOP_SCREEN_SETTING:"nop_screen_setting",
  NOP_SCREEN_CHECK:"nop_screen_check",
  CHECK_NOP_RESULT:'check_nop_result',
  ERROR_PARSE_SCREEN_PRICE_ENGINE:'error_parse_screen_price_enigne',
  PARSE_SCREEN_PRICE_ENGINE_OK:'parse_screen_price_enigne_ok',
  CHECK_RATE_LIST_SYMBOL:'check_rate_list_symbol',
  CHECK_RATE_DATA:'check_rate_data',
  CHECK_RATE_SAVE_FORM_DATA:'check_rate_save_form_data',
  CHECK_RATE_CHANGE_ENVIRONMENT:'check_rate_change_environment',
  CHECK_RATE_ENVIRONMENT:'check_rate_environment',
  CHECK_RATE_CHANGE_NUMBER_EXCHANGE:'check_rate_change_number_exchange',
  FORMAT_DATA_GET_LIST_ORDER_BOOK:'format_data_get_list_order_book',
  CHECK_LOG_LIST_FILE: "check_log_list_file",
  CHECK_LOG_CONFIG: "check_log_config",
  CHECK_LOG_RESULT: "check_log_result",
  CHECK_LOG_STATUS: "check_log_status",
  CHECK_LOG_STOP: "check_log_stop"
}

exports.KeyJwt = 'MONEYANDLOVE';
exports.status = {
  "task_check_log":{
     "data":{},
     "evn":"test",
     "list_log":[],
     "send_chatwork":{
       "running":0,
       "status":1,
       "time_count":20000,
       "time_send":{ 
        "mysql":Date.now() - 20000,
        "nop":Date.now() - 20000,
        "bpex_core":Date.now() - 20000,
        "price_engine":Date.now() - 20000,
        "gateway":Date.now() - 20000,
        "api_spot":Date.now() - 20000,
        "api_margin":Date.now() - 20000
       }
     }
  },

  "task_check_rate":{
  }

}
exports.status_2 = {
  "task_check_log":{
    "run":{}
  }
}


exports.regex = {
  "task_check_log":{
    "mysql":{
      "file":/error.log/,
      "content":/([Warning]|[ERROR])/
    },
    "nop":{
      "file":/nop-error.log/,
      "content":/^.*/
    },
    "bpex_core":{
      "file":/^(spot|margin).*\.log$/,
      "content":/(terminate|ERROR)/
    },
    "price_engine":{
      "file":/^pe.*\.log$/,
      "content":/(Warning|ERROR)/
    },
    "gateway":{
      "file":/^.*\.log$/,
      "content":/(SyntaxError|rate not true)/
    },
    "api_spot":{
      "file":/^api.*\.log$/,
      "content":/(RestartAPI Error|port die|FAILED|App not ready)/
    },
    "api_margin":{
      "file":/^api.*\.log$/,
      "content":/FAILED/
    }
    
  }
}

exports.regex_bk = {
  "task_check_log":{
    "price_engine":{
      "file":/^pe.*\.log$/,
      "content":/(Warning|ERROR)/
    }
  }
}




