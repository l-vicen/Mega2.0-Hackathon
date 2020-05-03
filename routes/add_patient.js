const crypto = require('crypto');
const mysql = require('mysql');
const con = require('./db.js').con;

function add_to_db(req, res){
	let name = req.body.name;
	let email = req.body.email;
	let password = req.body.password;
	let pass_conf = req.body.confirm;

	let hash = crypto.createHash('sha256').update(password, 'utf-8').digest('hex');

	let sql = "INSERT INTO users (name, email, password) VALUES ('" + name + "', '" + email + "', '" + hash +"');";
	if (password === pass_conf){
		con.connect(function(err){
			if (err) throw err;
			con.query(sql, function(err, result){
				if (err) throw err;
				console.log("Added user " + name + " to database");
				res.redirect(303, 'login.html');
			});
		});

	}

}

module.exports.add = add_to_db;
