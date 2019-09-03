/**
 * Created by nguyen.quang.huy on 5/23/2017.
 */
"use strict";

// init config
var config = require('../../config.json');

// init redis
var redis = require("redis"),
redis_cli = redis.createClient(config.redis.port, config.redis.server, {password: config.redis.password});
redis_cli.on("error", function (err) {
	console.log("Error " + err);
});




exports.list = function (type, options, callback) {
	redis_cli.lrange(type, options.from, options.to, function (err, reply) {
		if (err)
			callback(err);
		else {
			var trades = [];
			if (reply && reply.length) {
				reply.forEach(function (item) {
					if (item) {
						trades.push(JSON.parse(item));
					}
				});
			}
			callback(null, trades);
		}
	});
};

exports.llen = function (type, callback) {
	redis_cli.llen(type, function (err, reply) {
		if (err)
			callback(err);
		else {
			callback(null, reply);
		}
	});
};

exports.get = function (type, callback) {
	redis_cli.get(type, function (err, reply) {
		if (err)
			callback(err);
		else {
			callback(null, JSON.parse(reply));
		}
	});
};

exports.keys = function (type, callback) {
	redis_cli.keys(type, function (err, reply) {
		if (err)
			callback(err);
		else {
			callback(null, JSON.parse(reply));
		}
	});
};

exports.set = function (type, data,callback) {
	redis_cli.set(type, data, function (err, reply) {
			if (err) {
				if(callback)
					callback(err);
			}
			else {
				if(callback)
					callback(null, reply);
			}
		}
	);

};

exports.publish = function (type, data) {
	redis_cli.publish(type, data);
}

exports.subscribe = function (message, callback) {
	redis_cli.subscribe(message);
}

exports.del = function (type, callback) {
	redis_cli.del(type);
}

exports.ltrim = function (type, options, callback) {
	redis_cli.ltrim(type,options.from,options.to,function (err,reply) {
		if (err)
			callback(err);
		else {
			callback(null, reply);
		}
	});
}

exports.rpush = function (type_data, data, callback) {
	redis_cli.rpush(type_data, data, function (err, reply) {
			if (err) {
				if(callback)
					callback(err);
			}
			else {
				if(callback)
					callback(null, JSON.parse(reply));
			}
		}
	);
}


exports.hset = function (array_input,callback) {
	redis_cli.hset(array_input, function (err,reply) {
			if (err) {
				if(callback)
					callback(err);
			}
			else {
				if(callback)
					callback(null, reply);
			}
		}
	);
};

exports.hkeys = function (key,callback) {
	redis_cli.hkeys(key, function (err, replies) {
			if (err) {
				if(callback)
					callback(err);
			}
			else {
				if(callback)
					callback(null, replies);
			}
		}
	);

};

exports.hget = function (key,sub_key,callback) {
	redis_cli.hget(key, sub_key, function (err,reply) {
			if (err) {
				if(callback)
					callback(err);
			}
			else {
				if(callback)
					callback(null, JSON.parse(reply));
			}
		}
	);

};

exports.hdel  = function (key,list_sub_key,callback) {
	redis_cli.hdel(key, list_sub_key, (err, result) => { 
			if (err) {
				if(callback)
					callback(err);
			}
			else {
				if(callback)
					callback(null, result);
			}
		}
	);

};
