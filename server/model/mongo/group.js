// grab the things we need
var mongoose = require('mongoose');
var config = require('config');
mongoose.connect(config.get('mongodb').URI);
var Schema = mongoose.Schema;

// create a schema
var groupSchema = new Schema({
    name: { type: String, index: { unique: true } }, 
    group_key: { type: String, index: { unique: true } }, 
    list_user: [],
    list_task: [],
    created_date: { type: 'Date', default: Date.now, required: true },
    edited_date: { type: 'Date', default: Date.now, required: true }
});

var Group = mongoose.model('group', groupSchema);

module.exports = Group;