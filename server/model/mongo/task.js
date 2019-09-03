// grab the things we need
var mongoose = require('mongoose');
var config = require('config');
mongoose.connect(config.get('mongodb').URI);
var Schema = mongoose.Schema;

// create a schema
var taskSchema = new Schema({
    task_name: { type: String, index: { unique: true } }, 
    task_name_detail: { type: String }, 
    description: String,
    active: Boolean,
    template: {},
    template_key: String,
    list_mail_other:[],
    list_group: [],
    send_chatwork: [],
    created_date: { type: 'Date', default: Date.now, required: true },
    edited_date: { type: 'Date', default: Date.now, required: true }
});

// the schema is useless so far
// we need to create a model using it
var Task = mongoose.model('task', taskSchema);

// make this available to our users in our Node applications
module.exports = Task;