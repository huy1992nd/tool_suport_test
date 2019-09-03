// grab the things we need
var mongoose = require('mongoose');
var config = require('config');
mongoose.connect(config.get('mongodb').URI);
var Schema = mongoose.Schema;

// create a schema
var templateSchema = new Schema({
    task_name: { type: String, index: { unique: true } }, 
    description:String,
    content: {},
    created_date: { type: 'Date', default: Date.now, required: true },
    edited_date: { type: 'Date', default: Date.now, required: true }
});

// the schema is useless so far
// we need to create a model using it
var Template = mongoose.model('template', templateSchema);

// make this available to our users in our Node applications
module.exports = Template;