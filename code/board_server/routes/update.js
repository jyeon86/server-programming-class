// 필요한 모듈을 읽어오는 부분
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

// 게시판 웹페이지를 표시해주는 미들웨어
router.get('/:idx', function(req, res, next) {
	var idx = req.params.idx;

	pool.getConnection(function(err, connection) {
		// 게시판 웹페이지에 표시할 데이터베이스를 읽어오는 sql
		var sql = "SELECT * FROM my_board WHERE _idx = " + idx;

		var query = connection.query(sql, function(err, rows) {
			if(err) {
				connection.release();
				throw err;
			}
			res.render('update.ejs', { rows : rows });
			connection.release();
		});
	});
});

//전달 받은 데이터를 데이터베이스에 업데이트 해주는 미들웨어
//글을 수정해주는 역활을 하는 미들웨어
router.post('/', function(req, res, next) {
	var idx = req.body.idx;
	var title = req.body.titleInput;
	var name = req.body.nameInput;
	var contents = req.body.contentsInput;
	var category = req.body.categoryInput;
	/*
	공지글 체크 수정
	*/
	var noti = req.body.noti_check;
	if(typeof noti == 'undefined') noti = 0;
	// if(noti == 'undefined') noti = 0;
	/*
	end of 공지글 체크 수정
	*/
	pool.getConnection(function(err, connection) {
		if(err) {
			console.log("getConnection Error");
            throw err;
		}

		var sql = "UPDATE my_board SET title = '" + title 
		+ "', name = '" + name 
		+ "', contents = '" + contents 
		+ "', category = '" + category
		+ "', update_at = now()"
		// 공지글 체크 관련 기능을 추가한 sql 쿼리문
		+ ", noti = " + noti
		+ ' WHERE _idx = ' + idx;

		console.log(sql);
		//데이터베이스에 sql문을 실행한다.
		var query = connection.query(sql, function(err, rows) {
			if(err) {
				console.log("query Error");
				connection.release();
				throw err;
			}
			// 실행후에는 게시판 목록으로 이동한다.
			res.redirect('/');
			connection.release();
		});
	});
})

module.exports = router;
