var fs  = require("fs")

function app_index(response) {
	console.log(" . sending index .")
	fs.readFile('html/index.html', function(err, data) {
		if (err) {
			console.log(' X ---------------> no index.html')
		}
		response.writeHead(200, {"content-type":"text/html"})
		response.write(data)
		response.end()
	})
}

function include_io(res, request, file, ext) {
	std_content(res, request, "socket.io.min.js", "io")
}

function std_content(res, request, file, ext) {
	ext.verify()
	var code 	 = 200
	var resource = DIRECTORY[ext]+"/"+file
	var type 	 = MIME[ext]

//	console.log(" . "+resource+" . ")

	fs.readFile(resource, function(err, data) {
		if (err) {
			code = 404
			type = 'text/plain'
			data = '#404 Not found.'
			console.log(" X ---------------> not found ("+file+")")
		}
		res.writeHead(code, {'content-type':type})
		res.end(data)
	})
}

// this function verifies that the asset is able to be handled dynamic
String.prototype.verify = function() {
	if(typeof MIME[this] === 'undefined' || typeof DIRECTORY[this] === 'undefined' )
		console.log('. no-def . ' + this)
}


// associative arrays for dynamic linking
// set these up in app.js 
var MIME = {}
var DIRECTORY = {}
var handle = {}

exports.MIME 		= MIME
exports.DIRECTORY 	= DIRECTORY
exports.handle 		= handle
exports.std_content	= std_content
exports.app_index	= app_index
exports.include_io	= include_io