var monitor_define = require('./define');
var task = require('./controller/mongo/task_controller');

require('events').EventEmitter.defaultMaxListeners = 100000;
var express = require('express');
var app = express();
//api
var apiController = require('./controller/api/api.controller');
// run task
var Run = require('./task/run');

async function run() {
    Run.Run();
}

run();

startService = function() {
    apiController.Init();
}

startService();
