var mongoose = require('mongoose');
var JobModel = require('../../model/mongo/job');

class Job {
    constructor() {
    }

    getAll() {
        var result = JobModel.find({}).select('_id title categories ref question_ids created_date').exec();
        return result;
    }

    list_task(req, res) {
        var result = JobModel.find({}).select('_id title categories ref question_ids created_date').exec();
        res(result);
    };

    getById(id) {
        return JobModel.findOne({_id: id}).select('_id title ref question_ids').exec();
    }

    insert(test) {
        var model = new JobModel(test);
        return model.save();
    }

    update(id, data) {
        return JobModel.update({ _id: id }, { $set: data} );
    }

    delete(id) {
        return JobModel.find({_id: id}).remove().exec();
    }

    deleteAll() {
        return JobModel.deleteMany({}).exec();
    }

}

module.exports = new Job();
