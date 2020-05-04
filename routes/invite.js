const con = require('./db.js').con;


function invite(data, res, req){
	let email = req.body.email;
	let parsedData = JSON.parse(JSON.stringify(data[0]));
	let search_email = `SELECT * FROM users WHERE email='${email}';`
	con.query(search_email, function(err, result){
		if (err) throw err;
		if (result.length){
			let parsedResult = JSON.parse(JSON.stringify(result[0]));
			let doctor_id = parsedData.id;
			let patient_id = parsedResult.id;
			add_invite(doctor_id, patient_id, res);
		} else{
			failed(res);
		}
		
	})

}


function add_invite(doctor_id, patient_id, res){
	let insert_invite = `INSERT INTO doc_invite (doctor, patient) VALUES (${doctor_id}, ${patient_id})`;
	con.query(insert_invite, function(err, result){
		if (err) throw err;
		success(res);
	});
}

function success(res){
	res.end(`<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Medcore - Home</title>
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
    <nav class="navbar navbar-expand-sm navbar-light nav-div">
        <a class="navbar-brand" href="home-doctor"><img src="images/logo.png" id='logo-navbar' alt="medcore"></a>
        <button class="navbar-toggler d-lg-none" type="button" data-toggle="collapse" data-target="#collapsibleNavId"
            aria-controls="collapsibleNavId" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="collapsibleNavId">
            <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
                <li class="nav-item active">
                    <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="doctor-patients">Pacientes</a>
                </li>
            </ul>
            <ul class='navbar-nav ml-auto mt-2 mt-lg-0'>
                <li class="nav-item">
                    <a class="nav-link" id='logout' href="logout">Logout</a>
                </li>
            </ul>

        </div>
    </nav>
    <div class="container">
        <div class='center'>
            <img src="images/doctor.png" alt="avatar" class='center-image' style='width: 30%; margin-top: 30px;'>
        </div>
        <h4 style='color: #3fcc50' class='text-center'>Convite enviado com sucesso</h4>
        <form action="invite" method="post">
            <div class="form-group " style='margin-top: 50px;'>
                <label for=""></label>
                <input type="text" class="form-control" name="email" id="invite-add" aria-describedby="emailHelpId"
                    placeholder="Email do paciente">
                <button type="submit" id='invites' class="btn btn-primary">Adicionar</button>
            </div>
        </form>
    </div>



</body>

</html>`)
}


function failed(res){
	res.end(`<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Medcore - Home</title>
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
    <nav class="navbar navbar-expand-sm navbar-light nav-div">
        <a class="navbar-brand" href="home-doctor"><img src="images/logo.png" id='logo-navbar' alt="medcore"></a>
        <button class="navbar-toggler d-lg-none" type="button" data-toggle="collapse" data-target="#collapsibleNavId"
            aria-controls="collapsibleNavId" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="collapsibleNavId">
            <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
                <li class="nav-item active">
                    <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="doctor-patients">Pacientes</a>
                </li>
            </ul>
            <ul class='navbar-nav ml-auto mt-2 mt-lg-0'>
                <li class="nav-item">
                    <a class="nav-link" id='logout' href="logout">Logout</a>
                </li>
            </ul>

        </div>
    </nav>
    <div class="container">
        <div class='center'>
            <img src="images/doctor.png" alt="avatar" class='center-image' style='width: 30%; margin-top: 30px;'>
        </div>
        <h4 style='color: red' class='text-center'>Algum erro ocorreu no envio do convite, tente novamente!</h4>
        <form action="invite" method="post">
            <div class="form-group " style='margin-top: 50px;'>
                <label for=""></label>
                <input type="text" class="form-control" name="email" id="invite-add" aria-describedby="emailHelpId"
                    placeholder="Email do paciente">
                <button type="submit" id='invites' class="btn btn-primary">Adicionar</button>
            </div>
        </form>
    </div>



</body>

</html>`)
}

function response(data, res, req){
	let doc_id = req.body.id;
	let choice = req.body.choice;
	let parsedData = JSON.parse(JSON.stringify(data[0]));
	let patient_id = parsedData.id;
	if (choice == 'yes'){
		accept_invite(patient_id, doc_id);
	}
	else{
		reject_invite(patient_id, doc_id);
	}
	res.redirect(303, 'patient_invites')
}


function accept_invite(patient_id, doctor_id){
	let sql_remove_invite = `DELETE FROM doc_invite WHERE doctor=${doctor_id} AND patient=${patient_id};`;
	let add_doctor = `INSERT INTO doc_patients (patient, doctor) VALUES (${patient_id}, ${doctor_id});`
	con.query(sql_remove_invite, function(err, result){
		if (err) throw err;
	});
	con.query(add_doctor, function(err, result){
		if (err) throw err;
	});
};

function reject_invite(patient_id, doctor_id){
	let sql_remove_invite = `DELETE FROM doc_invite WHERE doctor=${doctor_id} AND patient=${patient_id};`;
	con.query(sql_remove_invite, function(err, result){
		if (err) throw err;
	});
}




module.exports.response = response;
module.exports.invite = invite;




