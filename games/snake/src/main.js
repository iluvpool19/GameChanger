// head out in global scope for testing purposes
$(document).ready(function() {
  var controller = $(location).attr('pathname').slice(1) === 'controller'
  var scale = 1;
  var sizeScale = 0.25;
  var gridSize = 200;
  var gridPositionX = 9;
  var gridPositionY = 9;
  const size = 50;

  if (controller) {
    scale = 0.5;
    gridPositionY = 9;
    gridPositionX = 200;
  }

  $('#board').css({
    'height': gridSize * scale,
    'width': gridSize * scale,
    'top': gridPositionY,
    'left': gridPositionX
  })

  function startGame() {
    head = new Head($('#board'), size * sizeScale * scale);
    var apple = new Apple($('#board'), size * sizeScale * scale, controller);
    head.apple = apple;
    head.controller = controller;
    head.startGame = startGame;
    if (!controller) {
      socket.emit('startController', 'start')
    } else {
      console.log('started Controller');
    }
  }
if(!controller) {
  startGame();
} else {
  console.log('not player');
  socket.on('startController', startGame)
}

  socket.on('directionChange', direction => {
    console.log('heard: ', direction);
    if (controller) {
      head.currentDirection = direction
    }
  })

  if (!controller) {
    $('body').on('keydown', function(e) {
      if (e.keyCode === 37) {
        console.log('pressed left');
        head.currentDirection = 'left';
        socket.emit('directionChange', 'left')
      }
      if (e.keyCode === 39) {
        console.log('pressed right');
        head.currentDirection = 'right';
        socket.emit('directionChange', 'right')
      }
      if (e.keyCode === 40) {
        console.log('pressed down');
        head.currentDirection = 'down';
        socket.emit('directionChange', 'down')
      }
      if (e.keyCode === 38) {
        console.log('pressed up');
        head.currentDirection = 'up';
        socket.emit('directionChange', 'up')
      }
    });
  }
});
