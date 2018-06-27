
var formTag = document.getElementById('formTag');
formTag.onsubmit = function(){
    //id가 usr인 객체를 가져와서 그 객체의 value를 id에 저장
    var id = document.getElementById('usr').value;
    var pwd = document.getElementById('pwd').value;
    var pwdConfirm = document.getElementById('pwdConfirm').value;
    var year = document.getElementById('year').value;
    var month = document.getElementById('month').value;
    var day = parseInt(document.getElementById('day').value);
    var number = document.getElementById('number').value;
    var isOk = true;
    //id 유효성 검사
    if(!checkValidId(id)){
        isOk = false;
    }
    if(!checkValidPw(pwd)){
        isOk = false;
    }
    //비밀번호와 비밀번호 확인이 같은지 검사
    if(!checkValidPwdConfirm(pwdConfirm)){
        isOk = false;
    }
    if(!checkValidBirth()){
        isOk = false;
    }
    if(!checkValidNumber()){
        isOk = false;
    }

    if(!isOk)
        return false;
}
function maxDay(month){
    switch(month){
        case '1': case '3': case '5': case '7': case '8': case '10': case '12':
            return 31;
        case '2':
            return 28;
        default:
            return 30;
    }
}
/* ID의 유효성을 검사 */
function checkValidId(id){
    var idRegex = /^[a-zA-Z]\w{4,9}$/;
    var infoId = document.getElementById('infoId');

    infoId.style.display = 'none';
    if(id.length == 0 || !idRegex.test(id)){
        infoId.style.display = 'block';
        return false;
    }
    return true;
}
//비밀번호의 유효성을 검사
function checkValidPw(pwd){
    var pwdRegex = /^(?=\w{8,20}$)\w*(\d[A-z]|[A-z]\d)\w*$/;
    var infoPwd = document.getElementById('infoPwd');

    infoPwd.style.display = 'none';
    if(pwd.length == 0 || !pwdRegex.test(pwd)){
        infoPwd.style.display = 'block';
        return false;
    }
    return true;
}
//비밀번호와 비밀번호 확인이 같은지 확인하는 함수
function checkValidPwdConfirm(pwdConfirm){
    //비밀번호
    var pwd = document.getElementById('pwd').value;
    //비밀번호와 일치하지 않을 때 보여줄 문구
    var infoPwdConfirm = document.getElementById('infoPwdConfirm');
    infoPwdConfirm.style.display = 'none';
    if(pwd != pwdConfirm){
        infoPwdConfirm.style.display = 'block';
        return false;
    }
    return true;
}
function checkValidBirth(){
    //year,month,day에 대한 객체의 값
    var year = document.getElementById('year').value;
    var month = document.getElementById('month').value;
    var day = parseInt(document.getElementById('day').value);
    //예외처리 문구에 대한 객체정보
    var infoBirth = document.getElementById('infoBirth');
    //예외처리 문구를 가림
    infoBirth.style.display = 'none';
    //월의 마지막 날짜를 계산
    var max = maxDay(month);
    //유효성 검사
    if(year.length != 4){
        infoBirth.innerHTML = '태어난 년도 4자리를 정확하게 입력하세요.';
        infoBirth.style.display = 'block';
        return false;
    }else if(isNaN(parseInt(month))){
        infoBirth.innerHTML = '태어난 월을 선택하세요.';
        infoBirth.style.display = 'block';
        return false;
    }else if(isNaN(day) || day < 1 || day > max){
        infoBirth.innerHTML = '태어난 일(날짜) 2자리를 정확하게 입력하세요.';
        infoBirth.style.display = 'block';
        return false;
    }
    return true;
}
function checkValidNumber(number){
    //유효성 검사 문구에 대한 객체정보    
    var infoNumber = document.getElementById('infoNumber');
    //유효성 검사 문구 숨김
    infoNumber.style.display = 'none';
    //정규표현식
    var numberRegex =/^010\d{8}$/;
    //유효성 검사
    if(!numberRegex.test(number)){
        infoNumber.style.display = 'block';
        return false;
    }
    return true;
}