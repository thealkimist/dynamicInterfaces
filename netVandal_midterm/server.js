var http = require("http")
var fs = require('fs'); // filesystem.
var path = require('path'); // used for traversing your OS.
var url = require('url');
var io = require("socket.io");

var mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"
};

var webroot = "./www";
var server = http.createServer(function(req,res){
	var fileToLoad;
	fileToLoad = webroot + url.parse(req.url).pathname;

	stats = fs.lstatSync(fileToLoad);
	if(stats.isDirectory()){
		fileToLoad = fileToLoad + "index.html";
	}

	var fileBytes;
	var httpStatusCode = 200;

	fs.exists(fileToLoad, function(doesItExist){
		if(!doesItExist){
			httpStatusCode = 404;
			fileToLoad = webroot + "404.html";
		}

		fileBytes = fs.readFileSync(fileToLoad);
		var mimeType = mimeTypes[path.extname(fileToLoad).split(".")[1]];

		res.writeHead(httpStatusCode, {'contentType': mimeType});
		res.end(fileBytes);
	});
});


server.listen(8080,'127.0.0.1');

var lastPosition = { x: 0, y: 0 }; // whatever default data
var lastPosition2 = { x: 0, y: 0 };
var lastPosition3 = { x: 0, y: 0 };
var lastPosition4 = { x: 0, y: 0 };




var socketServer = io.listen(server);
socketServer.sockets.on('connection', function (socket) {

  // Draggable 1  
  socket.emit('update_position', lastPosition);
  socket.on('receive_position', function (data) {
     lastPosition = data;               // new data updates 'last position'
     socket.broadcast.emit('update_position', data); // send `data` to all other clients
  });

  // Draggable 2
  socket.emit('update_position2', lastPosition2);
  socket.on('receive_position2', function (data) {
     lastPosition2 = data;               // new data updates 'last position'
     socket.broadcast.emit('update_position2', data); // send `data` to all other clients
  });

  socket.emit('update_position3', lastPosition3);
  socket.on('receive_position3', function (data) {
      lastPosition3 = data;               // new data updates 'last position'
      socket.broadcast.emit('update_position3', data); // send `data` to all other clients
  });

  socket.emit('update_position4', lastPosition4);
  socket.on('receive_position4', function (data) {
      lastPosition4 = data;               // new data updates 'last position'
      socket.broadcast.emit('update_position4', data); // send `data` to all other clients
  });

  
});


