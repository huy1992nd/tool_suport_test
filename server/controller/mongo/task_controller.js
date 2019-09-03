var mongoose = require('mongoose');
var TaskModel = require('../../model/mongo/task');
function convertJson(input){
    if (typeof input === 'string' || input instanceof String){
        return JSON.parse(input);
    }else{
        return input;
    }
}
class Task {
    constructor() {
    }

    getAll() {
        var result = TaskModel.find({}).exec();
        return result;
    }

    list_task(req, res) {
        var data = convertJson(JSON.stringify(req.body));
        var condition = {};
        if(data.task_name){
            condition.task_name = data.task_name;
        }
        TaskModel.find(condition, function(err, listTask) {
            if (err) throw err;
            if (!listTask) {
            res.status(401).json({
                resultCode :1,  
            });
            } else if (listTask) {
                res.json(
                    {
                    resultCode:0,    
                    list_task:listTask
                    }
                );
            }
        });
    };

    update(req, res) {
        var task = convertJson(JSON.stringify(req.body));
        TaskModel.findOneAndUpdate({ task_name: task.task_name }, { $set: task }, { new: true }, function(err, result) {
            if (err) throw err;
            return res.json({
                resultCode :0,
                task:result
                });
        });
    };

    async insert(req, res) {
        var task = convertJson(JSON.stringify(req.body));
        var model = new TaskModel(task);
        try {
            const result = await model.save();
            return res.json({
                resultCode :0,
                task:result
                });
        } catch(err){
            console.log('err insert user',err);
        }

    };

    remove(req, res) {
        var task = convertJson(JSON.stringify(req.body));
            TaskModel.deleteMany({
                task_name:task.task_name
            },function (err, result){
                if (err) throw err;
                res.json({resultCode:0});
            });
    };

    getById(id) {
        return TaskModel.findOne({_id: id}).select('_id title ref question_ids').exec();
    }

    getByName(name) {
        return TaskModel.findOne({task_name: name}).exec();
    }


}

module.exports = new Task();
