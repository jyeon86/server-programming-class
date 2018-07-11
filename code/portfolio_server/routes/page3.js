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
router.get('/', function(req, res, next) {
	pool.getConnection(function(err, connection) {
		if(err) {
			throw err
		}
		var sql = "SELECT * FROM view_spotPage;"
		// var sql = "SELECT * FROM spot;"
		connection.query(sql, function(err, rows) {
			if(err) {
				connection.release();
				throw err
			}
			
			connection.query("SELECT * FROM reply;", function(err, comment) {
				if(err) {
					connection.release();
					throw err
				}
				
				for(var i = 0; i < rows.length; i++) {

					var temp = [];
					for(var j = 0; j < comment.length; j++) {
						if(rows[i].spot_id == comment[j].spot_id) {
							console.log("j : " + j);
							temp.push({ "writer" : comment[j].writer, 
								"contents" : comment[j].contents });
						}
					}

					rows[i].comment = temp;

					if(i == rows.length-1) {
						res.render('page3', { data : rows });
						console.dir(rows);
						connection.release();
					}

					temp = [];
				}
	
			});

		});
	});
  
});

module.exports = router;
