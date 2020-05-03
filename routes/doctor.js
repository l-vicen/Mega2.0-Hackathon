const con = require('./db.js').con
const crypto = require('crypto');
const ssr = require('./ssr.js').ssr;
const fs = require('fs');


function homeParser(data, res){

	let parsedData = JSON.parse(JSON.stringify(data[0]));
	let context = {
		name: parsedData.name,
		spec: parsedData.spec,
		crm: parsedData.crm
	};
	let template = fs.readFileSync('static/home-doctor.html', 'utf-8');

	let clinic_name_sql = 'SELECT * FROM clinics WHERE id=' + parsedData.clinic + ";";
	con.query(clinic_name_sql, function(err, result){
		let parsedResult = JSON.parse(JSON.stringify(result[0]));
		context.clinic = parsedResult.name;
		ssr(template, context, res);
	})
}	




function add_to_db(data, res, req){
	let name = req.body.name;
	let email = req.body.email;
	let crm = req.body.crm;
	let spec = req.body.spec;
	let parsedData = JSON.parse(JSON.stringify(data[0]));
	let clinic_id = parsedData.id;
	let hash = crypto.createHash('sha256').update(crm, 'utf-8').digest('hex');
	
	let sql_insert = "INSERT INTO doctors (name, email, crm, spec, clinic, password) VALUES ('" + name + "', '" + email + "', '" + crm + "', '" + spec +"', '" + clinic_id + "', '" + hash + "');";
	con.query(sql_insert, function(err, result){
		if (err) throw err;
		console.log("Doctor registered: " + name);
		res.end(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agente registrado</title>
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
        integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
        crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"
        integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"
        crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"
        integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
        crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <link rel="stylesheet" href="/stylesheets/index.css">

</head>
<body>
    <h2 class='text-center' style='padding-top: 10%'>Agente cadastrado, sua senha de acesso eh igual a seu CRM</h1>
    <div class='center'>
        <a name='register' id='btn-blue' class='btn btn-primary' href='home-medcenter' role='button'>VOLTAR</a>
    </div>
</body>
</html>`);

	});
}


module.exports.add = add_to_db;
module.exports.home = homeParser;
