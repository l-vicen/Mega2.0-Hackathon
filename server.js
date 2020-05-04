const express = require('express');
const vue = require('vue');
const fs = require('fs');
const renderer = require('vue-server-renderer').createRenderer();
const mysql = require('mysql');
const crypto = require('crypto');
const body_parser = require('body-parser');
const cookieParser = require('cookie-parser');

///////////////////////////////////ROUTES/////////////////////////

const patient = require('./routes/patient.js');
const ssr = require('./routes/ssr.js').ssr;
const clinic = require('./routes/clinic.js');
const doctor = require('./routes/doctor.js');
const invite = require('./routes/invite.js');

///////////////////////////////////////////////////////////////////


//OPTIONS/////////////////////////////////////
const rootFolder = 'static';
const defaultHTML = '/index.html';

var con = mysql.createConnection({
	host: "localhost",
	user: "www",
	password: "password",
	database: "medcore"
});

/////////////////////////////////////////////////

//EXPRESS MODULES//
const server = express();

server.use(body_parser.json());

server.use(body_parser.urlencoded({
	extended: true
}));

server.use(cookieParser());

server.use(express.static(rootFolder)); 
/////////////////////////////

/////////////////////////////////FUNCTIONS///////////////////////////////////
////////////////////////////////////////////////////////////////////////////

function cookie_gen(length) {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

function cookie_db(cookie, email, table){
	let sql = "UPDATE " + table + " SET session = '" + cookie + "' WHERE email='" + email + "';";
	con.query(sql, function(err, result){
		if (err) throw err;
		console.log("Session stored in database");
		});
}

function cookie_verify(cookie, callback, res, req){
	tables = ['users', 'clinics', 'doctors']
	let sql_base = "SELECT * FROM $table WHERE session='" + cookie +"';"
	let sql;
	let final_result;
	var not_found = 0;
	con.connect(function(err){
		for (table of tables){
			sql = sql_base.replace("$table", table);
			con.query(sql, function(err, result){
				if (result.length){
					 return callback(result, res, req);
				} else {
					not_found++;
				}
				if (not_found == 3){
					res.redirect(303, 'login.html');
					// NAO ACHOU O COOKIE EM NENHUMA DAS 3 TABELAS
				}
			});
		}
	});

	
}

function logout(data, res){
	let parsedData = JSON.parse(JSON.stringify(data[0]));
	let table = ''
	if (parsedData.crm !== undefined){
		table = 'doctors';
	} else if (parsedData.cnpj !== undefined){
		table = 'clinics';
	} else{
		table = 'users';
	} // DEFINIR QUAL TABELA ESTA O DATA
	
	let email = parsedData.email;
	console.log(table);
	let sql_update = "UPDATE " + table + " SET session = '' WHERE email='" + email + "';";
	con.query(sql_update, function(err, result){
		if (err) throw err;
		console.log(email + " logged out");
	})
	res.clearCookie('session');
	res.redirect(303, '/')
}

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

server.get("/", function(req, res){
	res.redirect(301, 'index.html');

});

server.get('/home-medcenter', function(req, res){
	cookie_verify(req.cookies.session, clinic.home, res);
});

server.get('/home-doctor', function(req, res){
	cookie_verify(req.cookies.session, doctor.home, res);

});

server.get('/home-patient', function(req, res){
	cookie_verify(req.cookies.session, patient.home, res);	
});


server.get('/logout', function(req, res){
	cookie_verify(req.cookies.session, logout, res);
});

server.get('/doctor-patients', function(req, res){
	cookie_verify(req.cookies.session, doctor.patients, res);
});

server.get('/patient-doctors', function(req, res){
	cookie_verify(req.cookies.session, patient.doctors, res);
});

server.get('/patient_invites', function(req, res){
	cookie_verify(req.cookies.session, patient.invites, res, req);
});

server.post('/remove-doctor', function(req,res){
	cookie_verify(req.cookies.session, patient.remove_doctor, res, req);
});

server.post("/add_patient", patient.add);

server.post("/add_clinic", clinic.add);

server.post("/add_doctor", function(req, res){
	cookie_verify(req.cookies.session, doctor.add, res, req);
	
});

server.post('/accept_doctor', function(req, res){
	cookie_verify(req.cookies.session, invite.response, res, req);
});

server.post("/invite", function(req, res){
	cookie_verify(req.cookies.session, invite.invite ,res, req);
})




// LOGIN

function create_token(password, id){
	
}

server.post("/auth", function(req, res){
	let email = req.body.email;
	let pass = req.body.password;
	let hash = crypto.createHash('sha256').update(pass, 'utf-8').digest('hex');
	let sql_user = "SELECT * FROM users WHERE email='" + email + "' AND password='" + hash + "';";
	let sql_clinic = "SELECT * FROM clinics WHERE email='" + email + "' AND password='" + hash + "';";
	let sql_doctor = "SELECT * FROM doctors WHERE email='" + email + "' AND password='" + hash + "';";
	
	
	con.connect(function(err){
		con.query(sql_user, function(err, result){
			if (err) throw err;
			if (result.length){
				console.log(result);
				console.log("Patient logged in successfully: " + email);
				let generated = cookie_gen(32);
				cookie_db(generated, email, 'users');
				res.cookie('session', generated, {maxAge: 216000000});
				res.redirect(303, 'home-patient');
			} else{
				con.query(sql_clinic, function(err, result){
				if (err) throw err;
				if (result.length){
					console.log("Clinic logged in successfully: " + email);
					let generated = cookie_gen(32);
					cookie_db(generated, email, 'clinics');
					res.cookie('session', generated, {maxAge: 216000000});
					res.redirect(303, 'home-medcenter');
				} else{
					con.query(sql_doctor, function(err, result){
						if (err) throw err;
						if (result.length){
							console.log("Doctor logged in successfully: " + email);
							let generated = cookie_gen(32);
							cookie_db(generated, email, 'doctors');
							res.cookie('session', generated, {maxAge: 216000000});
							res.redirect(303, 'home-doctor');
						} else{
							res.redirect(303, 'login.html');
						}
					});
				}
				});
			};
		});
	});
});

server.listen(8080);
console.log("Server listening on port 8080");

