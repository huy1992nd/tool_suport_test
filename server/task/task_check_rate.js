var MyEmitter = require('../lib/events');
var define_a = require('../define');
let config = require("config");
var log = require('../lib/log').log;
var redisController = require('../controller/redis/redis_controller');
var TaskModel = require('../model/mongo/task');

class checkRateController {
    constructor() {
        this.redisController = {};
        // new redisController();
        // this.redisController.set_config_redis(config.get('redis').task_check_rate.staging);
        this.list_inter = {};
    }

    setMongoConnection(username, evn){
        if(!this.redisController[username]){
            this.redisController[username] =  new redisController();
        }
        this.redisController[username].set_config_redis(config.get('redis').task_check_rate[evn]);
    }

    setStatus(username, form_data) {
        define_a.status.task_check_rate[username] = form_data;
        this.saveEVNToDatabase(form_data, username);
    }

    EnvironmentInfo(data) {
        TaskModel.findOne({
            task_name: 'task_check_rate'
        }, (err, task) => {
            if (err) throw err;
            if (!task) {
                console.log('can not get rate config')
            } else if (task) {
                if (task.template.content && JSON.parse(task.template.content)[data.username]) {
                    console.log('get rate config')
                    define_a.status.task_check_rate[data.username] = JSON.parse(task.template.content)[data.username];
                    MyEmitter.emit(define_a.MESSAGE_EMITER.CHECK_RATE_ENVIRONMENT, {
                        status: define_a.status.task_check_rate[data.username],
                        clientId: data.clientId,
                        username: data.username
                    });

                    Object.keys(define_a.status.task_check_rate[data.username].current_gateway).forEach(type => {
                        if (define_a.status.task_check_rate[data.username].current_gateway[type] && define_a.status.task_check_rate[data.username].current_gateway[type].name != null) {
                            var symbol = define_a.status.task_check_rate[data.username].current_symbol[type].bpex;
                            var gateway = define_a.status.task_check_rate[data.username].current_gateway[type].name;
                            var key = `${gateway}_${symbol}`;
                            this.getOrderBook(key, type, data.username, data.clientId, define_a.status.task_check_rate[data.username].current_config.name);
                        }
                    })
                }
            }
        });
    }

    saveEVNToDatabase(content, username) {
        TaskModel.findOne({
            task_name: 'task_check_rate'
        }, function (err, task) {
            if (task.template.content) {
                let content_in_db = JSON.parse(task.template.content);
                content_in_db[username] = content;
                task.template.content = JSON.stringify(content_in_db);
                TaskModel.findOneAndUpdate({
                    task_name: task.task_name
                }, { $set: task }, function (err, task_save) {
                    console.log('save success', task_save);
                    if (err) {
                        console.log('err is', err)
                    }
                });
            }
        })
    }

    changeEnvironment(data) {
        var environment = data.data.environment;
        Object.keys(this.list_inter).map(username => {
            Object.keys(this.list_inter[username]).map(key => {
                if (this.list_inter[username][key]) {
                    clearInterval(this.list_inter[username][key]);
                }
            });
        });

        this.setMongoConnection(data.username,environment );

        this.setStatus(data.username, data.data.form_data);
        define_a.status.task_check_rate[data.username] = data.data.form_data;
        // Object.keys(define_a.status.task_check_rate[data.username].current_gateway).forEach(type => {
        //     if (define_a.status.task_check_rate[data.username].current_gateway[type].name != null) {
        //         var symbol = define_a.status.task_check_rate[data.username].current_symbol[type].bpex;
        //         var gateway = define_a.status.task_check_rate[data.username].current_gateway[type].name;
        //         var key = `${gateway}_${symbol}`;
        //         this.getOrderBook(key, type, data.username, data.clientId, define_a.status.task_check_rate[data.username].current_config.name);
        //     }
        // })
    }

    deleteInterver(username){
        if(this.list_inter[username]){
            Object.keys(this.list_inter[username]).map(key => {
                if (this.list_inter[username][key]) {
                    clearInterval(this.list_inter[username][key]);
                }
            });
        }
    }

