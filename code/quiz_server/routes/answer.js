var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('answer.ejs', { title: '귀요미:)' });
});

module.exports = router;
