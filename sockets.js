'use strict';
const buildPic = require('./buildPic');

let roomsObj = {};

function startSocket(nameSpace, io) {
  const nsp = io.of(nameSpace);
  nsp.max_connections = 2;
  nsp.connections = 0;
  roomsObj[nameSpace] = { gameName: 'snake', connections: 0 };


  nsp.on('connection', socket => {
    if (nsp.connections >= nsp.max_connections) {
      nsp.emit('disconnect', 'Sorry Sucka');
      socket.disconnect();
    } else {
      nsp.connections++;
      roomsObj[nameSpace].connections++;
      console.log('user connected', nsp.connections);
    }

    socket.on('obj', val => {
      nsp.emit('obj', val);
    });


    socket.on('changeVariable', val => {
      nsp.emit('changeVariable', val);
    });

    // captures img from game and emits to controller
    socket.on('image', imgObj => {
      nsp.emit('image', imgObj);
      // if (imgObj.h) {
      //   buildPic(imgObj, nsp);
      // } else {
      // }
    });

    socket.on('chartData', data => {
      nsp.emit('chartData', data);
    });

    socket.on('changeGame', (e) => {
      roomsObj['/' + e[1]].gameName = e[0];
      nsp.emit('changeGame', e[0]);
    });

    socket.on('disconnect', () => {
      nsp.connections--;
      roomsObj[nameSpace].connections--;
      socket.disconnect();
    });
  });
}

module.exports = {
  roomsObj: roomsObj,
  startSocket: startSocket
}
