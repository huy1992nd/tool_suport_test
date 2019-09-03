var config = require('config');
var define_a = require('../../define');
var jwt = require('jsonwebtoken');
var myEmitter = require('../../lib/events');
let { KeyJwt } = require('./../../define');
var checkNOPController = require('../../task/task_check_nop');
var checkRateController = require('../../task/task_check_rate');
var formatDataController = require('../../task/task_format_data');
var checkLogController = require('../../task/task_check_log');

const list_message = [
    define_a.MESSAGE_EMITER.CHECK_NOP_RESULT,
    define_a.MESSAGE_EMITER.ERROR_PARSE_SCREEN_PRICE_ENGINE,
    define_a.MESSAGE_EMITER.PARSE_SCREEN_PRICE_ENGINE_OK,
    define_a.MESSAGE_EMITER.FORMAT_DATA_GET_LIST_ORDER_BOOK,
    define_a.MESSAGE_EMITER.CHECK_LOG_LIST_FILE,
    define_a.MESSAGE_EMITER.CHECK_LOG_CONFIG,
    define_a.MESSAGE_EMITER.CHECK_LOG_STOP
];

const list_message_all = [
    define_a.MESSAGE_EMITER.CHECK_LOG_STATUS,
    define_a.MESSAGE_EMITER.CHECK_LOG_RESULT
];

const list_message_all_by_user = [
    define_a.MESSAGE_EMITER.CHECK_RATE_DATA,
    define_a.MESSAGE_EMITER.CHECK_RATE_LIST_SYMBOL,
    define_a.MESSAGE_EMITER.CHECK_RATE_CHANGE_ENVIRONMENT,
    define_a.MESSAGE_EMITER.CHECK_RATE_ENVIRONMENT
]

class SocketController {
    constructor() {
        this.ext_token = config.get("ext_token") * 1000;
        this.server = null;
        this.listClient = {};
        this.listClientUser = {};
        this.listClientUnUser = {};
        this.listClientDelete = {};
        this.initEvent();
    }

    initEvent(){
        myEmitter.on(define_a.MESSAGE_EMITER.SET_CONFIG_CHECK_NOP_OK, (data) => {
            var send = this.SendDataToCLientByClientId(define_a.MESSAGE_EMITER.SET_CONFIG_CHECK_NOP_OK,{},data.data.clientId);
            if(!send){
                this.SendUnUser(define_a.MESSAGE_EMITER.SET_CONFIG_CHECK_NOP_OK,{});
            }
        });

        list_message.forEach(message=>{
            myEmitter.on(message, (data) => {
                var send = this.SendDataToCLientByClientId(message,data,data.clientId);
                if(!send){
                    var send_2 = this.sendReplaceID(message,data,data.clientId);
                    if(!send_2){
                        this.SendUnUser(message,data);
                    }
                }
            });
        });

        list_message_all.forEach(message=>{
            myEmitter.on(message, (data) => {
                this.SendDataToAll(message,data);
            });
        })

        list_message_all_by_user.forEach(message=>{
            myEmitter.on(message, (data) => {
                if(message == 'check_rate_environment'){
                    console.log('vao day');
                }
                this.SendDataToAllByUsername(message,data);
            });
        })

    }

     checkExtDate(token , callback) {
         jwt.verify(token.trim(), KeyJwt, (err, user) => {
            if (err) {
               console.log('token error', err, token);
               callback({status:false})
            } else {
                try {
                    if (Date.now() - user.Date > this.ext_token)
                      callback({
                          status:false
                        })
                    else
                      callback({
                          status:true,
                          username:user.username
                        })
                } catch (err) {
                    return false;
                };
            }
        });
    }

