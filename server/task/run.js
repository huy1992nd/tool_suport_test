const define_a = require('../define.js');
var cron = require('node-cron');
var checkLogController = require('../task/task_check_log');

exports.Run = function(task) {
    checkLogController.runAfterRestart();
}


// Cronjob in run