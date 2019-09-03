var mongoose = require('mongoose');
var GroupModel = require('../../model/mongo/group');
function convertJson(input){
    if (typeof input === 'string' || input instanceof String){
        return JSON.parse(input);
    }else{
        return input;
    }
}
class Group {
    constructor() {
    }

    getAll() {
        var result = GroupModel.find({}).exec();
        return result;
    }

    list_group(req, res) {
        req.body = convertJson(JSON.stringify(req.body));
        GroupModel.find({}, function(err, listGroup) {
            if (err) throw err;
            if (!listGroup) {
            res.status(401).json({
                resultCode :1,  
            });
            } else if (listGroup) {
                res.json(
                    {
                    resultCode:0,    
                    list_group:listGroup
                    }
                );
            }
        });
    };

    update(req, res) {
        var g = convertJson(JSON.stringify(req.body));
        console.log('data is', g);
        GroupModel.findOneAndUpdate({ group_key: g.group_key }, { $set: g }, { new: true }, function(err, result) {
            if (err) throw err;
            return res.json({
                resultCode :0,
                group:result
                });
        });
    };

    async insert(req, res) {
        var g = convertJson(JSON.stringify(req.body));
        var model = new GroupModel(g);
        try {
            const result = await model.save();
            return res.json({
                resultCode :0,
                group:result
                });
        } catch(err){
            console.log('err insert user',err);
        }

    };

    remove(req, res) {
        var g = convertJson(JSON.stringify(req.body));
            GroupModel.deleteMany({
                name:g.name
            },function (err, result){
                if (err) throw err;
                res.json({resultCode:0});
            });
    };


    getById(id) {
        return GroupModel.findOne({_id: id}).select('_id title ref question_ids').exec();
    }

    delete(id) {
        return GroupModel.find({_id: id}).remove().exec();
    }

    deleteAll() {
        return GroupModel.deleteMany({}).exec();
    }

}

module.exports = new Group();
