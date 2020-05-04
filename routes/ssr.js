const renderer = require('vue-server-renderer').createRenderer();
const vue = require('vue');

function serverSideRender(template, context, res){
	let app = new vue({
		template: template,
		data: context,
	});

	renderer.renderToString(app, (err, html) => {
		if (err) throw err;
		res.end(html);
	});
}

module.exports.ssr = serverSideRender;