    initSocket(io){
        io.on('connection',  (client)=> {
            console.log("client connected", client.id);
            this.listClientUnUser[client.id] = client;
            client.on("bpex_client", data => {
                console.log("bpex_client",client.id, data);
                // if(!this.listClient[data.username]){
                    this.listClient[data.username] = {};
                // }
                this.listClient[data.username][client.id] = client;
                Object.keys(this.listClient).map(username=>{
                    if(username != data.username){
                        if(this.listClient[username][client.id]){
                            this.listClient[username] = {};
                        }
                    }
                });
                this.listClientUser[client.id] = data.username;

                if(this.listClientUnUser[client.id]){
                    delete this.listClientUnUser[client.id];
                }

                if(this.listClientDelete[data.username] != undefined){
                    this.listClientDelete[data.username].new = client.id;
                }

                client.emit("command_client",{
                    resultCode:0,
                    message: "success"
                })
            });

            client.on('disconnect', () => {
                console.log('socket disconnect', client.id);
                var username = this.listClientUser[client.id];
                if(this.listClient[username] && this.listClient[username][client.id] ){
                    this.listClientDelete[username] = {old:client.id, new:""}
                    delete this.listClient[username][client.id];
                }
                if(this.listClientUser[client.id]){
                    delete this.listClientUser[client.id];
                }
                if(this.listClientUnUser[client.id]){
                    delete this.listClientUnUser[client.id];
                }
                //delete interver of task check rate 
                checkRateController.deleteInterver(username);
            });
            
            //get message from client 
            client.on(define_a.MESSAGE_SOCKET.NOP_SCREEN_SETTING, (data) => {
                this.checkExtDate(data.token,(result)=>{
                    if(result.status){
                        checkNOPController.setConfig({
                            clientId:client.id,
                            data:data
                        });
                    }else{
                        this.SendDataToCLientByClientId(define_a.MESSAGE_SOCKET.FALLER_AUTHEN,{},client.id);
                    }
                });
            });

            client.on(define_a.MESSAGE_SOCKET.NOP_SCREEN_CHECK, (data) => {
                this.checkExtDate(data.token,(result)=>{
                    if(result.status){
                        checkNOPController.check({
                            clientId:client.id,
                            data:data
                        });
                    }else{
                        this.SendDataToCLientByClientId(define_a.MESSAGE_SOCKET.FALLER_AUTHEN,{},client.id);
                    }
                });
            });

            client.on(define_a.MESSAGE_SOCKET.CHECK_RATE_LIST_SYMBOL, (data) => {
                this.checkExtDate(data.token,(result)=>{
                    if(result.status){
                        checkRateController.getListSymbol({
                            clientId:client.id,
                            data:data,
                            username:result.username
                        });
                    }else{
                        this.SendDataToCLientByClientId(define_a.MESSAGE_SOCKET.FALLER_AUTHEN,{},client.id);
                    }
                });
            });

            client.on(define_a.MESSAGE_SOCKET.CHECK_RATE_ENVIRONMENT, (data) => {
                this.checkExtDate(data.token,(result)=>{
                    if(result.status){
                        checkRateController.EnvironmentInfo({
                            clientId:client.id,
                            username:result.username
                        });
                    }else{
                        this.SendDataToCLientByClientId(define_a.MESSAGE_SOCKET.FALLER_AUTHEN,{},client.id);
                    }
                });
            });

            client.on(define_a.MESSAGE_SOCKET.CHECK_RATE_CHANGE_ENVIRONMENT, (data) => {
                this.checkExtDate(data.token,(result)=>{
                    if(result.status){
                        checkRateController.changeEnvironment({
                            clientId:client.id,
                            data:data,
                            username:result.username
                        });
                    }else{
                        this.SendDataToCLientByClientId(define_a.MESSAGE_SOCKET.FALLER_AUTHEN,{},client.id);
                    }
                });
            });

            client.on(define_a.MESSAGE_SOCKET.CHECK_RATE_DATA, (data) => {
                this.checkExtDate(data.token,(result)=>{
                    if(result.status){
                        checkRateController.run({
                            clientId:client.id,
                            data:data,
                            username:result.username,
                        },data.type);
                    }else{
                        this.SendDataToCLientByClientId(define_a.MESSAGE_SOCKET.FALLER_AUTHEN,{},client.id);
                    }
                });
            });
            client.on(define_a.MESSAGE_SOCKET.CHECK_RATE_SAVE_FORM_DATA, (data) => {
                this.checkExtDate(data.token,(result)=>{
                    if(result.status){
                        checkRateController.saveFromData({
                            clientId:client.id,
                            data:data,
                            username:result.username,
                        });
                    }else{
                        this.SendDataToCLientByClientId(define_a.MESSAGE_SOCKET.FALLER_AUTHEN,{},client.id);
                    }
                });
            });

            client.on(define_a.MESSAGE_SOCKET.CHECK_RATE_CHANGE_NUMBER_EXCHANGE, (data) => {
                this.checkExtDate(data.token,(result)=>{
                    if(result.status){
                        checkRateController.changeNumberExchange({
                            clientId:client.id,
                            data:data,
                            username:result.username
                        });
                    }else{
                        this.SendDataToCLientByClientId(define_a.MESSAGE_SOCKET.FALLER_AUTHEN,{},client.id);
                    }
                });
            });

            client.on(define_a.MESSAGE_SOCKET.FORMAT_DATA_GET_LIST_ORDER_BOOK, (data) => {
                this.checkExtDate(data.token,(result)=>{
                    if(result.status){
                        formatDataController.run({
                            clientId:client.id,
                            data:data
                        });
                    }else{
                        this.SendDataToCLientByClientId(define_a.MESSAGE_SOCKET.FALLER_AUTHEN,{},client.id);
                    }
                });
            });

            client.on(define_a.MESSAGE_SOCKET.CHECK_LOG_CONFIG, (data) => {
                this.checkExtDate(data.token,(result)=>{
                    if(result.status){
                        checkLogController.setConfig({
                            clientId:client.id,
                            data:data
                        });
                    }else{
                        this.SendDataToCLientByClientId(define_a.MESSAGE_SOCKET.FALLER_AUTHEN,{},client.id);
                    }
                });
            });

            client.on(define_a.MESSAGE_SOCKET.CHECK_LOG_RESULT, (data) => {
                this.checkExtDate(data.token,(result)=>{
                    if(result.status){
                        checkLogController.run(data.form_data);
                    }else{
                        this.SendDataToCLientByClientId(define_a.MESSAGE_SOCKET.FALLER_AUTHEN,{},client.id);
                    }
                });
            });

            client.on(define_a.MESSAGE_SOCKET.CHECK_LOG_STATUS, (data) => {
                this.checkExtDate(data.token,(result)=>{
                    if(result.status){
                        checkLogController.checkStatus({
                            clientId:client.id,
                            data:data
                        });
                    }else{
                        this.SendDataToCLientByClientId(define_a.MESSAGE_SOCKET.FALLER_AUTHEN,{},client.id);
                    }
                });
            });

            client.on(define_a.MESSAGE_SOCKET.CHECK_LOG_STOP, (data) => {
                this.checkExtDate(data.token,(result)=>{
                    if(result.status){
                        checkLogController.stop({
                            clientId:client.id,
                            data:data
                        });
                    }else{
                        this.SendDataToCLientByClientId(define_a.MESSAGE_SOCKET.FALLER_AUTHEN,{},client.id);
                    }
                });
            });

        });
    }


