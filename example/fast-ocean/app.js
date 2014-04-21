var   server = require('./server')
    , router = require('./router')
    , handler= require('./handler')


// all path commands and file exentions to be handled
handler.handle['start'] = handler.app_index
handler.handle['css'] = handler.std_content
handler.handle['ico']= handler.std_content
handler.handle['js'] = handler.std_content
handler.handle['io'] = handler.include_io
handler.handle[''] = handler.app_index
handler.handle['png'] = handler.std_content
handler.handle['gif'] = handler.std_content

// map assets to the filesystem
handler.DIRECTORY['html'] = "html"
handler.DIRECTORY['ico'] = "css"
handler.DIRECTORY['js'] = "js"
handler.DIRECTORY['css'] = "css"
handler.DIRECTORY['png'] = "css"
handler.DIRECTORY['gif'] = "css"
handler.DIRECTORY['io'] = "js/socket.io"

// any MIME types to server
handler.MIME['ico'] = "image/x-icon"
handler.MIME['css'] = "text/css"
handler.MIME['js']  = "text/javascript"
handler.MIME['io']  = "text/javascript"
handler.MIME['png'] = "image/png"
handler.MIME['gif'] = "image/gif"
handler.MIME['']    = ""

// start up the app
server.start_app(router.route, handler.handle)