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

router.get('/login', function(req, res, next) {
    console.log("login site");
    res.render('login.ejs', {});
});

router.post('/login', function(req, res, next) {
	var id = req.body.id;
	var password = req.body.password;
	if(!req.session.user) {
		pool.getConnection(function(err, connection) {
			var sql = "SELECT * FROM user_info WHERE id= '" 
				+ id +"' AND password=PASSWORD('"+password+"')";

			 console.log(sql)
			 var query = connection.query(sql, function(err, rows) {
				if(err) {
					connection.release();
					throw err;
				}
				console.dir(rows);
				if(rows.length == 0) {
					res.redirect("http://localhost:3000/session/login")
				} else {
					req.session.user = { id : id };
					res.redirect('http://localhost:3000/');
				}
				connection.release();
			});
		});
	}
});

router.get('/logout', function(req, res, next) {
	if(req.session.user) {
		console.log("로그아웃 한다.");

		req.session.destroy(function(err) {
			if(err) { throw err; }
			console.log('세션을 삭제하고 로그아웃 되었음');
		});
	} else {
		console.log("로그인이 되어 있지 않음");
	}
	res.redirect('http://localhost:3000');
});

module.exports = router;