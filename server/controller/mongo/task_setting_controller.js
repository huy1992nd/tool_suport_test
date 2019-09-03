var mongoose = require('mongoose');
var TaskSettingModel = require('../../model/mongo/task_setting');
function convertJson(input){
    if (typeof input === 'string' || input instanceof String){
        return JSON.parse(input);
    }else{
        return input;
    }
}

function get_task_name(task_name) {
     var result = {
        'ja' : task_name.replace("_", " "),
        'vi' : task_name.replace("_", " "),
        'en' : task_name.replace("_", " ")
     }
      switch (task_name) {
          case 'task_export_log_cpu':
            result = {
                'ja' : "CPUログエクスポート",
                'vi' : "Trích Xuất CPU Log",
                'en' : 'Export CPU Log'
            }
              break;
      
          case 'task_show_rate_warning':
            result = {
                'ja' : "レート情報",
                'vi' : "Thông Tin Tỷ Giá",
                'en' : "Rate Information"
            }
              break;
      
          case 'task_show_trade':
            result = {
                'ja' :  "取引情報",
                'vi' :  "Thông Tin Giao Dịch",
                'en' : "Trade Information"
            }
              break;
      
          case 'task_export_trade':
            result = {
                'ja' : "取引時間エクスポート",
                'vi' : "Trích Xuất Thời Gian Giao Dịch",
                'en' : "Export Trade Time"
            }
              break;

          case 'task_restart_trade':
            result = {
                'ja' : task_name.replace("_", " "),
                'vi' : "Thông tin restart trade",
                'en' : "Restart trade info"
            }
              break;

          case 'task_job_daily':
            result = {
                'ja' : task_name.replace("_", " "),
                'vi' : "Thông tin restart job daily",
                'en' : "Restart job daily info "
            }
              break;
      
          default:
              break;
      }
    
      return result;
}

class taskSetting {
    constructor() {
    }

    list_task(req, res) {
        var user = req.user;
        req.body = convertJson(JSON.stringify(req.body));
        TaskSettingModel.find({
            username: user.username
        }, function(err, listTask) {
            if (err) throw err;
            if (!listTask) {
            res.status(401).json({
                resultCode :1,  
            });
            } else if (listTask) {
                var result =[];
                listTask.map(task=>{
                    console.log('task is', task);
                    task.notify.map(device=>{
                       if(device.token == req.body.token_device){
                        var is_active = device.active? 1:0
                        result.push({
                            name:task.task_name,
                            active:is_active,
                            name_detail: get_task_name(task.task_name)
                        })
                       }            
                    })
                });
                res.json(
                    {
                    resultCode:0,    
                    list_task:result
                    }
                );
            }
        });
    };

    edit_list_task(req, res) {
        var user = req.user;
        req.body = convertJson(JSON.stringify(req.body));
        req.body.listTask.map(task=>{
            TaskSettingModel.findOne({
                username:user.username,
                task_name:task.name
            },function (err,taskSetting) {
                var index_device = taskSetting.notify.map(function(notify) { return notify.token; }).indexOf(req.body.token_device);
                if(index_device >=0){
                    taskSetting.notify[index_device].active = task.active? true:false;
                }
                TaskSettingModel.findOneAndUpdate({
                    username:user.username,
                    task_name:task.name
                },{$set: taskSetting},function(err,task){
                    console.log('save success', task);
                    if(err){
                        console.log('err is', err)
                    }
                    
                });
            })
        });
        res.json({resultCode :0});
    };

    //web
    list_task_setting_web(req, res) {
        var data = convertJson(JSON.stringify(req.body));
        
        let condition = {}
        if(data.username){
            condition.username = data.username;
        }
        if(data.task_name){
            condition.task_name = data.task_name;
        }

        TaskSettingModel.find(condition, function(err, listTask) {
            if (err) throw err;
            if (!listTask) {
            res.status(401).json({
                resultCode :1,  
            });
            } else if (listTask) {
                res.json(
                    {
                    resultCode:0,    
                    list_task_setting:listTask
                    }
                );
            }
        });
    };

    update(req, res) {
        var list_task = convertJson(JSON.stringify(req.body));
        console.log('list_task is',list_task);
        list_task.map(task=>{
            TaskSettingModel.findOneAndUpdate({
                username:task.username,
                task_name:task.task_name
            },{$set: task},function(err,task){
                console.log('save success', task);
                if(err){
                    console.log('err is', err)
                }
            });
        });
        res.json({resultCode :0});
    };

    getByTask(task_name) {
        return TaskSettingModel.find({task_name:task_name}).exec();
    }

    async insert(req, res) {
        var task = convertJson(JSON.stringify(req.body));
        var model = new TaskSettingModel(task);
        try {
            const result = await model.save();
            return res.json({
                resultCode :0,
                taskSetting:result
                });
        } catch(err){
            console.log('err insert task setting',err);
        }

    };

    async remove(req, res) {
        var task = convertJson(JSON.stringify(req.body));
        var condition = {};
        if(task.username){
            condition.username = task.username;
        }
        if(task.task_name){
            condition.task_name = task.task_name
        }

        TaskSettingModel.deleteMany(condition,function (err, result){
            if (err) throw err;
            console.log('delete tast setting ok');
            res.json({resultCode:0});
        });
    };

}

module.exports = new taskSetting();
