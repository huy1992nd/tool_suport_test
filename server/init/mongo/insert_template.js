var m_t = require('../../model/mongo/template');
var v_lst = [
    {
       'task_name':'task_export_log_cpu',
       'content':{
        "logFileUrl":"/home/bpj/cpu-logs/"
    }
    },
    {
       'task_name':'task_export_trade',
       'content':{
        "ip_server_spot":"172.16.20.130",
        "ip_server_margin":"172.16.20.130",
        "spot_ssh_username":"bpex",
        "spot_ssh_password":"miyatsu@1",
        "margin_ssh_username":"bpex",
        "margin_ssh_password":"miyatsu@1",
        "cron":"0 1 14 * * *",
        "logFileUrl":[
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
    },
    },
    {
       'task_name':'task_show_trade',
       'content':{
           "server_public":"http://118.70.13.177:8020",
       }
    },
    {
       'task_name':'task_show_rate_warning',
       'content':{
           "server_public":"http://118.70.13.177:8020",
       }
    },
    {
       'task_name':'task_restart_trade',
       'content':{
           "server_public":"http://118.70.13.177:8020",
       }
    },
    {
       'task_name':'task_job_daily',
       'content':{
           "server_public":"http://118.70.13.177:8020",
       }
    },
]

for (let i = 0; i < v_lst.length; i++) {
    const e = v_lst[i];
    m_t.find({ task_name: e.task_name }).exec().then(data=>{
        if (!data.length) {
            var o = new m_t();
            o.task_name = e.task_name;
            o.content = e.content;
            o.save();
        }
    });
};

