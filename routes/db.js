const mysql = require('mysql');

var con = mysql.createConnection({
	host: "localhost",
	user: "www",
	password: "password",
	database: "medcore"
});

module.exports.con = con;
