exports.cron = {
    "task_export_log_cpu":"*/30 * * * * *",
    "task_export_trade":"0 59 15 * * *",
    "task_export_trade_2":"0 */10 * * * *",
    "task_show_trade":"1 * * * * *"
}

exports.Message_Type = {
    TASK_EXPORT_LOG_CPU: "task_export_log_cpu",
    TASK_EXPORT_TRADE: "task_export_trade",
    TASK_SHOW_TRADE: "task_show_trade",
    TASK_SHOW_RATE_WARNING: "task_show_rate_warning",
    TASK_RESTART_TRADE: "task_restart_trade",
    TASK_JOB_DAILY: "task_job_daily",
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
            status:0
        },
        // {
        //     type:"spot",
        //     pair_cd:"notbtc_jpy",
        //     url:"/home/bpj/bpex_release/api_spot/logs/",
        //     status:0
        // },
        // {
        //     type:"spot",
        //     pair_cd:"btc_others",
        //     url:"/home/bpj/bpex_release/api_spot/logs/",
        //     status:0
        // },
        // {
        //     type:"spot",
        //     pair_cd:"notbtc_other",
        //     url:"/home/bpj/bpex_release/api_spot/logs/",
        //     status:0
        // },
		// {
        //     type:"spot",
        //     pair_cd:"crypto_crypto",
        //     url:"/home/bpj/bpex_release/api_spot/logs/",
        //     status:0
        // },
        // {
        //     type:"margin",
        //     pair_cd:"btc_jpy",
        //     url:"/home/bpj/bpex_release/api_margin/logs/",
        //     status:0
        // },
        // {
        //     type:"margin",
        //     pair_cd:"margin_other",
        //     url:"/home/bpj/bpex_release/api_margin/logs/",
        //     status:0
        // }
    ]
    
};
exports.pathFileTmp = "/log/tmp/";

exports.pathFileTemplate = {
    "task_export_log_cpu":"/files/template/task_export_log_cpu/cpu-ram-log_2018-07-20_15h50-16h20.xlsx",
    "task_export_trade":"/files/template/task_export_trade/template.xlsx"
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
