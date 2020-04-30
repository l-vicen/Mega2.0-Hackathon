const server = require('express')();
const vue = require('vue');
const fs = require('fs');
const renderer = require('vue-server-renderer').createRenderer();


//OPTIONS//
const rootFolder = 'static';
const defaultHTML = '/index.html';


///////////


server.get('*', function(req, res) {
	let file = rootFolder + req.path;
	if (req.path == '/'){
		file = rootFolder + defaultHTML;
	}
	console.log("GET file: " + file);
		
	var app = new vue({ template: fs.readFileSync(file, 'utf-8') });
			
	
	renderer.renderToString(app, (err,html) => {
		if (err){
			throw err;
			res.status(500).send("<h1>Internal Server Error</h1>");
			return;
		}
		console.log(html);
		res.send(html);
	});

});



server.listen(8080);
console.log("Server listening on port 8080");

