var parse = require('path');

function route(handle, path, request, response) {
	//console.log(" route has been called ");

	var	ext	= parse.extname(path).replace(/\./,"")
	var	file= parse.basename(path)

	//console.log(" . " + ext + "/" + file)

	if (typeof handle[ext] === 'function') {
		return handle[ext](response, request, file, ext);
	}
	else
	{
		console.log(" no handle for " + ext);
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.write("404 Not found.");
		response.end();
	}
}

exports.route = route;