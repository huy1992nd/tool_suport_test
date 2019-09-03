/**
 * Created by nguyen.quang.huy on 5/23/2017.
 */
const config = require('config');
var mysql = require('mysql');
var log = require('../lib/log').log;


class MySqlController {
	constructor() {
	}

	setConfig(config) {
		this.pool = mysql.createPool({
			connectionLimit: 10,
			connectTimeout: 60 * 60 * 1000,
			aquireTimeout: 60 * 60 * 1000,
			timeout: 60 * 60 * 1000,
			host: config.host,
			user: config.user,
			multipleStatements: true,
			password: config.password,
			database: config.database
		});
	}

	exe_query(req, res) {
		this.pool.getConnection(function (err, connection) {
			if (err) {
				res(err);
				return;
			}
			if (req.values)
				connection.query(req.query, req.values, function (err, rows, fields) {
					connection.release();
					if (!err)
						res(err, rows, fields);
					else {
						console.log('have error connection to mysql');
					}
				});
			else
				connection.query(req.query, function (err, rows, fields) {
					connection.release();
					if (!err)
						res(err, rows, fields);
					else {
						console.log(err);
					}
				});

			connection.on('error', function (err) {
				res(err);
				return;
			});
		});
	}

	//promise

	Query(sql) {
		return new Promise((resolve, reject) => {
			log.info("SQL", sql);
			this.pool.getConnection(function (err, connection) {
				if (err) {
					reject(err);
					return;
				}
				if (sql.values)
					connection.query(sql.query, sql.values, function (err, rows, fields) {
						connection.release();
						if (!err) {
							resolve(rows);
						} else {
							reject(err);
						}
					});
				else
					connection.query(sql, function (err, rows, fields) {
						connection.release();
						if (!err) {
							resolve(rows);
						}
						else {
							reject(err);
						}
					});
				connection.on('error', function (err) {
					reject(err);
					return;
				});
			});
		})
	}

	Transaction(sql) {
		return new Promise((resolve, reject) => {
			this.pool.getConnection(function (err, conn) {
				if (err) {
					reject(null);
					return;
				}
				var nTime = +new Date();

				/* Begin transaction */
				conn.beginTransaction(function (err) {
					// --conn.query(aQuery.join('\n'), function(err, rows, fields) {
					conn.query(sql, function (err, rows, fields) {

						if (err) {
							console.log('err',err);
							conn.rollback(() => {
								conn.release();		// Do not remove this line.
								reject('rollback');
							});
						} else {
							conn.commit(function (err) {
								if (err) {

									conn.rollback(function () {
										//								throw utils.error.DATABASE_ERROR;	// TODO
										conn.release();		// Do not remove this line.
										reject('rollback');
									})
								} else {
									conn.release();
									resolve(true);
								}
							});
						}
					});
				});
			});
		})
	}
}

module.exports = MySqlController;
