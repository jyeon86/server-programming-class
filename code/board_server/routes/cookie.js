// 필요한 모듈을 읽어오는 부분
var express = require('express');
var router = express.Router();

router.get('/showCookie', function(req, res, next) {
    console.log('show cookie 호출됨');
    res.send(req.cookies)
});

router.get('/setUserCookie', function(req, res, next) {
    console.log('set user cookies 호출됨');

    // set cookie
    res.cookie('user', {id:'mike', name:'우주소녀', authorized:true});

    // response
    res.redirect('/cookie/showCookie');
});

module.exports = router;
