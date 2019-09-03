var m_group = require('../../model/mongo/group');
var v_lst = [
    {
        name: 'bpex', 
        group_key: 'bpex', 
        list_user: [
            {
                username:'demo',
                account:'huy',
                permission:1
            },
            {
                username:'demo2',
                account:'hai',
                permission:1
            },
            {
                username:'demo3',
                account:'lam',
                permission:1
            },
            {
                username:'demo4',
                account:'thang',
                permission:1
            },
            {
                username:'demo5',
                account:'hoat',
                permission:1
            },
            {
                username:'demo6',
                account:'binh',
                permission:1
            }
        ],
        list_task: [
            {
                template:'task_show_trade',
                name:'task_show_trade'
            },
            {
                template:'task_export_trade',
                name:'task_export_trade'
            },
            {
                template:'task_export_log_cpu',
                name:'task_export_log_cpu'
            },
            {
                template:'task_show_rate_warning',
                name:'task_show_rate_warning'
            },
            {
                template:'task_restart_trade',
                name:'task_restart_trade'
            },
            {
                template:'task_job_daily',
                name:'task_job_daily'
            }
        ]
    }
]

for (let i = 0; i < v_lst.length; i++) {
    const e = v_lst[i];
    m_group.find({ name: e.name }).exec().then(data=>{
        if (!data.length) {
            var o = new m_group();
            o.name = e.name;
            o.group_key = e.group_key;
            o.list_user = e.list_user;
            o.list_task = e.list_task;
            o.save();
        }
    });
};