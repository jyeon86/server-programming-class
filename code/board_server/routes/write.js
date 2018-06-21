// 필요한 모듈을 읽어오는 부분
var express = require('express');
var router = express.Router();

/* GET home page. */
// 미들웨어 부분
// 주소를 localhost:3000/으로 접속한 경우, index.ejs파일을 웹브라우저에 출력해준다.
// 이때 전달할 데이터를 담은 객체도 같이 보낸다,
// title >> 키
// 'Express' >> 값
router.get('/write', function(req, res, next) {
  res.render('write', { title: 'Express' });
});

module.exports = router;
