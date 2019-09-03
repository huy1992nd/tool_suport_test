// define release
exports.listjob = [
    {
        "key":"task_export_log_cpu",
        "description":"export file log ",
        "active": false,
        "type":"cronjob",
        "time":"",
        "send_chatwork": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "roomId":"122131822"
            }   
        ]
    },
    {
        "key":"task_export_trade",
        "description":"show notification ",
        "active": true,
        "type":"cronjob",
        "time":"",
        "send_chatwork": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "roomId":"122131822"
            }    
        ]
    },
    {
        "key":"task_show_trade",
        "description":"show notification ",
        "active": true,
        "type":"cronjob",
        "time":"",
        "send_chatwork": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "roomId":"122131822"
            }    
        ]
    },
    {
        "key":"task_show_rate_warning",
        "description":"show warning when get rate disconnect ",
        "active": false,
        "type":"cronjob",
        "time":"",
        "send_chatwork": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "roomId":"122131822"
            }    
        ]
    }
]

exports.chatWorkGroup = [
    {
        "token": "fcc6a8a5d9e9b14c554c9978316183d1",
        "roomId":"122131822",
        "group_id": 1
    },
    {
        "token": "fcc6a8a5d9e9b14c554c9978316183d1",
        "roomId":"122131822",
        "group_id": 2
    }
]

exports.User = [
    {
        account: "Huy",
        username:'demo',
        password:123,
        rule:{
            task_export_log_cpu: true,
            task_export_trade: true,
            task_show_trade: true,
            task_show_rate_warning: true
        },
        email:[
            "nguyen.quang.huy@miyatsu.vn"
        ],
        notify: []
    },
    {
        account: "Hai",
        rule:{
            task_export_log_cpu: true,
            task_export_trade: true,
            task_show_trade: true,
            task_show_rate_warning: true
        },
        email:[
            "pham.cong.hai@miyatsu.vn"
        ],
        notify: [
            {
                token:111111,
                device: 'ios'
            },
            {
                token:111111,
                device: 'android'
            }
        ]
           
        },
    {
        account: "Lam",
        rule:{
            task_export_log_cpu: false,
            task_export_trade: true,
            task_show_trade: true,
            task_show_rate_warning: false
        },
        email:[
            "cao.vu.lam@miyatsu.vn"
        ],
        notify: []
    },
    {
        account: "Thang",
        rule:{
            task_export_log_cpu: false,
            task_export_trade: false,
            task_show_trade: false,
            task_show_rate_warning: true
        },
        email:[
            "dao.ba.thang@miyatsu.vn"
        ],
        notify: []
    },
    {
        account: "Binh",
        rule:{
            task_export_log_cpu: false,
            task_export_trade: false,
            task_show_trade: true,
            task_show_rate_warning: true
        },
        email:[
            "nguyen.thai.binh@miyatsu.vn"
        ],
        notify: []
    },
	{
        account: "Hoat",
        rule:{
            task_export_log_cpu: false,
            task_export_trade: false,
            task_show_trade: true,
            task_show_rate_warning: true
        },
        email:[
            "vu.thi.hoat@miyatsu.vn"
        ],
        notify: []
    }
]

exports.cron = {
    "task_export_log_cpu":"*/30 * * * * *",
    "task_export_trade":"0 1 14 * * *",
    "task_export_trade_2":"0 */10 * * * *",
    "task_show_trade":"1 * * * * *"
}

exports.Message_Type = {
    TASK_EXPORT_LOG_CPU: "task_export_log_cpu",
    TASK_EXPORT_TRADE: "task_export_trade",
    TASK_SHOW_TRADE: "task_show_trade",
    TASK_SHOW_RATE_WARNING: "task_show_rate_warning"
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
    // "task_show_trade":"http://localhost:8010"
    "task_show_trade":"http://118.70.13.177:8010",
    "task_show_rate_warning":"http://118.70.13.177:8010",
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

