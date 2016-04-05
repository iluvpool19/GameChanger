if (!window.requestAnimationFrame) {

  window.requestAnimationFrame = (function() {

    return window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {

        window.setTimeout(callback, 1000 / 60);

      };

  })();

}
//attempt to lock the screen  https://developer.mozilla.org/en-US/docs/Web/API/Screen/lockOrientation




var ball;
var w;
var h;
var qs = '/' + window.location.search.slice(window.location.search.indexOf('?') + 4);
var socket = io(qs);


socket.on('changeGame', (e) => {
  console.log('changedGame');
  localStorage.setItem('gameName', e)
  location.reload();
})

function init() {

  $('#board').append('<div id="ball"></div>');
  $('#board').append('<div id="hole"></div>');
  ball = $('#ball').get()[0];
  hole = $('#hole').get()[0];

  ball.sensitivity = 1;
  ball.ballSize = 100;
  ball.holeSize = 125;
  ball.currentDirection = '';

  ball.counter = 0;


  w = window.innerWidth;
  h = window.innerHeight;
  $('#board').height(h);
  $('#board').width(w);
  $('#board').css({
    "background-color": "white"
  });


  var holeSize = 100 * (1 + 0.5);
  $('#ball').css({
    "transition": "all",
    "position": "absolute",
    "width": "100px",
    "height": "100px",
    "border-radius": "50%",
    "background": "#32c9d6",
    "box-shadow": "3px 3px 5px 6px #6E6E6E",
    "z-index": "1"
  })

  $('#hole').css({
    "transition": "all",
    "position": "absolute",
    "border-radius": "50%",
    "background": "black",
    "box-shadow": "inset -5px -5px 5px 5px #b7acac",
    "width": holeSize + 'px',
    "height": holeSize + 'px'
  })


  ball.style.left = (w / 2) - 50 + "px";
  ball.style.top = (h / 2) - 50 + "px";
  ball.velocity = {
    x: 0,
    y: 0
  }
  ball.position = {
    x: 0,
    y: 0
  }

  hole.position = {

  }
  renderHole(holeSize);

  window.addEventListener("deviceorientation", function(event) {
    ball.velocity.y = ball.sensitivity * Math.round(event.beta);


    $(window).on('keydown', function(e) {
      if (e.keyCode === 37) {
        console.log('pressed left');
        ball.currentDirection = 'left'
        ball.velocity.x -= ball.sensitivity * 10
      }
      if (e.keyCode === 39) {
        console.log('pressed right');
        ball.currentDirection = 'right'
        ball.velocity.x += ball.sensitivity * 10
      }
      if (e.keyCode === 40) {
        console.log('pressed down');
        ball.currentDirection = 'down'
        ball.velocity.y += ball.sensitivity * 10
      }
      if (e.keyCode === 38) {
        console.log('pressed up');
        ball.currentDirection = 'up'
        ball.velocity.y -= ball.sensitivity * 10
      }
    });

    if (window.DeviceOrientationEvent) {

      window.addEventListener("deviceorientation", function(event) {
        var orientation = 'portrait-primary';
        // window.screen.lockOrientationUniversal = window.screen.lockOrientation || window.screen.mozLockOrientation || window.screen.msLockOrientation;
        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
          } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
          } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
          } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
          }
        }

        window.screen.orientation.lock(orientation);
        ball.velocity.y = ball.sensitivity * Math.round(event.beta);

        ball.velocity.x = ball.sensitivity * Math.round(event.gamma);
      })
    };

    update();
  })
  setInterval(drawPic, 250); //need to figure out a better way to screen cast

}

function drawPic() {
  var board = document.getElementById('gameBoard')
  board.setAttribute("xmlns", "http://www.w3.org/1999/xhtml")
  var obj = {
    'h': board.offsetHeight,
    'w': board.offsetWidth,
    'html': board.outerHTML.replace(/\n/g, '')
  }
  socket.emit('image', obj);
}



socket.on('changeVariable', arr => {
  ball[arr[0]] = arr[1];
})


function update() {

  $('#ball').css({
    'height': ball.ballSize,
    'width': ball.ballSize
  })
  $('#hole').css({
    'height': ball.holeSize,
    'width': ball.holeSize
  })

  ball.position.x += ball.velocity.x;
  ball.position.y += ball.velocity.y;
  var distance = Math.sqrt(Math.pow((ball.position.x - hole.position.left), 2) + Math.pow((ball.position.y - hole.position.top), 2));
  if (distance <= ($('#hole').width() - $('#ball').width())) {
    console.log('You win!!');
    var holeWidth = $('#hole').width()
    renderHole(holeWidth);
  }

  if (ball.position.x > (w - 100) && ball.velocity.x > 0) {
    ball.position.x = w - 100;

    ball.velocity.x = -ball.velocity.x;
  }

  if (ball.position.x < 0 && ball.velocity.x < 0) {
    ball.position.x = 0;
    ball.velocity.x = -ball.velocity.x;
  }

  if (ball.position.y > (h - 100) && ball.velocity.y > 0) {
    ball.velocity.y = -ball.velocity.y;
  }

  if (ball.position.y < 0 && ball.velocity.y < 0) {
    ball.velocity.y = -ball.velocity.y;
  }
  if (ball.counter % 10 === 0) {
    socket.emit('chartData', {
      'Distance': distance
    })
  }
  ball.style.top = ball.position.y + "px"
  ball.style.left = ball.position.x + "px"
  ball.counter++;
  requestAnimationFrame(update); //KEEP ANIMATING
}

function renderHole(size) {
  var node = $('#hole').get()[0];

  node.position = {
    left: Math.floor(Math.random() * (w - size)),
    top: Math.floor(Math.random() * (h - size))
  };
  node.style.top = node.position.top + 'px'
  node.style.left = node.position.left + 'px'
}
