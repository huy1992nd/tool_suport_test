/**
 * Created by nguyen.quang.huy on 5/26/2017.
 */
var  sql = require('./mysql');
exports.get_list_order = function(time,callback){
	var query = `SELECT currency_pair_cd ,count(id) as count FROM bpex_receive_orders where  created_time >= '${time.start}' and created_time < '${time.end}' group by currency_pair_cd`;
	// console.log(query);
	sql.exe_query({query: query}, function(err, rows, fields){
		callback(err,rows)
	});
};

exports.get_orders = function(list_condition,list_select,callback){
	var str_condition = list_condition.map(condition=>{

		if(condition.operator){
			return `${condition.key}  ${condition.operator} '${condition.value}'`;
		}else{
			return `${condition.key}  like '${condition.value}'`;
		}
		
	}).join (" and ");

	var str_select = list_select? list_select.join(","): " * ";
	var query = `SELECT ${str_select} FROM bpex_receive_orders where ${str_condition} `;
	// console.log(query);
	sql.exe_query({query: query}, function(err, rows, fields){
		callback(err,rows)
	});
};



