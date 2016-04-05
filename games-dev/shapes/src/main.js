"use strict";
var qs = '/' + window.location.search.slice(window.location.search.indexOf('?') + 4);
var socket = io(qs);

var shapesOnBoard = {};
var holesOnBoard = {};

function init() {

  let control_obj;

  // socket.emit('obj', )

  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;

  $("#board").width(windowWidth * .9);
  $("#board").height(windowHeight * .9);
  $("#board").css('background-color', '#32c9d6');

  $('#board').append('<button id="addSquare" onclick="buildShape(\'square\', 50, 50)">Add Square</button>');
  $('#board').append('<button id="addCircle" onclick="buildShape(\'circle\', 50, 50)">Add Circle</button>');

}

function buildShape(shape, h, w) {
  if (!shapesOnBoard[shape]) {
    shapesOnBoard[shape] = []
  };

  if (!holesOnBoard[shape]) {
    holesOnBoard[shape] = []
  };

  var newShape = new Shape(shape, h, w, false);
  var newHole = new Shape(shape, h, w, true);

  shapesOnBoard[shape].push(newShape);
  $('#board').append(newShape.node);

  $('#' + newShape.id).on('drag', dragging);

  // var y = $('#' + newShape.id).position()

  // $('#' + newHole.id).css('left', x, 'top', y)

  $('#' + newShape.id).fadeIn(1000);

  $('#board').append(newHole.node)
  var shapeTop = $('#' + newShape.id).offset().top;
  var shapeLeft = $('#' + newShape.id).offset().left;

  newHole.xPosition = shapeLeft;
  newHole.yPosition = shapeTop;

  $('#' + newHole.id).css({
    'top': shapeTop,
    'left': shapeLeft
  });

  $('#' + newHole.id).fadeIn(1200);

  holesOnBoard[shape].push(newHole);

  var angle = Math.random() * (2 * Math.PI)
  var boardWidth = $('#board').width() - w;
  var boardHeight = $('#board').height() - h;
  var distance = Math.random() * 300


  var newTop = shapeTop + (Math.sin(angle) * distance);
  var newLeft = shapeLeft + (Math.cos(angle) * distance);


  if (newTop >= boardHeight || newTop <= 0) {
    newTop = shapeTop - (Math.sin(angle) * distance);
  }
  if (newLeft >= boardWidth || newLeft <= 0) {
    newLeft = shapeLeft - (Math.cos(angle) * distance);
  }

  $('#' + newShape.id).draggable()
  $('#' + newShape.id).animate({
    top: newTop + 'px',
    left: newLeft + 'px'
  });

  console.log('holes: ', holesOnBoard);
  console.log('shapes: ', shapesOnBoard);


}


function dragging(e) {
  let holeList = holesOnBoard[e.target.classList[0]];
  let accuracy = 0.5
    // console.log(holesOnBoard[e.target.classList[0]]);
  for (var i in holeList) {
    if (e.clientX >= holeList[i].xPosition - (holeList[i].width * accuracy)
    && e.clientX <= holeList[i].xPosition + (holeList[i].width * accuracy)
    && e.clientY <= holeList[i].yPosition + (holeList[i].height * accuracy)
    && e.clientY >= holeList[i].yPosition - (holeList[i].height * accuracy)) {
      $(document).trigger("mouseup");
      $('#' + e.target.id).draggable('disable');
      $('#' + e.target.id).position({
        top: holeList[i].yPosition,
        left: holeList[i].xPosition
      })

      $('#' + e.target.id).fadeOut(500);
      $('#' + holeList[i].id).fadeOut(500);
      holesOnBoard[e.target.classList[0]].splice(i, 1)
      break;
      // $('#' + e.target.id).remove();
      // $('#' + holeList[i].id).remove();

    }
  }

  // console.log(e.target.classList[0], 's', holesOnBoard[e.target.classList[0]].length);
}


//creates new shapes and holes

function Shape(shape, h, w, hole) {
  var boardWidth = $('#board').width() - w
  var boardHeight = $('#board').height() - h
  this.xPosition = Math.floor(Math.random() * boardWidth);
  this.yPosition = Math.floor(Math.random() * boardHeight);

  if (hole) {
    this.color = 'black';
    this.id = shape + shapesOnBoard[shape].length + 'Hole';
    this.display = '';
    this.class = shape + ' hole';
    this.z = 0;
  } else {
    this.color = 'rgb(' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')'
    this.id = shape + shapesOnBoard[shape].length;
    this.display = 'display:none;'
    this.class = shape + ' shape';
    this.z = 1;
  }



  this.shape = shape;
  this.height = h;
  this.width = w;
  this.node;

  if (shape === 'square') {
    this.node = '<div class="' + this.class + '" id="' + this.id + '" style="display: none;position: absolute;width: ' + this.width + 'px; height: ' + this.height + 'px;top:' + this.yPosition + 'px; left:' + this.xPosition + 'px; background-color:' + this.color + '; border:3px solid black;"></div>'
  }
  if (shape === 'circle') {
    this.node = '<div class="' + this.class + '" id="' + this.id + '" style="display: none; position: absolute; width: ' + this.width + 'px; height: ' + this.height + 'px;top:' + this.yPosition + 'px; left:' + this.xPosition + 'px; border-radius: 50%; background-color:' + this.color + '; border:3px solid black;"></div>'
  }

}
