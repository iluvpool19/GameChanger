function Apple($el, size, controller) {
  this.node = $('<img id="apple"></img>');
  this.node.attr('src', 'games/snake/src/assets/apple.jpg');
  this.node.css({
    'height': size,
    'width': size
  });
  if (!controller) {
    this.x = Math.floor(Math.random() * $el.height() / size);
    this.y = Math.floor(Math.random() * $el.height() / size);
    socket.emit('appleGenerate', [this.x, this.y])
    console.log('emitted apple loc: ', [this.x, this.y]);
  } else {
    socket.on('appleGenerate', position => {
      console.log('controller heard: ', position);
      this.x = position[0];
      this.y = position[1];
    })
  }

  $el.append(this.node);
  this.size = size;
  this.render();
}

Apple.prototype.render = Head.prototype.render;

Apple.prototype.eat = function() {
  this.node.remove();
}
