var express = require('express'),
  app = express(),
  http = require('http').Server(app),
  io = require('socket.io')(http),
  fs = require('fs'),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  UserCtrl = require('./authenticate/userStuff'),
  mongoose = require('mongoose'),
  qs = require('qs'),
  mongoURI = 'mongodb://localhost/GameUsers';

var q;

mongoose.connect(mongoURI);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.get('/*', function(req, res, next) {
  q = '/' + req.query.id;
  next();
});
app.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname, '/loginsignuphtml/login.html'));
});

app.get('/signup', function(req, res) {
  res.sendFile(path.join(__dirname, '/loginsignuphtml/signup.html'));
});

app.post('/signup', UserCtrl.createUser);
app.post('/login', UserCtrl.verify);
io.sockets.setMaxListeners(100);

io.on('connection', function(socket) {

  q = '/hi';
  // var nsp = io.of(q);
  // nsp.on('connection', function(socket) {

  socket.join(q);
    console.log('user connected');
    socket.on('changeVariable', function(val) {
      console.log('heard: ', val);
      socket.to(q).broadcast.emit('changeVariable', val);
      console.log('emitted: ', val);
    });

    socket.on('obj', function(val) {
      console.log('hello');
      socket.to(q).broadcast.emit('obj', val);
    });

    socket.on('directionChange', direction => {
        socket.to(q).broadcast.emit('directionChange', direction);
        console.log('emitted: ', direction);
    });

    socket.on('appleGenerate', position => {
        socket.to(q).broadcast.emit('appleGenerate', position);
        console.log('server emitted: ', position);
    })

    socket.on('startController', start => {
        socket.to(q).broadcast.emit('startController', start);
        console.log('server emitted: ', start);
    })


  // });
});
app.get('/controller', function(req, res) {
      res.sendFile(path.join(__dirname, '/controller/controller.html'));
  // res.render('./controller/controller');

});

app.get('/snake', function(req, res) {
  res.sendFile(path.join(__dirname, '/games/snake/snake.html'));

});


app.get('*.js', function(req, res) {
  res.writeHead(200, {
    'content-type': 'text/javascript; charset=UTF-8'
  });
  res.end(fs.readFileSync(path.join(__dirname, req.url)));
});

app.get('*.css', function(req, res) {
  res.writeHead(200, {
    'content-type': 'text/css; charset=UTF-8'
  });
  res.end(fs.readFileSync(path.join(__dirname, req.url)));
});

app.get('*.jpg', function(req, res) {
  res.writeHead(200, {
    'content-type': 'image/jpg'
  });
  res.end(fs.readFileSync(path.join(__dirname, req.url)));
});

app.get('/controller', function(req, res) {
    res.sendFile(path.join(__dirname, '/controller/controller.html'));

});

http.listen(3000, function() {
  console.log('listening on port 3000');
});
