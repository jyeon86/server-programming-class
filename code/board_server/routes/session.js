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
// 사용자에게 전달받은 아이디 비밀번호를 데이터베이스에서 검색하고
// 로그인 처리를 해주는 미들웨어
router.post('/login', function(req, res, next) {
	// 사용자에게 전달받은 아이디 / 비밀번호를 변수에 저장
	var id = req.body.id;
	var password = req.body.password;
	//로그인 정보가 서버의 세션에 req.session.user 객체로 저장이 된다.
	// - 로그인 정보가 있다면 req.session.user 객체가 존재하고
	// 로그인 처리를 하지 않는다.
	// - 로그인 정보가 없다면 req.session.user 객체가 존재하지 않고
	// 로그인 처리를 해서 세션객체를 만든다.
	if(!req.session.user) {
		// 데이터베이스를 서버와 연결한다
		pool.getConnection(function(err, connection) {
			// 데이터베이스에게 질문하기 위한 SQL문
			var sql = "SELECT * FROM user_info WHERE id= '" 
				+ id +"' AND password=PASSWORD('"+password+"')";

			 console.log(sql)
			 // 데이터베이스에 SQL문으로 사용자 정보를 검색한다.
			 var query = connection.query(sql, function(err, rows) {
				if(err) {
					connection.release();
					throw err;
				}
				console.dir(rows);
				// 입력한 아이디랑 비밀번호와 일치하는 자료가 데이터베이스에 없을 경우 
				// 아이디가 맞지 않은 경우
				// 비밀번호가 맞지 않는 경우
				if(rows.length == 0) {
					res.redirect("http://localhost:3000/session/login");
				} 
				// 입력한 아이디랑 비밀번호와 일치하는 자료 1개가 데이터에 있을경우
				// 아이디랑 비밀번호가 맞는 경우
				else if(rows.length == 1) {
					// 로그인한 정보를 세션 객체 저장한다.
					// 로그인이 되어 있으면 세션 객체(req.session.user)에 아이디 정보가 있고,
					// 로그인이 되어 있지 않으면 세션 객체에 아이디 정보가 없다.
					req.session.user = { user_id : id };
					res.redirect('http://localhost:3000/');
				}
				// 그 외에 모든 경우(사용자에게 에러처리를 해야합니다. "잠시 후에 다시 시도해 주세요.") 
				else {}

				connection.release();
			});
		});
	} else {
		res.redirect('http://localhost:3000/');
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