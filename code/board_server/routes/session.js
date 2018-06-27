var express = require('express');
var router = express.Router();

router.get('/login', function(req, res, next) {
    console.log("login site");
    res.render('login.ejs', {});
});

router.post('/login', function(req, res, next) {
	var id = req.body.id;
	var password = req.body.password;
	if(!req.session.user) {
		req.session.user = { id : id };
	}
	console.dir(req.session);

	res.redirect('http://localhost:3000/');
});

router.get('/logout', function(req, res, next) {
	if(req.session.user) {
		console.log("로그아웃 한다.");

		req.session.destroy(function(err) {
			if(err) { throw err; }
			console.log('세션을 삭제하고 로그아웃 되었음');
		});
	} else {
		console.log("로그인이 되어 있지 않음");
	}
	res.redirect('http://localhost:3000');
});

module.exports = router;