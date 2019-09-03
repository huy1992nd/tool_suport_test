var SSH2Promise = require('ssh2-promise');
let config = require("config");
var MyEmitter = require('../lib/events');
var define_a = require('../define');
var chatWorkController = require('../lib/chatwork');
var logController = require('../lib/log_check').log;
var TaskModel = require('../model/mongo/task');

class checkLogController {
  constructor() {
    this.current_env = config.get("ssh").test;
    this.ssh = {
    }
    this.setENV();
    // run interver check change file
    var interver = setInterval(() => {
      var list_promise = [];
      list_promise.push(this.isChangeFile('api_spot'));
      list_promise.push(this.isChangeFile('api_margin'));
      Promise.all(list_promise).then((list_result) => {
        if (list_result.includes(1)) {
          this.run(define_a.status.task_check_log.data.form_data)
        }
      });
    }, config.get("check_log_change_file_time"))
  }

  saveEVNToDatabase(content) {
    TaskModel.findOne({
      task_name: 'task_check_log'
    }, function (err, task) {
      task.template.content = content;
      TaskModel.findOneAndUpdate({
        task_name: task.task_name
      }, { $set: task }, function (err, task_save) {
        console.log('save success', task_save);
        if (err) {
          console.log('err is', err)
        }
      });
    })
  }

  setENV() {
    Object.keys(this.current_env).forEach(module => {
      this.ssh[module] = new SSH2Promise([this.current_env[module]]);
    });
  }

  isChangeFile(module) {
    return new Promise((resolve, reject) => {
      if (define_a.status_2.task_check_log.run[module]) {
        let sftp = this.ssh[module].sftp();
        let folder_log = this.current_env[module].folder_log;
        sftp.readdir(folder_log).then((list_file) => {
          var update = 0;
          define_a.status.task_check_log.data.form_data.list_log_select.forEach(file_select => {
            let file_name_old = file_select.item_id.split("_____")[1];
            let module_info = file_select.item_id.split("_____")[0];
            if (!list_file.find(file => file.filename == file_name_old) && module_info == module) {
              try {
                let file_name_root = file_name_old.split("-")[0];
                let file_name_new = list_file.filter(file => file.filename.includes(file_name_root))[0].filename;
                define_a.status.task_check_log.data.form_data.list_log_select.map(file => {
                  if (file.item_id.includes(file_name_old)) {
                    file.item_id = file.item_id.replace(file_name_old, file_name_new);
                    file.file_name = file.file_name.replace(file_name_old, file_name_new);
                  }
                })
                update = 1;
              } catch (error) {
                console.log('Không tìm được file thay thế trong module ', file_name_old, module)
              }
            }
          });
          resolve(update);
        });
      } else {
        resolve(0);
      }
    });

  }

  stop(data) {
    define_a.status.task_check_log.data.form_data.running = 0;
    define_a.status.task_check_log.list_log = [];
    Object.keys(define_a.status_2.task_check_log.run).forEach(module => {
      if (define_a.status_2.task_check_log.run[module] != undefined) {
        this.ssh[module].spawn('\x03');
        define_a.status_2.task_check_log.run[module].close();
      }
    });
    MyEmitter.emit(define_a.MESSAGE_EMITER.CHECK_LOG_STOP, {
      result: 1,
      clientId: data.clientId
    });
    this.saveEVNToDatabase(JSON.stringify(define_a.status.task_check_log));

  }

  escape(string) {
    // return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    return string.replace(/[-\/\\^$*+?.[\]{}]/g, '\\$&')
  };


  checkStatus(data) {
    console.log('vao day');
    MyEmitter.emit(define_a.MESSAGE_EMITER.CHECK_LOG_STATUS, {
      status: define_a.status.task_check_log,
      clientId: data.clientId
    });
  }

  setConfig(data) {
    this.current_env = config.get("ssh")[data.data.environment];
    this.setENV();
    this.list_file_log(data);
  }


