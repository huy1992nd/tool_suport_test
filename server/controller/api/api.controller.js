var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
var define_a = require('../../define');
var appDir = path.dirname(require.main.filename).replace(new RegExp("\\\\", 'g'), '/');
var pathFilesave = appDir  + define_a.pathFileTmp
var userRouter = require('../api/routes/userRouters');
var express = require('express');
const config = require('config'); 

//socket 
var SocketController = require('../socket/socket_controller');
class ApiController {
  constructor() {
    this.app = express();
    this.http = require('http').Server(this.app);
    this.io = require('socket.io')(this.http);
    this.ext_token = config.get("ext_token") * 1000;
  }
  Init() {
    
    this.app.use(cors());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(function(req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      res.setHeader('Access-Control-Allow-Credentials', true);
      next();
    })

    this.app.use( (req, res, next)=> {
      if(req.headers && req.headers.authorization){
        jwt.verify(req.headers.authorization.trim(),'MONEYANDLOVE', (err,decode)=>{
          if(err) {
            req.user = undefined;
          }else{
            if(this.checkExtDate(decode.Date)){
                req.user = undefined;
                req.extDate = true;
              }else{
                req.user = decode ;
              }
          }
          next();
        })
      }else {
        req.user = undefined;
        next();
      }    
    });

    this.InitRouter();
    this.InitWeb();
    this.startApi();
  }

  InitRouter(){
    userRouter(this.app);
  }

  InitWeb(){
    this.app.use( express.static(path.join(__dirname, '../../../client/dist')));
    this.app.use( '/home',express.static(path.join(__dirname, '../../../client/dist')));
    this.app.use( '/login',express.static(path.join(__dirname, '../../../client/dist')));
    console.log('path file is',path.join(__dirname, '../../../client/dist'));
    this.app.use( '/download',express.static(path.join(__dirname, '../../log/tmp/')));
  }

  checkExtDate(date) {
    try {
        if (Date.now() - date > this.ext_token)
            return true;
        else
            return false;
    } catch (err) {
        return true;
    };
  }

  startApi(){
    SocketController.initSocket(this.io);
    var server = this.http.listen(6789, function () {
      var host = server.address().address
      var port = server.address().port
      console.log("monitor app api",Date.now() , host, port);
    });    
  }
}
module.exports = new ApiController();

