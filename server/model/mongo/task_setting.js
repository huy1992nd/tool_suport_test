// grab the things we need
var mongoose = require('mongoose');
var config = require('config');
mongoose.connect(config.get('mongodb').URI);
var Schema = mongoose.Schema;

// create a schema
var taskSettingSchema = new Schema({
    account:String,
    task_name: String, 
    username: String,
    email:[],
    notify: [],
    created_date: { type: 'Date', default: Date.now, required: true },
    edited_date: { type: 'Date', default: Date.now, required: true }
});

var taskSetting = mongoose.model('taskSetting', taskSettingSchema);

// make this available to our users in our Node applications
module.exports = taskSetting;