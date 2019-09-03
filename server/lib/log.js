var log4js = require('log4js');
log4js.configure({
appenders: {
out:{ type: 'console' },
app:{ type: 'dateFile', filename: 'logs/site',"pattern": "-yyyy-MM-dd.log", "alwaysIncludePattern": true}
},
categories: {
warning: { appenders: [ 'out', 'app' ], level: 'debug' },
default: { appenders: [ 'out', 'app' ], level: 'debug' }
}
});
var log = log4js.getLogger('warning');
exports.log = log;