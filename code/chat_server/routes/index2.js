var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	
  res.render('index2', { title: '채팅 클라이언트 02' });
});

module.exports = router;
