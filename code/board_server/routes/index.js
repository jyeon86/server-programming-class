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

router.get('/', function(req, res, next) {
    // 데이터베이스를 활용하기 위해 풀에서 연결을 가져옴
    pool.getConnection(function(err, connection) {
        // 데이터 베이스에서 실행시킬 sql문(query)을 작성
        var query = connection.query('SELECT * FROM my_board WHERE enable=1;', function(err, rows) {
            if(err) {// sql문 작성시 에러가 발생할 경우
                connection.release();
                throw err;
            }

            if(req.session.user) {
                res.render('index', { rows : rows, is_logined : true, 
                    login_id : req.session.user.user_id });
                    
            } else {
                res.render('index', { rows : rows, is_logined : false, login_id : "" });   
            }
            connection.release();
            
        });
    });
  
});

router.get('/show_normal', function(req, res, next) {
    // 데이터베이스를 활용하기 위해 풀에서 연결을 가져옴
    pool.getConnection(function(err, connection) {
        // 데이터 베이스에서 실행시킬 sql문(query)을 작성
        var query = connection.query("SELECT * FROM my_board WHERE category = '일반'", function(err, rows) {
            if(err) {// sql문 작성시 에러가 발생할 경우
                connection.release();
                throw err;
            }
            
            if(req.session.user) {
                res.render('index', { rows : rows, is_logined : true, login_id : req.session.user.user_id });
                    
            } else {
                res.render('index', { rows : rows, is_logined : false, login_id : "" });   
            }

            connection.release();
            
        });
    });
  
});

router.get('/show_member', function(req, res, next) {
    // 데이터베이스를 활용하기 위해 풀에서 연결을 가져옴
    pool.getConnection(function(err, connection) {
        // 데이터 베이스에서 실행시킬 sql문(query)을 작성
        var query = connection.query("SELECT * FROM my_board WHERE category = '회원'", function(err, rows) {
            if(err) {// sql문 작성시 에러가 발생할 경우
                connection.release();
                throw err;
            }
            
            if(req.session.user) {
                res.render('index', { rows : rows, is_logined : true, login_id : req.session.user.user_id });
                    
            } else {
                res.render('index', { rows : rows, is_logined : false, login_id : "" });   
            }

            connection.release();
            
        });
    });
  
});

module.exports = router;
