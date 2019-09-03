var exportNOPController = require('../../task/task_export_nop');
var exportDBController = require('../../task/task_export_DB');
function convertJson(input){
    if (typeof input === 'string' || input instanceof String){
        return JSON.parse(input);
    }else{
        return input;
    }
}
class Export {
    constructor() {
    }

    exportData(req, res) {
        var data = convertJson(JSON.stringify(req.body));
        console.log('data request is', data);
        exportNOPController.run(
             req.user.username
            );
        return res.json({
            resultCode :0,
            });
    };

    exportDB(req, res) {
        var data = convertJson(JSON.stringify(req.body));
        console.log('data request is', data);
        exportDBController.run(
             data,
             req.user.username
            );
        return res.json({
            resultCode :0,
            });
    };
}

module.exports = new Export();
