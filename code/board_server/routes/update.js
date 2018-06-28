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

/* GET home page. */
// 미들웨어 부분
// 주소를 localhost:3000/으로 접속한 경우, index.ejs파일을 웹브라우저에 출력해준다.
// 이때 전달할 데이터를 담은 객체도 같이 보낸다,
// title >> 키
// 'Express' >> 값
router.get('/:idx', function(req, res, next) {
	var idx = req.params.idx;

	pool.getConnection(function(err, connection) {
		var sql = "SELECT * FROM my_board WHERE _idx = " + idx;

		var query = connection.query(sql, function(err, rows) {
			if(err) {
				connection.release();
				throw err;
			}
			res.render('update.ejs', { rows : rows});
			connection.release();
		});
	});
});

router.post('/', function(req, res, next) {
	var idx = req.body.idx;
	var title = req.body.titleInput;
	var name = req.body.nameInput;
	var contents = req.body.contentsInput;
	var category = req.body.categoryInput;
	var noti = req.body.noti_check;
	if(typeof noti == 'undefined') noti = 0;
	
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
		+ ", noti = " + noti
		+ ' WHERE _idx = ' + idx;

		console.log(sql);
		var query = connection.query(sql, function(err, rows) {
			if(err) {
				console.log("query Error");
				connection.release();
				throw err;
			}
			res.redirect('/');
			connection.release();
		})
	});
})

module.exports = router;
