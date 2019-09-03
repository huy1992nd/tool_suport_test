var UserModel = require('../../model/mongo/user');
var taskSettingModel = require('../../model/mongo/task_setting');
var jwt = require('jsonwebtoken');
let { KeyJwt } = require('./../../define');
const config = require('config'); 
function convertJson(input) {
    if (typeof input === 'string' || input instanceof String) {
        return JSON.parse(input);
    } else {
        return input;
    }
}

class User {
    constructor() {
        this.ext_token = config.get("ext_token") * 1000;
    }

    sign_in(req, res) {
        var data = req.body;
        UserModel.findOne({
            username: data.username
        }, function (err, user) {
            if (err) throw err;
            if (!user) {
                res.status(401).json({
                    resultCode: 10
                });
            } else if (user) {
                if (!user.comparePassword(data.password)) {
                    res.status(401).json({
                        resultCode: 20
                    });
                } else {
                    //add token device
                    taskSettingModel.find({
                        username: user.username
                    }, function (err, list_task) {
                        //Add device for task setting
                        console.log('token device old is', data.token_device_old);
                        list_task.map(task => {
                            var index_exit_old = task.notify.map(function (notify) { return notify.token; }).indexOf(data.token_device_old);
                            if (index_exit_old >= 0) {
                                task.notify[index_exit_old].token = data.token_device_new;
                                task.notify[index_exit_old].login = 1;
                                taskSettingModel.findOneAndUpdate({
                                    username: task.username,
                                    task_name: task.task_name
                                }, { $set: task }, function (err, task) {
                                    console.log('save success', task);
                                });
                            } else {
                                var index_exit_new = task.notify.map(function (notify) { return notify.token; }).indexOf(data.token_device_new);
                                console.log('index exit', index_exit_new)
                                if (index_exit_new == -1) {
                                    task.notify.push({
                                        token: data.token_device_new,
                                        type: "ios",
                                        login: 1,
                                        active: true
                                    });
                                    taskSettingModel.findOneAndUpdate({
                                        username: task.username,
                                        task_name: task.task_name
                                    }, { $set: task }, function (err, task) {
                                        console.log('save success', task);
                                    });

                                } else {
                                    task.notify[index_exit_new].login = 1;
                                    taskSettingModel.findOneAndUpdate({
                                        username: task.username,
                                        task_name: task.task_name
                                    }, { $set: task }, function (err, task) {
                                        console.log('save success', task);
                                    });
                                }
                            }
                        });

                    })

                    return res.json({
                        resultCode: 0,
                        username: user.username,
                        token_authen: jwt.sign({ username: user.username, _id: user._id, Date: Date.now() }, KeyJwt)
                    }
                    );
                }
            }
        });
    };

    login_web(req, res) {
        var data = req.body;
        UserModel.findOne({
            username: data.username
        }, function (err, user) {
            if (err) throw err;
            if (!user) {
                res.status(401).json({
                    resultCode: 10
                });
            } else if (user) {
                if (!user.comparePassword(data.password)) {
                    res.status(401).json({
                        resultCode: 20
                    });
                } else {
                    //add token device
                    return res.json({
                        resultCode: 0,
                        username: user.username,
                        permission: user.permission,
                        token_authen: jwt.sign({ username: user.username, _id: user._id, Date: Date.now() }, 'MONEYANDLOVE')
                    });
                }
            }
        });
    };

    sign_out(req, res) {
        var data = req.body;
        taskSettingModel.find({
            username: req.user.username
        }, function (err, list_task) {
            list_task.map(task => {
                var token_device = data.token_device ? data.token_device : data.token_device_new;
                var index_device = task.notify.map(function (notify) { return notify.token; }).indexOf(token_device);
                if (index_device > -1) {
                    task.notify[index_device].login = 0;
                    taskSettingModel.findOneAndUpdate({
                        username: task.username,
                        task_name: task.task_name
                    }, { $set: task }, function (err, task) { });
                }
            });
            return res.json({ resultCode: 0 });
        })
    };

    update(req, res) {
        var user = convertJson(JSON.stringify(req.body));
        UserModel.findOneAndUpdate({ username: user.username }, { $set: user }, { new: true }, function (err, result) {
            if (err) throw err;
            return res.json({
                resultCode: 0,
                user: result
            });
        });
    };

    async insert(req, res) {
        var user = convertJson(JSON.stringify(req.body));
        var model = new UserModel(user);
        try {
            const result = await model.save();
            return res.json({
                resultCode: 0,
                user: result
            });
        } catch (err) {
            console.log('err insert user', err);
        }

    };

    remove(req, res) {
        var user = convertJson(JSON.stringify(req.body));
        UserModel.deleteMany({
            username: user.username
        }, function (err, result) {
            if (err) throw err;
            res.json({ resultCode: 0 });
        });
    };

    checkExtDate(date) {
        try {
            if (Date.now() - date > this.ext_token)
                return true;
            else
                return false;
        } catch (err) {
            return false;
        };
    }

    check_aut(req, res) {
        var data = convertJson(JSON.stringify(req.body));
        var token = data.token;
        jwt.verify(token, 'MONEYANDLOVE', (err, decode) =>{
            if (err) {
                res.status(401).json({
                    resultCode: 5,
                });
            } else {
                if (this.checkExtDate(decode.Date)) {
                    res.json(
                        {
                            resultCode: 55
                        }
                    );
                } else {
                    res.json(
                        {
                            resultCode: 0
                        }
                    );
                }

            }

        });


    }


    loginRequired(req, res, next) {
        if (req.user) {
            next();
        } else {
            if(req.extDate){
                return res.json(
                    {
                        resultCode: 55
                    }
                );
            }else{
                return res.status(401).json({ resultCode: 40 });
            }
            
        }
    };

    getByUsernameAndPassword(username, password, callback) {
        UserModel.findOne({ username: username }).exec().then(function (user) {
            if (user && user.comparePassword(password)) {
                callback(user);
            }
            else callback(null);
        });
    }

    list_all(req, res) {
        var data = convertJson(JSON.stringify(req.body));
        var condition = {};
        if (data.username) {
            condition.username = data.username;
        }
        UserModel.find(condition, function (err, listUser) {
            if (err) throw err;
            if (!listUser) {
                res.status(401).json({
                    resultCode: 1,
                });
            } else if (listUser) {
                res.json(
                    {
                        resultCode: 0,
                        list_user: listUser
                    }
                );
            }
        });
    };

    getByUsername(username) {
        var result = UserModel.findOne({ username: username }).exec();
        return result;
    }

    getById(id) {
        var result = UserModel.findOne({ _id: id }).exec();
        return result;
    }

    // insert(user) {
    //     var model = new UserModel(user);
    //     return model.save();
    // }

    // update(id, data) {
    //     return UserModel.findByIdAndUpdate(id, data);
    // }

    deleteAll() {
        return UserModel.deleteMany({}).exec();
    }
}

module.exports = new User();
