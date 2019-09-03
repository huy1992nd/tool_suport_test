var mongoose = require('mongoose');
var TemplateModel = require('../../model/mongo/template');
function convertJson(input){
    if (typeof input === 'string' || input instanceof String){
        return JSON.parse(input);
    }else{
        return input;
    }
}
class Template {
    constructor() {
    }

    getAll() {
        var result = TaskModel.find({}).exec();
        return result;
    }

    list_template(req, res) {
        req.body = convertJson(JSON.stringify(req.body));
        TemplateModel.find({}, function(err, listTemplate) {
            if (err) throw err;
            if (!listTemplate) {
            res.status(401).json({
                resultCode :1,  
            });
            } else if (listTemplate) {
                res.json(
                    {
                    resultCode:0,    
                    list_template:listTemplate
                    }
                );
            }
        });
    };

    getById(id) {
        return TaskModel.findOne({_id: id}).select('_id title ref question_ids').exec();
    }

    getByName(name) {
        return TaskModel.findOne({task_name: name}).exec();
    }

    insert(test) {
        var model = new TaskModel(test);
        return model.save();
    }

    update(id, data) {
        return TaskModel.update({ _id: id }, { $set: data} );
    }

    delete(id) {
        return TaskModel.find({_id: id}).remove().exec();
    }

    deleteAll() {
        return TaskModel.deleteMany({}).exec();
    }

}

module.exports = new Template();
