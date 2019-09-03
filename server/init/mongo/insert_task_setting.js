var m_md_task = require('../../model/mongo/task_setting');
var v_lst_task = [
    {
        "acc":"Huy",
        "userName":"demo",
        "taskKey":"task_export_log_cpu",
        "description":"export file log cpu ",
        "active": false,
        "mail":[
            {
                "adress":"nguyen.quang.huy@miyatsu.vn",
                "active":false
            }
        ],
        "notify": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "active":true,
                "type":"ios"
            }   
        ]
    },
    {
        "acc":"Huy",
        "userName":"demo",
        "taskKey":"task_show_trade",
        "description":"task show trade ",
        "active": false,
        "mail":[
            {
                "adress":"nguyen.quang.huy@miyatsu.vn",
                "active":true
            }
        ],
        "notify": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "active":true,
                "type":"ios"
            }   
        ]
    },
    {
        "acc":"Huy",
        "userName":"demo",
        "taskKey":"task_export_trade",
        "description":"task export trade",
        "active": false,
        "mail":[
            {
                "adress":"nguyen.quang.huy@miyatsu.vn",
                "active":true
            }
        ],
        "notify": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "active":true,
                "type":"ios"
            }   
        ]
    },
    {
        "acc":"Huy",
        "userName":"demo",
        "taskKey":"task_show_rate_warning",
        "description":"task show rate warning ",
        "active": false,
        "mail":[
            {
                "adress":"nguyen.quang.huy@miyatsu.vn",
                "active":true
            }
        ],
        "notify": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "active":true,
                "type":"ios"
            }   
        ]
    },
    {
        "acc":"Huy",
        "userName":"demo",
        "taskKey":"task_restart_trade",
        "description":"task restart trade ",
        "active": false,
        "mail":[
            {
                "adress":"nguyen.quang.huy@miyatsu.vn",
                "active":true
            }
        ],
        "notify": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "active":true,
                "type":"ios"
            }   
        ]
    },
    {
        "acc":"Huy",
        "userName":"demo",
        "taskKey":"task_job_daily",
        "description":"task restart job ",
        "active": false,
        "mail":[
            {
                "adress":"nguyen.quang.huy@miyatsu.vn",
                "active":true
            }
        ],
        "notify": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "active":true,
                "type":"ios"
            }   
        ]
    },
    {
        "acc":"Hai",
        "userName":"demo2",
        "taskKey":"task_export_log_cpu",
        "description":"export file log cpu ",
        "active": false,
        "mail":[
            {
                "adress":"pham.cong.hai@miyatsu.vn",
                "active":false
            }
        ],
        "notify": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "active":true,
                "type":"ios"
            }   
        ]
    },
    {
        "acc":"Hai",
        "userName":"demo2",
        "taskKey":"task_show_trade",
        "description":"task show trade ",
        "active": false,
        "mail":[
            {
                "adress":"pham.cong.hai@miyatsu.vn",
                "active":true
            }
        ],
        "notify": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "active":true,
                "type":"ios"
            }   
        ]
    },
    {
        "acc":"Hai",
        "userName":"demo2",
        "taskKey":"task_export_trade",
        "description":"task export trade",
        "active": false,
        "mail":[
            {
                "adress":"pham.cong.hai@miyatsu.vn",
                "active":true
            }
        ],
        "notify": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "active":true,
                "type":"ios"
            }   
        ]
    },
    {
        "acc":"Hai",
        "userName":"demo2",
        "taskKey":"task_show_rate_warning",
        "description":"task show rate warning ",
        "active": false,
        "mail":[
            {
                "adress":"pham.cong.hai@miyatsu.vn",
                "active":true
            }
        ],
        "notify": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "active":true,
                "type":"ios"
            }   
        ]
    },
    {
        "acc":"Hai",
        "userName":"demo2",
        "taskKey":"task_restart_trade",
        "description":"task restart trade ",
        "active": false,
        "mail":[
            {
                "adress":"pham.cong.hai@miyatsu.vn",
                "active":true
            }
        ],
        "notify": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "active":true,
                "type":"ios"
            }   
        ]
    },
    {
        "acc":"Hai",
        "userName":"demo2",
        "taskKey":"task_job_daily",
        "description":"task restart trade ",
        "active": false,
        "mail":[
            {
                "adress":"pham.cong.hai@miyatsu.vn",
                "active":true
            }
        ],
        "notify": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "active":true,
                "type":"ios"
            }   
        ]
    },
    {
        "acc":"Lam",
        "userName":"demo3",
        "taskKey":"task_export_log_cpu",
        "description":"export file log cpu ",
        "active": false,
        "mail":[
            {
                "adress":"cao.vu.lam@miyatsu.vn",
                "active":false
            }
        ],
        "notify": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "active":false,
                "type":"ios"
            }   
        ]
    },
    {
        "acc":"Lam",
        "userName":"demo3",
        "taskKey":"task_show_trade",
        "description":"task show trade ",
        "active": false,
        "mail":[
            {
                "adress":"cao.vu.lam@miyatsu.vn",
                "active":false
            }
        ],
        "notify": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "active":false,
                "type":"ios"
            }   
        ]
    },
    {
        "acc":"Lam",
        "userName":"demo3",
        "taskKey":"task_export_trade",
        "description":"task export trade",
        "active": false,
        "mail":[
            {
                "adress":"cao.vu.lam@miyatsu.vn",
                "active":false
            }
        ],
        "notify": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "active":false,
                "type":"ios"
            }   
        ]
    },
    {
        "acc":"Lam",
        "userName":"demo3",
        "taskKey":"task_show_rate_warning",
        "description":"task show rate warning ",
        "active": false,
        "mail":[
            {
                "adress":"cao.vu.lam@miyatsu.vn",
                "active":false
            }
        ],
        "notify": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "active":false,
                "type":"ios"
            }   
        ]
    },
    {
        "acc":"Lam",
        "userName":"demo3",
        "taskKey":"task_restart_trade",
        "description":"task restart trade ",
        "active": false,
        "mail":[
            {
                "adress":"cao.vu.lam@miyatsu.vn",
                "active":false
            }
        ],
        "notify": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "active":false,
                "type":"ios"
            }   
        ]
    },
    {
        "acc":"Lam",
        "userName":"demo3",
        "taskKey":"task_job_daily",
        "description":"task restart trade ",
        "active": false,
        "mail":[
            {
                "adress":"cao.vu.lam@miyatsu.vn",
                "active":false
            }
        ],
        "notify": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "active":false,
                "type":"ios"
            }   
        ]
    },
    {
        "acc":"Thang",
        "userName":"demo4",
        "taskKey":"task_export_log_cpu",
        "description":"export file log cpu ",
        "active": false,
        "mail":[
            {
                "adress":"dao.ba.thang@miyatsu.vn",
                "active":false
            }
        ],
        "notify": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "active":false,
                "type":"ios"
            }   
        ]
    },
    {
        "acc":"Thang",
        "userName":"demo4",
        "taskKey":"task_show_trade",
        "description":"task show trade ",
        "active": false,
        "mail":[
            {
                "adress":"dao.ba.thang@miyatsu.vn",
                "active":false
            }
        ],
        "notify": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "active":false,
                "type":"ios"
            }   
        ]
    },
    {
        "acc":"Thang",
        "userName":"demo4",
        "taskKey":"task_export_trade",
        "description":"task export trade",
        "active": false,
        "mail":[
            {
                "adress":"dao.ba.thang@miyatsu.vn",
                "active":false
            }
        ],
        "notify": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "active":false,
                "type":"ios"
            }   
        ]
    },
    {
        "acc":"Thang",
        "userName":"demo4",
        "taskKey":"task_show_rate_warning",
        "description":"task show rate warning ",
        "active": false,
        "mail":[
            {
                "adress":"dao.ba.thang@miyatsu.vn",
                "active":false
            }
        ],
        "notify": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "active":false,
                "type":"ios"
            }   
        ]
    },
    {
        "acc":"Thang",
        "userName":"demo4",
        "taskKey":"task_restart_trade",
        "description":"task restart trade",
        "active": false,
        "mail":[
            {
                "adress":"dao.ba.thang@miyatsu.vn",
                "active":false
            }
        ],
        "notify": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "active":false,
                "type":"ios"
            }   
        ]
    },
    {
        "acc":"Thang",
        "userName":"demo4",
        "taskKey":"task_job_daily",
        "description":"task restart trade",
        "active": false,
        "mail":[
            {
                "adress":"dao.ba.thang@miyatsu.vn",
                "active":false
            }
        ],
        "notify": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "active":false,
                "type":"ios"
            }   
        ]
    },
    {
        "acc":"Hoat",
        "userName":"demo5",
        "taskKey":"task_export_log_cpu",
        "description":"export file log cpu ",
        "active": false,
        "mail":[
            {
                "adress":"vu.thi.hoat@miyatsu.vn",
                "active":false
            }
        ],
        "notify": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "active":false,
                "type":"ios"
            }   
        ]
    },
    {
        "acc":"Hoat",
        "userName":"demo5",
        "taskKey":"task_show_trade",
        "description":"task show trade ",
        "active": false,
        "mail":[
            {
                "adress":"vu.thi.hoat@miyatsu.vn",
                "active":false
            }
        ],
        "notify": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "active":false,
                "type":"ios"
            }   
        ]
    },
    {
        "acc":"Hoat",
        "userName":"demo5",
        "taskKey":"task_export_trade",
        "description":"task export trade",
        "active": true,
        "mail":[
            {
                "adress":"vu.thi.hoat@miyatsu.vn",
                "active":false
            }
        ],
        "notify": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "active":false,
                "type":"ios"
            }   
        ]
    },
    {
        "acc":"Hoat",
        "userName":"demo5",
        "taskKey":"task_show_rate_warning",
        "description":"task show rate warning ",
        "active": false,
        "mail":[
            {
                "adress":"vu.thi.hoat@miyatsu.vn",
                "active":false
            }
        ],
        "notify": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "active":false,
                "type":"ios"
            }   
        ]
    },
    {
        "acc":"Hoat",
        "userName":"demo5",
        "taskKey":"task_restart_trade",
        "description":"task restart trade ",
        "active": false,
        "mail":[
            {
                "adress":"vu.thi.hoat@miyatsu.vn",
                "active":false
            }
        ],
        "notify": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "active":false,
                "type":"ios"
            }   
        ]
    },
    {
        "acc":"Hoat",
        "userName":"demo5",
        "taskKey":"task_job_daily",
        "description":"task restart trade ",
        "active": false,
        "mail":[
            {
                "adress":"vu.thi.hoat@miyatsu.vn",
                "active":false
            }
        ],
        "notify": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "active":false,
                "type":"ios"
            }   
        ]
    },
	{
        "acc":"Binh",
        "userName":"demo6",
        "taskKey":"task_export_log_cpu",
        "description":"export file log cpu ",
        "active": false,
        "mail":[
            {
                "adress":"nguyen.thai.binh@miyatsu.vn",
                "active":false
            }
        ],
        "notify": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "active":false,
                "type":"ios"
            }   
        ]
    },
    {
        "acc":"Binh",
        "userName":"demo6",
        "taskKey":"task_show_trade",
        "description":"task show trade ",
        "active": false,
        "mail":[
            {
                "adress":"nguyen.thai.binh@miyatsu.vn",
                "active":false
            }
        ],
        "notify": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "active":false,
                "type":"ios"
            }   
        ]
    },
    {
        "acc":"Binh",
        "userName":"demo6",
        "taskKey":"task_export_trade",
        "description":"task export trade",
        "active": false,
        "mail":[
            {
                "adress":"nguyen.thai.binh@miyatsu.vn",
                "active":false
            }
        ],
        "notify": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "active":false,
                "type":"ios"
            }   
        ]
    },
    {
        "acc":"Binh",
        "userName":"demo6",
        "taskKey":"task_show_rate_warning",
        "description":"task show rate warning ",
        "active": false,
        "mail":[
            {
                "adress":"nguyen.thai.binh@miyatsu.vn",
                "active":false
            }
        ],
        "notify": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "active":false,
                "type":"ios"
            }   
        ]
    },
    {
        "acc":"Binh",
        "userName":"demo6",
        "taskKey":"task_restart_trade",
        "description":"task restart trade",
        "active": false,
        "mail":[
            {
                "adress":"nguyen.thai.binh@miyatsu.vn",
                "active":false
            }
        ],
        "notify": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "active":false,
                "type":"ios"
            }   
        ]
    },
    {
        "acc":"Binh",
        "userName":"demo6",
        "taskKey":"task_job_daily",
        "description":"task restart trade",
        "active": false,
        "mail":[
            {
                "adress":"nguyen.thai.binh@miyatsu.vn",
                "active":false
            }
        ],
        "notify": [
            {
                "token": "fcc6a8a5d9e9b14c554c9978316183d1",
                "active":false,
                "type":"ios"
            }   
        ]
    }
    
]

for (let i = 0; i < v_lst_task.length; i++) {
    const e = v_lst_task[i];
    m_md_task.find({ username: e.userName, task_name:e.taskKey }).exec().then(data=>{
        if (!data.length) {
            var task = new m_md_task();
            task.username = e.userName;
            task.task_name = e.taskKey;
            task.email = e.mail;
            task.account = e.acc;
            task.save();
        }
    })
    .catch(err=>{
        console.log('err',err);
    })
};
