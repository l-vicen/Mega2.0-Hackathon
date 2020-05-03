const ssr = require('./ssr.js').ssr;
const crypto = require('crypto');
const mysql = require('mysql');
const con = require('./db.js').con;
const fs = require('fs');

function homeParser(data, res){
	let parsedData = JSON.parse(JSON.stringify(data[0]));
	let context = {
		name: parsedData.name,
		cnpj: parsedData.cnpj,
		email: parsedData.email
	};
	let template = fs.readFileSync('static/home-medcenter.html', 'utf-8');

	ssr(template, context, res);
}	


function add_to_db(req, res){
	let name = req.body.name;
	let email = req.body.email;
	let password = req.body.password;
	let pass_conf = req.body.confirm;
	let cnpj = req.body.cnpj;

	let hash = crypto.createHash('sha256').update(password, 'utf-8').digest('hex');

	let sql = "INSERT INTO clinics (name, email, password, cnpj) VALUES ('" + name + "', '" + email + "', '" + hash + "', '" + cnpj +"');";
	if (password === pass_conf){
		con.connect(function(err){
			if (err) throw err;
			con.query(sql, function(err, result){
				if (err) throw err;
				console.log("Added clinic " + name + " to database");
				res.redirect(303, 'login.html');
			});
		});

	}

}

module.exports.add = add_to_db;
module.exports.home = homeParser;
