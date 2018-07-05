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
// localhost:3000/read/3
// 3값이 변수 idx에 들어간다.
router.post('/del', function(req, res, next) {
    var idx = req.body.number;
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
router.get('/:idx', function(req, res, next) {
    var idx = req.params.idx; // 웹페이지 주소 정보가 req 객체에 들어가 있으므로 값을 가져옴
    
    // 데이터베이스를 활용하기 위해 풀에서 연결을 가져옴
    pool.getConnection(function(err, connection) {
        // 데이터 베이스에서 실행시킬 sql문(query)을 작성
        var select_sql = "SELECT * FROM my_board WHERE _idx="+idx;
        connection.query(select_sql, function(err, rows) {
            if(err) {// sql문 작성시 에러가 발생할 경우
                connection.release();
                throw err;
            }

            if(rows[0].category == "회원") {
                if(!req.session.user) {
                    res.redirect('http://localhost:3000/session/login');
                    connection.release();
                    return;
                }
            } 

            var update_sql = "UPDATE my_board SET hit_count=hit_count+1 WHERE _idx="+idx;
            connection.query(update_sql, function(err, rows2) {
                if(err) {// sql문 작성시 에러가 발생할 경우
                    connection.release();
                    throw err;
                }
                res.render('read', { rows : rows });
                connection.release();
            });
        });

    });
});

router.post('/del', function(req, res, next) {
    var idx = req.body.number;
    pool.getConnection(function(err, connection) {
 
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
 

router.post('/', function(req, res, next) {
    console.dir(req.body);
    var idx = req.body.idx;

    pool.getConnection(function(err, connection) {
        if(err) {
            console.log("getConnection Error");
            throw err;
        }
        var sql = "UPDATE my_board SET "+
                "best_count = best_count + 1 WHERE _idx = " + idx;
        var query = connection.query(sql, function(err, rows) {
            if(err) {
                console.log("query Error");
                connection.release();
                throw err;
            }
            res.redirect('http://localhost:3000');
            connection.release();
        });
    });
});


module.exports = router;
