const EventEmitter = require('events');

class MyEmitter extends EventEmitter {
}

const myEmitter = module.exports = new MyEmitter();