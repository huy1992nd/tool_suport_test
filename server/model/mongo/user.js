var mongoose = require('mongoose');
var config = require('config');
mongoose.connect(config.get('mongodb').URI);
// var autoIncrement = require('mongoose-auto-increment');
var bcrypt = require('bcrypt-nodejs');

// user schema
var schema = mongoose.Schema({
    account:String,
    username: { type: String, index: { unique: true } },
    password: { type: String, required: true },
    full_name:{ type: String },
    list_email:[],
    list_group:[],
    list_task:[],
    permission:{type:Number,default:2},  //1 admin , 2 normal
    created_date: { type: 'Date', default: Date.now, required: true },
    edited_date: { type: 'Date', default: Date.now, required: true }
});

/**
 * role: 0 - normal user
 *      1 - admin
 */

// crypt password when saving
schema.pre('save', function(next) {
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    bcrypt.hash(user.password, null, null, function(err, hash) {
        user.password = hash;
        next();
    });
});

schema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password); 
};

module.exports = mongoose.model('Users', schema);
