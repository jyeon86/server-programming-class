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
// join 웹페이지를 표시해주는 미들웨어
router.get('/', function(req, res, next) {
    res.render('join.ejs', {});
});

// 회원정보를 전달받아서 데이터베이스에 저장하는 미들웨어
router.post('/', function(req, res, next) {
	console.dir(req.body);

	// 사용자가 입력한 정보를 서버에서 가져오는 부분
	var id = req.body.username;
	var password = req.body.password;
	var year = req.body.year;
	var month = req.body.month;
	var day = req.body.day;
	var gender = req.body.gender;
	var phone_number = req.body.number;

	// 서버와 데이터베이스를 연결
	pool.getConnection(function(err, connection) {
		// 혹시나 연결도중 에러가 발생했을 경우
		if(err) {
			// 데이터베이스 연결을 해제한다.
			connection.release();
			// 에러를 표시해준다.
			throw err;
		}

		// 사용자에게 전달받은 사용자정보를 데이터베이스에 입력하는 sql문
		var sql = "INSERT INTO user_info " + 
			" (id, password, gender, birth, phone_number, " +
			" create_at, update_at) VALUES" +
			"('"+id+"', '"+password+"', '"+gender+"', " +
			"'"+year+"-"+month+"-"+day+"', '"+phone_number+"'," +
			"now(), now())"; 

		console.log(sql);
		// 데이터베이스에게 앞에서 작성한 sql문을 실행시킨다.
		connection.query(sql, function(err, rows) {
			// sql문을 실행할 때 에러가 발생할 경우
			if(err) {
				console.log("query Error");
				connection.release();
				throw err;
			}


//			res.render('join_success', { login_id : id });

			// 가입 후에 메인페이지로 이동합니다.
			res.redirect('http://localhost:3000/');
			connection.release();
		});
	})
});

module.exports = router;