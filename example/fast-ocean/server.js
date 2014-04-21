var   app 
	, url = require('url')
	, calc= require('./node_modules/propsolv/prosolv.js')
    , io

function start_app(route, handle) {
	app = require('http').createServer(onRequest).listen(process.env.PORT || 8888)
	io = require('socket.io').listen(app, { log: false }).set('log level', 1)
	//calc.test();
	//console.log(" . ONLINE ]-[ http://localhost:8888 .")

	function onRequest(request, response) {
		var pathname = url.parse(request.url).pathname.replace("/","")

		route(handle, pathname, request, response)
	}
	
	//START SOCKET IO
	io.sockets.on('connection', function (socket) {
		socket.on('disconnect',function() {

		})
		socket.on('try', function (data) {
			//console.log(data)
			//console.log('socket recieved...')
			var safety = data.statement.split('\n')				
			console.log( safety )

			try {

				var steps = calc.begin_solution(data.statement)
				socket.emit('reset','NOW')
				socket.emit('state',data.statement)

				if(steps == "cant solve") {
					calc.clean_up()
					socket.emit('error','This cannot be resolved.')					
					return
				}

				for(var i in steps) {
					//console.log('sending' + steps[i] )
					socket.emit('echo',steps[i])
				}

				calc.clean_up()
			}
			catch(e) {
				console.log(data.statement)
				console.log('err ' + typeof data.statement + " " + data.statement)

				socket.emit('error',data.statement + ' could not be solved. ')
				calc.clean_up()
				socket.emit('reset','NOW')
			}
			//calc.clean_up()
		})


	}) // END SOCKET IO	
}


exports.start_app = start_app;