    async getListSymbol(data) {
        let key = `config_gateway_${data.data.gateway}`;
        let type = data.data.type;
        if (this.list_inter[data.username] && this.list_inter[data.username][type]) {
            clearInterval(this.list_inter[data.username][type]);
        }
        this.setMongoConnection(data.username,data.data.form_data.current_config.name );
      
        let list_symbol = await this.redisController[data.username].get(key);
        if (list_symbol != null) {
            list_symbol = JSON.parse(list_symbol);
            let s = list_symbol.symbols[0] ? list_symbol.symbols[0].bpex : "";
            let gateway = data.data.gateway;
            key = `${gateway}_${s}`;
            this.getOrderBook(key, type, data.username, data.clientId, data.data.form_data.current_config.name);
            MyEmitter.emit(define_a.MESSAGE_EMITER.CHECK_RATE_LIST_SYMBOL, {
                list_symbol: list_symbol.symbols,
                type: type,
                clientId: data.clientId,
                username: data.username
            });
        }
    }

    changeNumberExchange(data) {
        this.setMongoConnection(data.username,data.data.form_data.current_config.name );
        this.saveEVNToDatabase(data.data.form_data, data.username);
        MyEmitter.emit(define_a.MESSAGE_EMITER.CHECK_RATE_CHANGE_NUMBER_EXCHANGE, {
            clientId: data.clientId,
            username: data.username
        });
        if (this.list_inter[data.username]) {
            Object.keys(this.list_inter[data.username]).forEach(type =>{
                // if(type > data.data.form_data.number_content.value - 1){
                    clearInterval(this.list_inter[data.username][type]);
                // }
            })
        }
    };

    mergerData(data_bid, data_ask) {
        var result = [];
        for (let j = 0; j < config.get('number_orderbook'); j++) {
            let b = data_bid[j] ? data_bid[j] : ["---", "---"];
            let a = data_ask[j] ? data_ask[j] : ["---", "---"];
            result.push(
                {
                    bid: b,
                    ask: a
                }
            )
        }
        return result;
    }

    formatData(data, type) {
        data.map(e => {
            e.price = parseFloat(e.price);
            e.amount = parseFloat(e.amount);
            return e;
        })
        var result = [];
        switch (type) {
            case 1:
                data.sort((a, b) => (a.price < b.price) ? 1 : ((b.price < a.price) ? -1 : 0));
                break;

            case 2:
                data.sort((a, b) => (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0));
                break;

            default:
                break;
        }

        var total = 0;

        data.map(e => {
            total += e.amount
            result.push([
                e.price,
                e.amount,
                total
            ]
            );
        });

        return result;
    }

    saveFromData(data) {
        this.setStatus(data.username, data.data.form_data);
    }

    getOrderBook(key, type, username, clientId = null , evn) {
        if( !this.redisController[username]){
            this.redisController[username] =  new redisController();
            this.redisController[username].set_config_redis(config.get('redis').task_check_rate[evn]);
        }
        if (this.list_inter[username] && this.list_inter[username][type]) {
            clearInterval(this.list_inter[username][type]);
        }
        if (this.list_inter[username] == undefined) {
            this.list_inter[username] = {};
        }
        this.list_inter[username][type] = setInterval(async (key, type) => {
            let list_order_book = await this.redisController[username].get(key);
            list_order_book = JSON.parse(list_order_book);
            let data_bib = this.formatData(list_order_book.bid, 1);
            let data_ask = this.formatData(list_order_book.ask, 2);
            MyEmitter.emit(define_a.MESSAGE_EMITER.CHECK_RATE_DATA, {
                list_order_book: {
                    bid: data_bib,
                    ask: data_ask
                },
                type: type,
                clientId: clientId,
                username: username
            });
        }, config.get('time_return_orderbook'), key, type);
    }

    async run(data, type) {
        var symbol = data.data.form_data.current_symbol[type].bpex;
        var gateway = data.data.form_data.current_gateway[type].name;
        var key = `${gateway}_${symbol}`;
        this.getOrderBook(key, type, data.username, data.clientId, data.data.form_data.current_config.name);
    }
}


module.exports = new checkRateController();

