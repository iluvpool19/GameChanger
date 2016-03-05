// var variables = require('./')
var qs = '/' + window.location.search.slice(window.location.search.indexOf('?') + 4);
// var socket = io(qs);
var socket = io();
var that;
socket.on('changeVariable', function(e) {

  console.log("speed changed to: ", e);
  that.SPEED = e;
});
socket.on('obj', function(e) {
  console.log("obj", e);
});


function Head($el, size) {
  this.node = $('<div id="head"></div>');
  that = this
  this.node.css({'height': size, 'width': size})
  this.currentDirection = 'right';
  this.SPEED = 500;
  $el.append(this.node);
  this.x = 0;
  this.y = 0;
  this.next = null;
  this.tail = this;
  this.size = size;
  this.elGrid = $el.height()/size;
  var elPos = $el.position()
  this.elPosX = elPos.left
  this.elPosY = elPos.top
  this.render()

  setTimeout(this.move.bind(this), this.SPEED);

}

Head.prototype.move = function() {
  var direction = this.currentDirection;
  var position = this.position;
  var x = this.x;
  var y = this.y;
  this.moveBody(x, y);
  this.moveHead(direction);
  if (this.checkBorder()) {
    this.checkBody();

    this.checkApple();
    this.render();

    setTimeout(this.move.bind(this), this.SPEED);
  } else {
    this.die()
  }
}

Head.prototype.checkBody = function() {
  var head_x = this.x;
  var head_y = this.y;

  for (var node = this.next; node; node = node.next) {
    if (head_x === node.x && head_y === node.y)
      this.die();
  }
}

Head.prototype.die = function() {
  $('#board').empty();
  this.startGame()
}

Head.prototype.checkBorder = function() {
  if (this.x > this.elGrid-1 || this.x < 0 || this.y > this.elGrid-1 || this.y < 0) {
    return false
  } else {
    return true
  }

}

Head.prototype.addBody = function() {
  var bodyPart = new Body($('#board'), this.x, this.y, this.size);
  this.tail.next = bodyPart;
  this.tail = this.tail.next;
}

Head.prototype.checkApple = function() {
  if (this.apple.x === this.x && this.apple.y === this.y) {
    this.apple.eat();
    this.apple = new Apple($('#board'), this.size, head.controller);
    this.addBody();
  }
}

Head.prototype.moveBody = function(x, y) {
  var temp_x, temp_y;
  for (var node = this.next; node; node = node.next) {
    temp_x = node.x;
    temp_y = node.y;
    node.x = x;
    node.y = y;
    x = temp_x;
    y = temp_y;
    node.render()
  }
}


Head.prototype.render = function() {
  this.node.offset({
    top: (this.size * this.y) + head.elPosY,
    left: (this.size * this.x) + head.elPosX
  })
}


Head.prototype.moveHead = function(direction) {

  if (direction === 'right') {
    this.x++;
  }
  if (direction === 'left') {
    this.x--;
  }
  if (direction === 'up') {
    this.y--;
  }
  if (direction === 'down') {
    this.y++;
  }
}
