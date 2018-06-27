// 필요한 모듈을 읽어오는 부분
var express = require('express');
var router = express.Router();

router.get('/session_call', function(req, res, next) {
    console.log('session call 호출됨');
    
    if(req.session.user) {
    	res.redirect('http://localhost:3000/');
    } else {
    	res.redirect('http://localhost:3000/session/login');
    }

});

router.get('/login', function(req, res, next) {
    console.log("login site");
    res.render('login.ejs', {});
});

router.post('/login', function(req, res, next) {
	var id = req.body.id;
	var password = req.body.password;

	if(req.session.user) {
		console.login('이미 로그인되어 게시판 페이지로 이동한다.');
		res.redirect('http://localhost:3000/');
	} else {
		req.session.user = { id : id, name : '우주소녀', authorized : true};
		res.redirect('http://localhost:3000/');
	}
});

router.get('/logout', function(req, res, next) {
	if(req.session.user) {
		console.log("로그아웃 한다.");

		req.session.destroy(function(err) {
			if(err) { throw err; }
			console.log('세션을 삭제하고 로그아웃 되었음');
			res.redirect('http://localhost:3000');
		})
	} else {
		console.log("로그인이 되어 있지 않음");
		res.redirect('http://localhost:3000');
	}
});

module.exports = router;
