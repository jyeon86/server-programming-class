var host = 'ec2-13-124-177-129.ap-northeast-2.compute.amazonaws.com';
var port = 3306;
var user = 'root';
var password = 'raejin';
var database = 'student2';

exports.getHost = function () {
    return host;
};

exports.getPort = function () {
    return port;
};

exports.getUser = function () {
    return user;
};

exports.getPassword = function () {
    return password;
};

exports.getDatabase = function () {
    return database;
};
