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
    // 페이지 번호를 변수에 저장한다.
    var number_of_page = req.params.number_of_page;
    pool.getConnection(function(err, connection) {
        // 데이터의 총 개수를 구하는 sql
        var sql_count = "SELECT count(*) AS count FROM"+
                        " my_board;"
       // var sql_count2 = "SELECT * FROM my_board WHERE enable=1";
        
        // 특정 페이지 번호에 보여질 데이터들만 추려서 검색하는 sql
        var sql = "SELECT * FROM my_board " +
                    "ORDER BY create_at DESC " +
                    // sql에서 LIMIT [숫자] : 숫자의 개수만큼 검색
                    // (검색 결과의 갯수를 지정)
                    // OFFSET 은 검색된 데이터의 순서 (0부터 시작)
                    // 맨 처음 검색데이터는 OFFSET이 0번이다.
                    "LIMIT 3 OFFSET " + ((number_of_page-1)*3);

        console.log(sql_count);
        console.log(sql);

        connection.query(sql_count, function(err, rows) {
            if(err) {// sql문 작성시 에러가 발생할 경우
                connection.release();
                throw err;
            }
            // 데이터의 총 개수를 임시 저장 변수에 저장함
            // 게시판 검색 결과랑 같이 데이터를 보낼 예정이므로
            total_write = rows[0].count;
            //tatal_write = rows.length;

            console.log(total_write);
            // 특정 페이지에 필요한 데이터들을 추려서 검색해옴
            connection.query(sql, function(err, rows) {
                if(err) {// sql문 작성시 에러가 발생할 경우
                    connection.release();
                    throw err;
                }

                if(req.session.user) {
                    res.render('index', 
                        { rows : rows, is_logined : true, 
                            login_id : req.session.user.user_id,
                            // type이 total이면 일반, 회원 글
                            // 모두를 대상으로 검색한 결과
                            type : "total",
                            // 검색결과에 대해 페이지 네이션을 적용할 때
                            // 검색어를 search_keyword에 저장
                            search_keyword : "",
                            // total_write는 총 데이터의 개수
                            total_write : total_write });
                        
                } else {
                    res.render('index', 
                        { rows : rows, is_logined : false,
                            login_id : "",
                            type : "total",
                            search_keyword : "",
                            total_write : total_write });   
                }

            });
            connection.release();
        });
        
    });
});
router.get('/', function(req, res, next) {
    res.redirect("http://localhost:3000/page/1");
  
});
router.get('/show_normal/:number_of_page', function(req, res, next) {
    var number_of_page = req.params.number_of_page;
    pool.getConnection(function(err, connection) {
        var sql_count = "SELECT count(*) AS count from my_board WHERE " +
                        "enable=1 AND category = '일반';"
        var sql = "SELECT * FROM my_board WHERE enable=1 " +
                    "AND category = '일반'" +
                    "ORDER BY create_at DESC " +
                    "LIMIT 3 OFFSET " + ((number_of_page-1)*3);
        connection.query(sql_count, function(err, rows) {
            if(err) {// sql문 작성시 에러가 발생할 경우
                connection.release();
                throw err;
            }
            var total_write = rows[0].count;

            connection.query(sql, function(err, rows) {
                if(err) {// sql문 작성시 에러가 발생할 경우
                    connection.release();
                    throw err;
                }

                if(req.session.user) {
                    res.render('index', 
                        { rows : rows, is_logined : true, 
                            login_id : req.session.user.user_id,
                            type : "normal",
                            search_keyword : "",
                            total_write : total_write });
                        
                } else {
                    res.render('index', 
                        { rows : rows, is_logined : false,
                            login_id : "",
                            type : "normal",
                            search_keyword : "",
                            total_write : total_write });   
                }

            });
            connection.release();
        });
    });
}); 
router.get('/show_normal', function(req, res, next) {
    
  res.redirect("http://localhost:3000/show_normal/1");
});

router.get('/show_member/:number_of_page', function(req, res, next) {
    var number_of_page = req.params.number_of_page;
    pool.getConnection(function(err, connection) {
        var sql_count = "SELECT count(*) AS count from my_board WHERE " +
                        "enable=1 AND category = '회원';"
        var sql = "SELECT * FROM my_board WHERE enable=1 " +
                    "AND category = '회원'" +
                    "ORDER BY create_at DESC " +
                    "LIMIT 3 OFFSET " + ((number_of_page-1)*3);
        connection.query(sql_count, function(err, rows) {
            if(err) {// sql문 작성시 에러가 발생할 경우
                connection.release();
                throw err;
            }
            var total_write = rows[0].count;

            connection.query(sql, function(err, rows) {
                if(err) {// sql문 작성시 에러가 발생할 경우
                    connection.release();
                    throw err;
                }

                if(req.session.user) {
                    res.render('index', 
                        { rows : rows, is_logined : true, 
                            login_id : req.session.user.user_id,
                            type : "member",
                            search_keyword : "",
                            total_write : total_write });
                        
                } else {
                    res.render('index', 
                        { rows : rows, is_logined : false,
                            login_id : "",
                            type : "member",
                            search_keyword : "",
                            total_write : total_write });   
                }

            });
            connection.release();
        });
    });
});
router.get('/show_member', function(req, res, next) {
    res.redirect("http://localhost:3000/show_member/1");
  
});

module.exports = router;
