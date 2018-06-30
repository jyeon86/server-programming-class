// 필요한 모듈을 읽어오는 부분
var express = require('express');
var router = express.Router();
var multer = require('multer'); // multer모듈 적용 (for 파일업로드)
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
  }
})
var upload = multer({ storage: storage })
router.get('/', function(req, res, next) {
  res.render('upload', {});
});

router.post('/', upload.single("myFile"), function(req, res, next) {
	res.send("uploaded : " + req.file);
	console.log(req.file)
});


module.exports = router;
