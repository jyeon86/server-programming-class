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
router.get('/', function(req, res, next) {
  res.render('write', { title: 'Express' });
});


router.post('/', function(req, res, next) {
	// 클라이언트로 부터 전달 받은 데이터들(데이터베이스로 넣을 데이터들)
	var title = req.body.titleInput;
	var name = req.body.nameInput;
	var contents = req.body.contentsInput;
	var category = req.body.categoryInput;
	var noti = req.body.noti;
	
	console.log(title, name, contents, category);
	// 데이터 베이스와 서버가 연결되기 시작
	pool.getConnection(function(err, connection) {
		// 데이터베이스와 서버가 연결될 때 에러가 발생하면 실행되는 부분이다.
		if(err) {
			console.log("getConnection Error");
			throw err;
		}
		// sql문을 작성한다.(데이터베이스에 넣을 데이터와 sql문을 조합한 형태이다.)
		/*
		var sql = "INSERT INTO my_board (title, name, category,"+
		" contents, update_at, create_at) VALUES "+
		"('"+title+"', '"+name+"', '"+category+"', '"+contents+"', "+
		"now(), now())";
		*/	
		var sql = "INSERT INTO my_board (title, name, category,"+
		" contents, update_at, create_at, noti) VALUES "+
		"('"+title+"', '"+name+"', '"+category+"', '"+contents+"', "+
		"now(), now(), '"+noti+"')";
		console.log(sql);
		// 데이터베이스 연결을 통해서 sql문을 실행한다.
		// 실행한 결과는 rows에 에러가 발생하면 err 객체에 정보가 나타난다.
		var query = connection.query(sql, function(err, rows) {
			if(err) {
				console.log("query Error");
				connection.release();
				throw err;
			}
			// 데이터 베이스 처리를 마치고 해당 웹페이지(http://localhost:3000/)
			// 으로 이동한다.
			res.redirect('http://localhost:3000/');
			connection.release();
		});
	});
});

module.exports = router;