  list_file_log(data) {
    var list_promise = [];
    Object.keys(this.ssh).forEach(async module => {
      var promise = new Promise((resolve, reject) => {
        let sftp = this.ssh[module].sftp();
        let folder_log = this.current_env[module].folder_log;
        sftp.readdir(folder_log).then((list) => {
          resolve(list);
        });
      })
      list_promise.push(promise);
    });

    Promise.all(list_promise).then((list_file) => {
      var list_result = [];
      Object.keys(this.ssh).forEach((module, index) => {
        let result = list_file[index]
          .filter(e => define_a.regex.task_check_log[module].file.exec(e.filename))
          .filter(e => !e.filename.includes(".gz"))
          .map(e => {
            e.module = module;
            return e;
          });
        list_result.push(result);
      });

      MyEmitter.emit(define_a.MESSAGE_EMITER.CHECK_LOG_LIST_FILE, {
        list_file_log: list_result,
        clientId: data.clientId
      });
    });

  }

  parseLog(input, module, regex_str) {
    var r = new RegExp(this.escape(regex_str));
    var sub_add = regex_str ? input.split('\n').filter(e => r.exec(e)) : input.split('\n');
    let number_line = sub_add.length;
    if (number_line) {
      sub_add = sub_add.map(e => {
        e = `TIME : ${new Date().toLocaleString().replace("Z", "")} --- MODULE : ${module} --- CONTENT : ${e}  `;
        return e;
      });
      define_a.status.task_check_log.list_log = define_a.status.task_check_log.list_log.concat(sub_add);
      if (define_a.status.task_check_log.list_log.length > config.get("number_check_log")) {
        define_a.status.task_check_log.list_log = define_a.status.task_check_log.list_log.slice(define_a.status.task_check_log.list_log.length - config.get("number_check_log"), define_a.status.task_check_log.list_log.length - 1);
      }

      let last_line = sub_add.pop();
      this.sendCharWork(last_line, number_line, module);
      this.saveLog(last_line, number_line);
      MyEmitter.emit(define_a.MESSAGE_EMITER.CHECK_LOG_RESULT, {
        result: define_a.status.task_check_log.list_log
      });
    }
  }

  sendCharWork(message, length, module) {
    if (Date.now() - define_a.status.task_check_log.send_chatwork.time_send[module] > define_a.status.task_check_log.send_chatwork.time_count) {
      chatWorkController.sendChatWork(message + 'NUMBER LINE : ' + length, config.get('chatwork').task_check_log.roomId, config.get('chatwork').task_check_log.chatworkToken);
      define_a.status.task_check_log.send_chatwork.time_send[module] = Date.now();
    }
  }

  saveLog(message, length) {
    logController.info(message + '--- NUMBER LINE : ' + length);
  }

  runAfterRestart() {
    TaskModel.findOne({
      task_name: 'task_check_log'
    }, (err, task) => {
      if (err) throw err;
      if (!task) {
        console.log('can not get task check log')
      } else if (task) {
        if (task.template.content) {
          console.log('run task_check_log after restart')
          define_a.status.task_check_log = JSON.parse(task.template.content);
          if(define_a.status.task_check_log.data.form_data.running){
            this.run(define_a.status.task_check_log.data.form_data);
          }
        }
      }
    });
  }

  run(form_data) {
    define_a.status.task_check_log.running = 0;
    Object.keys(form_data.pattern).forEach(async module => {
      let regex_str = form_data.pattern[module] ? `(${form_data.pattern[module].trim().split("\n").join("|")})` : " ";
      let list_file_log = form_data.list_log_select.filter(e => e.item_id.split("_____")[0] == module);
      if (define_a.status_2.task_check_log.run[module] != undefined) {
        this.ssh[module].spawn('\x03');
        define_a.status_2.task_check_log.run[module].close();
      }
      if (list_file_log.length) {
        let path_file_log = `${list_file_log.map(e => `${this.current_env[module].folder_log}${e.item_id.split("_____")[1]}`).join(" ")}`;
        let command = `tail -F -n 0  ${path_file_log}  `;
        console.log('command', command);
        define_a.status_2.task_check_log.run[module] = await this.ssh[module].spawn(command);
        define_a.status_2.task_check_log.run[module].on('data', (data_) => {
          // console.log('Have error in module ', module, ' at ', new Date().toISOString());
          this.parseLog(data_.toString('utf8'), module, regex_str);
        });
      }
    })
    define_a.status.task_check_log.data.form_data = form_data;
    define_a.status.task_check_log.evn = this.current_env;
    define_a.status.task_check_log.running = 1;
    this.saveEVNToDatabase(JSON.stringify(define_a.status.task_check_log));
    MyEmitter.emit(define_a.MESSAGE_EMITER.CHECK_LOG_RESULT, {
      result: define_a.status.task_check_log.list_log
    });
  }
}

module.exports = new checkLogController();