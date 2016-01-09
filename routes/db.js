var mysql = require('mysql');

var pool      =    mysql.createPool({
	connectionLimit : 100, //important
	host     : 'localhost',
	user     : 'cliente_simca',
	password : '',
	database : 'cliente_simca',
	debug    :  false
});

/**
 * Queries the database and sends the results to callback function
 * @param {String} querystr
 * @param {Function} callback
 */
function QueryDB(querystr,callback) {
	pool.getConnection(function(err,connection){
		if (err) {
			throw err;
		}   
		console.log('connected as id ' + connection.threadId);

		connection.query(querystr,function(err,rows){
			connection.release();
			callback(err,rows);
		});
	});
}

exports.pool = pool;
exports.QueryDB = QueryDB;