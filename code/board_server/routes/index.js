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

router.get('/page/:number_of_page', function(req, res, next) {
    var number_of_page = req.params.number_of_page;
    pool.getConnection(function(err, connection) {
        var sql_count = "SELECT count(*) AS count from my_board WHERE enable=1;"
        var number_of_count = 0;
        var sql = "SELECT * FROM my_board WHERE enable=1 " +
                    "ORDER BY create_at DESC " +
                    "LIMIT 3 OFFSET " + ((number_of_page-1)*3);

        console.log(sql_count);
        console.log(sql);
        connection.query(sql_count, function(err, rows) {
            if(err) {// sql문 작성시 에러가 발생할 경우
                connection.release();
                throw err;
            }
            total_write = rows[0].count;
            console.log(total_write);

            connection.query(sql, function(err, rows) {
                if(err) {// sql문 작성시 에러가 발생할 경우
                    connection.release();
                    throw err;
                }

                if(req.session.user) {
                    res.render('index', 
                        { rows : rows, is_logined : true, 
                            login_id : req.session.user.user_id,
                            total_write : total_write });
                        
                } else {
                    res.render('index', 
                        { rows : rows, is_logined : false,
                            login_id : "",
                            total_write : total_write });   
                }

            });
            connection.release();
        });
        
    });
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

            //res.render('index', {rows : rows});
            // 세션에 사용자 정보가 있는지 없는지에 따라 로그인 여부를 판단한다.
            if(req.session.user) {
                // 사용자 정보가 있는 경우
                // 사용자가 로그인 되어있는 상태이고,
                // index.ejs를 불러오는데 
                //사용자 아이디(req.session.user.user_id)를 전달한다.
                res.render('index', { rows : rows, is_logined : true, 
                    login_id : req.session.user.user_id });                    
            } else {
                // 사용자 정보가 있는 경우
                // 사용자가 로그인되어 있지 않은 상태이고,
                // index.ejs를 표시하는데
                // 로그인이 되어 있지 않으므로, 사용자 아이디는 빈칸으로 보낸다.
                res.render('index', { rows : rows, is_logined : false,
                    login_id : "" });   
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
