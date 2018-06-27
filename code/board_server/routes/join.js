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

router.get('/', function(req, res, next) {
    res.render('join.ejs', {});
});

router.post('/', function(req, res, next) {
	console.dir(req.body);

	var id = req.body.username;
	var password = req.body.password;
	var year = req.body.year;
	var month = req.body.month;
	var day = req.body.day;
	var gender = req.body.gender;
	var phone_number = req.body.number;

	pool.getConnection(function(err, connection) {
		if(err) {
			connection.release();
			throw err;
		}

		var sql = "INSERT INTO user_info " + 
			" (id, password, gender, birth, phone_number, " +
			" create_at, update_at) VALUES" +
			"('"+id+"', password('"+password+"'), '"+gender+"', " +
			"'"+year+"-"+month+"-"+day+"', '"+phone_number+"'," +
			"now(), now())"; 

		console.log(sql);

		connection.query(sql, function(err, rows) {
			if(err) {
				console.log("query Error");
				connection.release();
				throw err;
			}

			res.render('join_success', { login_id : id });
			connection.release();
		});
	})
});

module.exports = router;