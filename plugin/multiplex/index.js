// Reveal.js multiplex server
// Without static file server

var http = require('http');
var express = require('express');
var fs = require('fs');
var io = require('socket.io');
var crypto = require('crypto');

var app = express();
var staticDir = express.static;
var server = http.createServer(app);

//var STATIC_TOKEN = '907872b700b886a4'; // used as id on the client side
var STATIC_TOKEN = '1e6e1b4cffe4418c'; // used as secret by the master

io = io(server);

var opts = {
    port: process.env.PORT || 1948,
    addr: process.env.ADDR || '0.0.0.0'
};

io.on('connection', function(socket) {
    socket.on('multiplex-statechanged', function(data) {
        if (typeof data.secret == 'undefined' || data.secret == null || data.secret === '') return;
        if (createHash(data.secret) === data.socketId || data.secret === STATIC_TOKEN) {
            data.secret = null;
            socket.broadcast.emit(data.socketId, data);
        };
    });
});

app.get("/", function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });

    var stream = fs.createReadStream('index.html');
    stream.on('error', function(error) {
        res.write('<style>body{font-family: sans-serif;}</style><h2>reveal.js multiplex server.</h2><a href="/token">Generate token</a>');
        res.end();
    });
    stream.on('readable', function() {
        stream.pipe(res);
    });
});

app.get("/token", function(req, res) {
    var ts = new Date().getTime();
    var rand = Math.floor(Math.random() * 9999999);
    var origsecret = ts.toString() + rand.toString();
    var cipher = crypto.createCipher('blowfish', origsecret);
    var secret = cipher.final('hex');
    res.send({
        secret: secret,
        socketId: createHash(secret)
    });
});

var createHash = function(secret) {
    var cipher = crypto.createCipher('blowfish', secret);
    return (cipher.final('hex'));
};

// Actually listen
server.listen(opts.port, opts.addr);

var brown = '\033[33m',
    green = '\033[32m',
    reset = '\033[0m';
console.log(brown + "reveal.js:" + reset + " multiplex at " + green + opts.addr + ":" + opts.port + reset);
