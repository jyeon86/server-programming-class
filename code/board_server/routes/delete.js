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

router.get('/:number', function(req, res, next) {
    var idx = req.params.number;
	pool.getConnection(function(err, connection) {
	    // 데이터 베이스에서 실행시킬 sql문(query)을 작성
	    /*
	    var sql = "DELETE FROM my_board WHERE _idx="+idx;
	    */
	    var sql = "UPDATE my_board SET enable=0 WHERE _idx="+idx;
	    console.log(sql);
	    
	    var query = connection.query(sql, function(err, rows) {
	        if(err) {// sql문 작성시 에러가 발생할 경우
	            connection.release();
	            throw err;
	        }
	        res.redirect("http://localhost:3000/");
	        connection.release();
	    });
	});
});


module.exports = router;