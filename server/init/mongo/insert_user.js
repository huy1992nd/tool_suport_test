var m_md_user = require('../../model/mongo/user');
var v_lst_account = [
    {
        acc: 'huy',
        fn : 'Nguyen Quang Huy', 
        u: 'demo',
        p: 123,
        t: 1,
        list_email:['nguyen.quang.huy@miyatsu.vn'],
        list_group:[
            {
                group_key:'bpex',
                rule:1,
            }
        ],
        list_task:[
            {
                name:'task_export_log_cpu'
            },
            {
                name:'task_export_trade'
            },
            {
                name:'task_show_rate_warning'
            },
            {
                name:'task_show_trade'
            },
            {
                name:'task_restart_trade'
            },
            {
                name:'task_job_daily'
            }
        ]  
    },
    {
        acc: 'hai',
        fn : 'Pham Cong Hai', 
        u: 'demo2',
        p: 123,
        t: 2,
        list_email:['pham.cong.hai@miyatsu.vn'],
        list_group:[
            {
                group_key:'bpex',
                rule:2,
            }
        ],
        list_task:[
            {
                name:'task_export_log_cpu'
            },
            {
                name:'task_export_trade'
            },
            {
                name:'task_show_rate_warning'
            },
            {
                name:'task_show_trade'
            },
            {
                name:'task_restart_trade'
            },
            {
                name:'task_job_daily'
            }
        ]   
    },
    {
        acc: 'lam',
        fn : 'Cao Vu Lam', 
        u: 'demo3',
        p: 123,
        t: 2,
        list_email:['cao.vu.lam@miyatsu.vn'],
        list_group:[
            {
                group_key:'bpex',
                rule:1,
            }
        ],
        list_task:[
            {
                name:'task_export_log_cpu'
            },
            {
                name:'task_export_trade'
            },
            {
                name:'task_show_rate_warning'
            },
            {
                name:'task_show_trade'
            },
            {
                name:'task_restart_trade'
            },
            {
                name:'task_job_daily'
            }
        ]  
    },
    {
        acc: 'thang',
        fn : 'Dao Ba Thang', 
        u: 'demo4',
        p: 123,
        t: 2,
        list_email:['dao.ba.thang@miyatsu.vn'],
        list_group:[
            {
                group_key:'bpex',
                rule:2,
            }
        ],
        list_task:[
            {
                name:'task_export_log_cpu'
            },
            {
                name:'task_export_trade'
            },
            {
                name:'task_show_rate_warning'
            },
            {
                name:'task_show_trade'
            },
            {
                name:'task_restart_trade'
            },
            {
                name:'task_job_daily'
            }
        ]  
    },
    {
        acc: 'hoat',
        fn : 'Vu Thi Hoat', 
        u: 'demo5',
        p: 123,
        t: 2,
        list_email:['vu.thi.hoat@miyatsu.vn'],
        list_group:[
            {
                group_key:'bpex',
                rule:2,
            }
        ],
        list_task:[
            {
                name:'task_export_log_cpu'
            },
            {
                name:'task_export_trade'
            },
            {
                name:'task_show_rate_warning'
            },
            {
                name:'task_show_trade'
            },
            {
                name:'task_restart_trade'
            },
            {
                name:'task_job_daily'
            }
        ]  
    },
    {
        acc: 'binh',
        fn : 'Nguyen Thai Binh', 
        u: 'demo6',
        p: 123,
        t: 2,
        list_email:['nguyen.thai.binh@miyatsu.vn'],
        list_group:[
            {
                group_key:'bpex',
                rule:2,
            }
        ],
        list_task:[
            {
                name:'task_export_log_cpu'
            },
            {
                name:'task_export_trade'
            },
            {
                name:'task_show_rate_warning'
            },
            {
                name:'task_show_trade'
            },
            {
                name:'task_restart_trade'
            },
            {
                name:'task_job_daily'
            }
        ]  
    }
]

for (let i = 0; i < v_lst_account.length; i++) {
    const e = v_lst_account[i];
    m_md_user.find({ account: e.acc }).exec().then(data=>{
        if (!data.length) {
            var user = new m_md_user();
            user.account = e.acc;
            user.username = e.u;
            user.password = e.p;
            user.full_name = e.fn;
            user.permission = e.t;
            user.list_group = e.list_group;
            user.list_email = e.list_email;
            user.list_task = e.list_task;
            user.save();
        }
    });
    
};
