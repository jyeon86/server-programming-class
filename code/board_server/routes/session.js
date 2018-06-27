var express = require('express');
var router = express.Router();

router.get('/login', function(req, res, next) {
    console.log("login site");
    res.render('login.ejs', {});
});

module.exports = router;