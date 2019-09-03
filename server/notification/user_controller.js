
var define_a = require('./../define');
var chatwork = require('./../lib/chatwork');
var mailer = require('./../lib/mailer');
var fcm = require('./../lib/fcm');
var JSZip = require("jszip");
var task_setting = require('../controller/mongo/task_setting_controller');
var user = require('../controller/mongo/user_controller');

function   getDate(task_name){
    var date_before = define_a.dayBefore[task_name];
    return new Date(Date.now()- date_before).toISOString().split('T')[0];
}

class UserController {
    constructor() {
     
    }

    sendChatwork(msg,chatwork_info){
        chatwork.sendChatWork( msg, chatwork_info.roomId, chatwork_info.token);
    }

    sendMail(emailAdress,path_file,file_name, task_name, account){
        mailer.sendMail("export file cpu_ram_hdd log success", emailAdress, " [Auto mail] export file " + file_name, path_file, file_name, task_name, account);
    }

    sendMailNotAttack(emailAdress, message,subject,task_name, account){
        mailer.sendMailNotAttack(emailAdress, message , subject,task_name, account);
    }

    async sendData(obj) {
        //send chat work
        if(obj.task.send_chatwork.length > 0) {
            obj.task.send_chatwork.map(chatworkGroup=>{
                this.sendChatwork(obj.message,chatworkGroup);
            });
        }

        // get data userSetting
        var dataTaskSetting = await task_setting.getByTask(obj.task.task_name);

        dataTaskSetting.map(userTask=>{
            // send mail
            userTask.email.map(email=>{
                if(email.active){
                    switch (obj.task.template_key) {
                        case define_a.Message_Type.TASK_EXPORT_LOG_CPU:
                            this.sendMail(email.adress,obj.path_file, obj.file_name,define_a.Message_Type.TASK_EXPORT_LOG_CPU, userTask.account);
                            break;

                        case define_a.Message_Type.TASK_EXPORT_TRADE: 
                            this.sendMail(email.adress,obj.path_file, obj.file_name,define_a.Message_Type.TASK_EXPORT_TRADE, userTask.account, getDate(define_a.Message_Type.TASK_EXPORT_TRADE));
                            break;

                        case define_a.Message_Type.TASK_SHOW_TRADE: 
                            if(obj.number_max){
                                this.sendMailNotAttack(email.adress, obj.message," [Auto mail] warning time execution trade ", define_a.Message_Type.TASK_SHOW_TRADE, userTask.account);
                            }
                            break; 

                        case define_a.Message_Type.TASK_SHOW_RATE_WARNING: 
                            if(obj.type){
                                this.sendMailNotAttack(email.adress, obj.message," [Auto mail] warning rate not connect ",define_a.Message_Type.TASK_SHOW_RATE_WARNING, userTask.account); 
                            }   
                            break;
                    
                        default:
                            break;
                    }
                }
            });

            // send device
            userTask.notify.map(device=>{
                if(device.active && device.login){
                    var id = obj.list_data_save.filter(function(data){ return data.username == userTask.username}).length ? obj.list_data_save.filter(function(data){ return data.username == userTask.username})[0]._id : '';
                    console.log('send device',device.token, obj.message );
                    fcm.sendFirebase(obj.message.replace(`[${obj.ip}]`,""),device.token, {id:id,type:1,sound:obj.sound, task_name:obj.task.task_name.replace(/_/g," ")})
                }
            });
        });
    } 
}

module.exports = new UserController();