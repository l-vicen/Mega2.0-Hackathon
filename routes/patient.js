const crypto = require('crypto');
const mysql = require('mysql');
const con = require('./db.js').con;
const ssr = require('./ssr.js').ssr;
const fs = require('fs');
const axios = require('axios');

///BLOCKCHAIN API CONFIGS///

const http_create_wallet = 'http://127.0.0.1:3333/users'

////////////////////////////

function homeParser(data, res){
	const parsedData = JSON.parse(JSON.stringify(data[0]));
	let context = {
		name: parsedData.name,
		age: parsedData.age || "DATA DE NASCIMENTO",
		sex: parsedData.sex || "SEXO",
		weigth: parsedData.weigth || "PESO",
		blood: parsedData.blood || "TIPO DE SANGUE"
	};
	let template = fs.readFileSync('static/home-patient.html', 'utf-8');

	ssr(template, context, res);
}	



function add_to_db(req, res){
	let name = req.body.name;
	let email = req.body.email;
	let password = req.body.password;
	let pass_conf = req.body.confirm;

	let hash = crypto.createHash('sha256').update(password, 'utf-8').digest('hex');

	if (password === pass_conf){
		axios.post(http_create_wallet, {password:password, readonly:0}).then(function(response){
			con.connect(function(err){
				const sql = ` INSERT INTO users (name, email, password, wallet) VALUES ('${name}', '${email}', '${hash}', '${response.data.id}');`
				if (err) throw err;
				con.query(sql, function(err, result){
					if (err) throw err;
					console.log("Added user " + name + " to database");
					res.redirect(303, 'login.html');
				});
			});
		
		
		
		})
		

	}

}

function doctors(data, res){
	const parsedData = JSON.parse(JSON.stringify(data[0]));
	let patient_id = parsedData.id;
	const query = `SELECT * FROM doc_patients WHERE patient=${patient_id};`;
	let final_data = [];
	let getData;
	let doc_id;
	let parsed;
	let selected;
	let template = fs.readFileSync('static/patient-doctors.html').toString();
	con.query(query, function(err, result){
		if (result.length){
			const length = result.length;
			cont = 0;
			for (i of result){
				doc_id = i.doctor;
				getData = `SELECT * FROM doctors WHERE id=${doc_id};`;
				con.query(getData, function(err, result){
					parsed = JSON.parse(JSON.stringify(result[0]));
					selected = {
						name: parsed.name,
						spec: parsed.spec,
						clinic: parsed.clinic,
						id: parsed.id
					}
					
					final_data.push(selected);
					cont++;
					if (cont == length){
						let context = {
							doctors: final_data
						}
						console.log(context);
						ssr(template, context, res);
					}
				})
				
			}
		} else{
			res.end(fs.readFileSync('static/patient-doctors-false.html').toString());
		}
	
	});

}


function remove_doctor(data, res, req){
	const parsedData = JSON.parse(JSON.stringify(data[0]));
	let doc_id = req.body.id;
	let patient_id = parsedData.id;
	let delete_query = `DELETE FROM doc_patients WHERE patient=${patient_id} AND doctor=${doc_id};` 
	con.query(delete_query, function(err, result){
		if (err) throw err;
		console.log(`${patient_id} removed ${doc_id}`);
	})
	
	res.redirect(303, 'patient-doctors');
}



function invites(data, res, req){
	const parsedData = JSON.parse(JSON.stringify(data[0]));
	let patient_id = parsedData.id;
	let query = `SELECT * FROM doc_invite WHERE patient=${patient_id};`;
	let final_data = [];
	let getData;
	let doc_id;
	let parsed;
	let length;
	let selected;
	let template = fs.readFileSync('static/patient-accept.html').toString();
	con.query(query, function(err, result){
		if (result.length){
			length = result.length;
			cont = 0;
			for (i of result){
				doc_id = i.doctor;
				getData = `SELECT * FROM doctors WHERE id=${doc_id};`;
				con.query(getData, function(err, result){
					parsed = JSON.parse(JSON.stringify(result[0]));
					selected = {
					name: parsed.name,
					spec: parsed.spec,
					clinic: parsed.clinic,
					id: parsed.id
					}
					
					final_data.push(selected);
					cont++;
					if (cont == length){
						let context = {
							doctors: final_data
						}
						ssr(template, context, res);
					}
				})
				
			}
		} else{
			template = fs.readFileSync('static/patient-doctors-false.html').toString();
			template = template.replace('Meus medicos', 'Meus convites');
			template = template.replace('Meus medicos', 'Meus convites');
			template = template.replace('Meus convites', 'Meus medicos');
			template = template.replace('Voce ainda nao adicionou seus medicos na plataforma', 'Voce nao tem nenhum convite pendente');
			res.end(template);
			//MUDA O TEMPLATE
		}
	})

}

module.exports.invites = invites;
module.exports.remove_doctor = remove_doctor;
module.exports.doctors = doctors;
module.exports.add = add_to_db;
module.exports.home = homeParser;



