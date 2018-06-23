var express = require('express');
var router = express.Router();

/* GET home page. */
//웹 페이지를 읽어오는 미들웨어
router.get('/', function(req, res, next) {
	// 클라이언트에게 보여줄 웹페이지 파일(index.ejs)과
	// 데이터 객체 키 : title, 값 '1+1=?'
  res.render('index.ejs');
});

module.exports = router;
