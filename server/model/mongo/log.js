// grab the things we need
var mongoose = require('mongoose');
var config = require('config');
mongoose.connect(config.get('mongodb').URI);
var Schema = mongoose.Schema;

// create a schema
var logSchema = new Schema({
    username:String,
    task_name:  String,
    template:  String,
    content: String,
    ip: String,
    is_read:{type:Boolean,default:false},
    note:String,
    timeRestart:String,
    timeStart:Date,
    timeEnd: Date,
    thread_name:String,
    status:String,
    type:Number, // 0( 0 is normal) or 1 (1 is important)
    run_now:Number, // 0( 0 is normal) or 1 (1 is run now)
    max_time:Number,
    total_over:Number,
    total:Number,
    total_new:Number,
    total_update:Number,
    number_err:Number,
    symbol:String,
    symbol_max:String,
    data:{},
    dateAdded: { type: 'Date', default: Date.now, required: true },
    dateUpdated: { type: 'Date', default: Date.now, required: true }
});

// the schema is useless so far
// we need to create a model using it
var Log = mongoose.model('log', logSchema);

// make this available to our users in our Node applications
module.exports = Log;