    SendDataToCLient(username,type,data) {
        if(this.listClient[username]) {
            Object.keys(this.listClient[username]).map(k=>{
                console.log('send to',  k);
                this.listClient[username][k].emit(type,data); 
            })
        }
    }

    SendDataToCLientByClientId(type,data,clientId) {
        let result = false;
        Object.keys(this.listClient).map(username=>{
            Object.keys(this.listClient[username]).map(k=>{
                if(this.listClient[username][k].id == clientId){
                    this.listClient[username][k].emit(type,data); 
                    result = true;
                }
            })
        });
        return result;
    } 

    SendDataToAll(type,data) {
        Object.keys(this.listClient).map(username=>{
            Object.keys(this.listClient[username]).map(k=>{
                this.listClient[username][k].emit(type,data); 
            })
        })

        Object.keys(this.listClientUnUser).map(k=>{
            this.listClientUnUser[k].emit(type,data); 
        });
    } 

    SendDataToAllByUsername(type,data) {
        if( Object.keys(this.listClient).length){
            Object.keys(this.listClient[data.username]).map(k=>{
                this.listClient[data.username][k].emit(type,data); 
            })
        }
    } 

    sendReplaceID(type,data,clientId){
       var result = false;
        Object.keys(this.listClientDelete).forEach(key=>{
           if(this.listClientDelete[key].old == clientId){
                let r = this.SendDataToCLientByClientId(type,data,this.listClientDelete[key].new);
                if(r){
                    result = true;
                }
           }
       })
       return result;
    }

    SendUnUser(type,data){
        Object.keys(this.listClientUnUser).map(k=>{
            this.listClientUnUser[k].emit(type,data); 
        });
        
    }

}

module.exports = new SocketController();
