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

router.post('/', function(req, res, next) {
    var keyword = req.body.keywordInput;
    var searchType = req.body.searchTypeInput;

    pool.getConnection(function(err, connection) {
        if(err) {
            console.log("getConnection Error");
            throw err;
        }
        var sql = 'SELECT * FROM my_board WHERE ';

        switch(searchType) {
            case 'title':
                sql += "title like '%" + keyword + "%';"
                break;
            case 'writer':
                sql += "name like '%" + keyword + "%';"
                break;
            case 'number':
                sql += "_idx = " + keyword + ";"
                break;
        }
        console.log(sql);

        var query = connection.query(sql, function(err, rows) {
            if(err) {
                console.log("query Error");
                connection.release();
                throw err;
            }
            console.dir(rows);
            res.render('index.ejs',  { rows : rows });
            connection.release();
        });

    });
});


module.exports = router;
