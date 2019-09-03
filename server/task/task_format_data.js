var MyEmitter = require('../lib/events');
var define_a = require('../define');
let config = require("config");
var log = require('../lib/log').log;
var redisController = require('../controller/redis/redis_controller');

class formatDataController {
    constructor() {
        this.redisController = new redisController();
        this.redisController.set_config_redis(config.get('redis').task_check_rate.test);
        this.inter = null 
    }

    getOrderBook(key, time , data){
        if(this.inter ){
            clearInterval(this.inter);
        }
        this.inter = setInterval(async (key) => {
            let list_order_book = await this.redisController.get(key);
            list_order_book = JSON.parse(list_order_book);
            if(list_order_book){
                MyEmitter.emit(define_a.MESSAGE_EMITER.FORMAT_DATA_GET_LIST_ORDER_BOOK, {
                    list_order_book: list_order_book,
                    clientId: data.clientId
                });
            }else{
                
            }
          

        }, time*1000,key);
    }

    async run(data) {
      let  key = data.data.key;
      let  time = data.data.time;
      this.getOrderBook(key, time , data);
    }
}


module.exports = new formatDataController();

