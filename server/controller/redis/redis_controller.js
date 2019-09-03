var config = require('config');
var redis = require("redis");
var define_a = require('../../define');
var redis_cli_sub = null;
var MyEmitter = require('../../lib/events');


function convertJson(input){
    if (typeof input === 'string' || input instanceof String){
        return JSON.parse(input);
    }else{
        return input;
    }
}

class redisController {
    constructor() {
        this.redis_cli = null;
    }

    set_config_redis(c){
        if(this.redis_cli){
            this.redis_cli.quit();
        }
        this.redis_cli = redis.createClient(6379,c.server);
        this.redis_cli.auth(c.pass)
        // redis.createClient(c.server, {password: c.pass});            
    }

    getPrice(list_key){
        return new Promise((resolve, reject) => {
            this.redis_cli.mget(list_key, function(error, result) {
                if (error) {
                    reject(error);
                    resolve(null);
                    throw error;
                }else{
                    resolve(result);
                }
              });
        })
    }

    mget(key){
        return new Promise((resolve, reject) => {
            this.redis_cli.mget(key, function(error, result) {
                if (error) {
                    reject(error);
                    resolve(null);
                    throw error;
                }else{
                    resolve(result);
                }
              });
        })
    }

    get(key){
        return new Promise((resolve, reject) => {
            this.redis_cli.get(key, function(error, result) {
                if (error) {
                    reject(error);
                    resolve(null);
                    throw error;
                }else{
                    resolve(result);
                }
              });
        })
    }

    getEchangeRate(){
        return new Promise((resolve, reject) => {
            this.redis_cli.mget('', function(error, result) {
                if (error) {
                    reject(error);
                    resolve(null);
                    throw error;
                }else{
                    resolve(result);
                }
              });
        })
    }

}

   
module.exports =  redisController;
