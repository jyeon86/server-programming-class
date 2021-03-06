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

router.get('/:search_type/:keyword/:number_of_page', function(req, res, next) {
    var searchType = req.params.search_type;
    var keyword = req.params.keyword;
    var number_of_page = req.params.number_of_page;
    console.log("searchType : " + searchType)
    if(searchType == "writer") {
        searchType = "name";
    } else if (searchType == "number") {
        searchType = "_idx";
    }
    pool.getConnection(function(err, connection) {
        var sql_count = "SELECT count(*) AS count " +
                        "FROM my_board WHERE enable=1 " +
                        "AND " + searchType+ " like '%" + keyword + "%'"; 
        console.log(sql_count);

        var sql = "SELECT * FROM my_board WHERE enable=1 " +
                "AND "+searchType+" like '%" + keyword + "%'" +
                "ORDER BY create_at DESC " +
                "LIMIT 3 OFFSET " + ((number_of_page-1)*3);
        console.log(sql);

        connection.query(sql_count, function(err, rows) {
            if(err) {
                connection.release();
                throw err;
            }
            var total_write = rows[0].count;
            connection.query(sql, function(err, rows) {
                if(err) {// sql문 작성시 에러가 발생할 경우
                    connection.release();
                    throw err;
                }

                if(searchType == "name") {
                    searchType = "writer";
                } else if (searchType == "_idx") {
                    searchType = "number";
                }

                if(req.session.user) {
                    res.render('index', 
                        { rows : rows, is_logined : true, 
                            login_id : req.session.user.user_id,
                            type : searchType,
                            search_keyword : keyword,
                            total_write : total_write });
                        
                } else {
                    res.render('index', 
                        { rows : rows, is_logined : false,
                            login_id : "",
                            type : searchType,
                            search_keyword : keyword,
                            total_write : total_write });   
                }

            });
            connection.release();
        });
    });
});

router.post('/', function(req, res, next) {
    var keyword = req.body.keywordInput;
    var searchType = req.body.searchTypeInput;

    if(searchType == "writer") {
        searchType = "name";
    } else if (searchType == "number") {
        searchType = "_idx";
    }
    
    pool.getConnection(function(err, connection) {
        if(err) {
            console.log("getConnection Error");
            throw err;
        }
        var sql_count = "SELECT count(*) AS count " +
                        "FROM my_board WHERE enable=1 " +
                        "AND "+searchType+" like '%" + keyword + "%'"; 
        console.log(sql_count);

        connection.query(sql_count, function(err, rows) {
            if(err) {
                connection.release();
                throw err;
            }
            var total_write = rows[0].count;
            console.log(total_write);

            var sql = 'SELECT * FROM my_board WHERE ';

            if(searchType == "name") {
                searchType = "writer";
            } else if (searchType == "_idx") {
                searchType = "number";
            }
            switch(searchType) {
                case 'title':
                    sql += "title like '%" + keyword + "%' "
                    break;
                case 'writer':
                    sql += "name like '%" + keyword + "%' "
                    break;
                case 'number':
                    sql += "_idx = " + keyword + " "
                    break;
            }

            sql += "ORDER BY create_at DESC ";
            sql += "LIMIT 3 OFFSET 0";
            console.log(sql);

            var query = connection.query(sql, function(err, rows) {
                if(err) {
                    console.log("query Error");
                    connection.release();
                    throw err;
                }
                
                if(req.session.user) {
                    res.render('index', 
                        { rows : rows, is_logined : true, 
                            login_id : req.session.user.user_id,
                            type : searchType,
                            search_keyword : keyword,
                            total_write : total_write });
                        
                } else {
                    res.render('index', 
                        { rows : rows, is_logined : false,
                            login_id : "",
                            type : searchType,
                            search_keyword : keyword,
                            total_write : total_write });   
                }
                connection.release();
            });
        });
    });
});


module.exports = router;
