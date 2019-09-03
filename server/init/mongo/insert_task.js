var m_md_task = require('../../model/mongo/task');
var v_lst_task = [
    {
        "key":"task_export_log_cpu",
        "name":"task export log cpu",
        "description":"export file log ",
        "active": false,
        "type":"cronjob",
        "time":"",
        "list_mail_other":[],
        "list_group":[
            {
                group_key:'bpex',
                rule:1,
            }
        ],
        "template_key":"task_export_log_cpu",
        "template":{
            "logFileUrl":"/home/bpj/cpu-logs/"
        },
        "send_chatwork": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "roomId":"110664331",
                "name":"bpex-test"
            }   
        ]
    },
    {
        "key":"task_export_trade",
        "name":"task export trade",
        "description":"show notification ",
        "active": false,
        "type":"cronjob",
        "time":"",
        "list_mail_other":[],
        "list_group":[
            {
                group_key:'bpex',
                rule:1,
            }
        ],
        "template_key":"task_export_trade",
        "template":{
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
                    url:"/home/bpex/huy/logs/",
                    status:0
                },
                {
                    type:"spot",
                    pair_cd:"notbtc_jpy",
                    url:"/home/bpex/huy/logs/",
                    status:0
                },
                {
                    type:"spot",
                    pair_cd:"btc_others",
                    url:"/home/bpex/huy/logs/",
                    status:0
                },
                {
                    type:"spot",
                    pair_cd:"notbtc_other",
                    url:"/home/bpex/huy/logs/",
                    status:0
                },
                {
                    type:"spot",
                    pair_cd:"crypto_crypto",
                    url:"/home/bpex/huy/logs/",
                    status:0
                },
                {
                    type:"margin",
                    pair_cd:"btc_jpy",
                    url:"/home/bpex/huy/logs/",
                    status:0
                },
                {
                    type:"margin",
                    pair_cd:"margin_other",
                    url:"/home/bpex/huy/logs/",
                    status:0
                } 
            ]
        },
        "send_chatwork": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "roomId":"110664331",
                "name":"bpex-test"
            }    
        ]
    },
    {
        "key":"task_show_trade",
        "name":"task show trade",
        "description":"show notification ",
        "active": false,
        "type":"cronjob",
        "time":"",
        "list_mail_other":[],
        "list_group":[
            {
                group_key:'bpex',
                rule:1,
            }
        ],
        "template_key":"task_show_trade",
        "template":{
             "server_public":"http://118.70.13.177:8020"
        },
        "send_chatwork": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "roomId":"110664331",
                "name":"bpex-test"
            }    
        ]
    },
    {
        "key":"task_show_rate_warning",
        "name":"task show rate warning",
        "description":"show warning when get rate disconnect ",
        "active": false,
        "type":"cronjob",
        "time":"",
        "list_mail_other":[],
        "list_group":[
            {
                group_key:'bpex',
                rule:1,
            }
        ],
        "template_key":"task_show_rate_warning",
        "template":{
             "server_public":"http://118.70.13.177:8020"
        },
        "send_chatwork": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "roomId":"110664331",
                "name":"bpex-test"
            }    
        ]
    },
    {
        "key":"task_restart_trade",
        "name":"task restart trade",
        "description":"show restart api system ",
        "active": true,
        "type":"cronjob",
        "time":"",
        "list_mail_other":[],
        "list_group":[
            {
                group_key:'bpex',
                rule:1,
            }
        ],
        "template_key":"task_restart_trade",
        "template":{
             "server_public":"http://118.70.13.177:8020"
        },
        "send_chatwork": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "roomId":"110664331",
                "name":"bpex-test"
            }    
        ]
    },
    {
        "key":"task_job_daily",
        "name":"task job daily",
        "description":"show restart api system on chatwork ",
        "active": true,
        "type":"cronjob",
        "time":"",
        "list_mail_other":[],
        "list_group":[
            {
                group_key:'bpex',
                rule:1,
            }
        ],
        "template_key":"task_job_daily",
        "template":{
             "server_public":"http://118.70.13.177:8020"
        },
        "send_chatwork": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "roomId":"110664331",
                "name":"bpex-test"
            }    
        ]
    }
]

for (let i = 0; i < v_lst_task.length; i++) {
    const e = v_lst_task[i];
    m_md_task.find({ task_name: e.key }).exec().then(data=>{
        if (!data.length) {
            var job = new m_md_task();
            job.task_name = e.key;
            job.task_name_detail = e.name;
            job.description = e.description;
            job.active = e.active;
            job.list_mail_other = e.list_mail_other;
            job.list_group = e.list_group;
            job.send_chatwork = e.send_chatwork;
            job.template = e.template;
            job.template_key = e.template_key;
            job.save();
        }
    })
    .catch(err=>{
        console.log('err',err);
    })
};
