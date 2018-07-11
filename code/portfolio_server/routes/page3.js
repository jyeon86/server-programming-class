var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var db_info = require('./db_info');
 
var pool = mysql.createPool({
    host : db_info.getHost(),
    port : db_info.getPort(),
    user : db_info.getUser(),
    password : db_info.getPassword(),
    database : db_info.getDatabase(),
    connectionLimit : 20,
    waitForConnections : false
});


/* GET home page. */
router.get('/', function(req, res, next) {
	pool.getConnection(
		function(err, connection) {
			if(err) {
				throw err
			}
			var sql = "SELECT * FROM view_spotInfo;"
			// var sql = "SELECT * FROM spot;"
			connection.query(sql, function(err, rows) {
				if(err) {
					throw err
				}
				console.dir(rows);
				res.render('page3', { data : rows });
			});
		});
  
});

module.exports = router;
