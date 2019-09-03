var mongoose = require('mongoose');
var LogModel = require('../../model/mongo/log');

function convertJson(input){
    if (typeof input === 'string' || input instanceof String){
        return JSON.parse(input);
    }else{
        return input;
    }
}

function formatTime(d){
	var date = d.getDate() > 10 ? d.getDate() : '0'+d.getDate();
	var month = d.getMonth()+1 > 10 ? d.getMonth()+1 : '0'+ (d.getMonth()+1);
	var y = d.getFullYear();
	var hr = d.getHours() > 10 ? d.getHours() : 0 + d.getHours();
	var min = d.getMinutes() > 10 ? d.getMinutes() : '0'+ d.getMinutes();
	var seconds = d.getSeconds() > 10 ? d.getSeconds() : '0'+d.getSeconds();

	return `${y}-${month}-${date} ${hr}:${min}:${seconds}`;
}

class Log {
    constructor() {
    }

    get_list_log(req, res) {
        var user = req.user;
        var data = req.body;
        data.time = convertJson(data.time);
        data.page = convertJson(data.page);
        data.list_task = convertJson(data.list_task);
        var find = {
            "username":'root'
        };
        if (data.list_task){
              find.task_name = {$in:data.list_task} 
        }
        if(data.time){
            if(data.time.start == undefined){
                data.time.start = "2018-00-00T00:00:00.000Z"
            }

            if(data.time.end == undefined){
                data.time.end = "2058-00-00T00:00:00.000Z"
            }

            find.dateAdded =  {
                "$gte": data.time.start,
                "$lt": data.time.end
            }
        }
        LogModel.find(find, function(err, listData) {
            if (err) throw err;
            if (!user) {
            res.status(401).json({
                resultCode :1,  
            });
            } else if (listData) {
                if(data.page){
                    var page = data.page;
                    var start_index = page.number_page*(page.index_of_page-1);
                    var end_index = start_index + page.number_page;
                    var data_result =  listData.slice(start_index, end_index);
                }else{
                    var data_result =  listData;
                }
                res.json(
                    {
                    resultCode:0,    
                    list_log:data_result.map(function(o) { 
                        return {
                        content:o.content,
                        task_name:o.task_name,
                        is_read_notification:o.is_read,
                        time:formatTime(o.dateAdded),
                        notification_id:o._id,
                        type:o.type
                     }
                    })
                    }
                );
            }
        }).sort( { dateAdded: -1 } );
    };

    update_data(req,res){
        var user = req.user;
        var data = req.body;
        return LogModel.update({ _id: data.notification_id },{is_read:data.is_read_notification}, function (err,result) {
            if (err) {
                res.status(401).json({
                    resultCode :1,  
                });
            }else{
                return res.json({ resultCode: 0});
            }
        });
    }

    getAll() {
        var result = LogModel.find({}).select('_id title categories ref question_ids created_date').exec();
        return result;
    }

    getById(id) {
        return LogModel.findOne({_id: id}).select('_id title ref question_ids').exec();
    }

    insert(test) {
        var model = new LogModel(test);
        return model.save();
    }

    insertMany(list){
        return LogModel.insertMany(list);
    }

    update(id, data) {
        return LogModel.update({ _id: id }, { $set: data} );
    }

    delete(id) {
        return LogModel.find({_id: id}).remove().exec();
    }

    deleteAll() {
        return LogModel.deleteMany({}).exec();
    }

}

module.exports = new Log();
