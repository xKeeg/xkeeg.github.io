function KeyboardInputManager() {
  this.events = {};

  this.listen();
}

KeyboardInputManager.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

KeyboardInputManager.prototype.emit = function (event, data) {
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function (callback) {
      callback(data);
    });
  }
};



KeyboardInputManager.prototype.listen = function () {
  var self = this;

  var map = {
    38: 0, // Up
    39: 1, // Right
    40: 2, // Down
    37: 3, // Left
    75: 0, // vim keybindings
    76: 1,
    74: 2,
    72: 3
  };

  // Move Handler
  document.addEventListener("keydown", function (event) {
    var modifiers = event.altKey || event.ctrlKey || event.metaKey ||
      event.shiftKey;
    var mapped = map[event.which];

    if (!modifiers) {
      if (mapped !== undefined) {
        event.preventDefault();
        var feedbackContainer = document.getElementById('feedback-container');
        feedbackContainer.innerHTML = ' ';
        self.emit("move", mapped);
        self.emit('think');

      }

      if (event.which === 32) self.restart.bind(self)(event);
    }
  });

  // Deprecated
  var reset = document.getElementsByClassName("reset-button")[0];
  reset.addEventListener("click", this.restart.bind(this));


  // var hintButton = document.getElementById('hint-button');
  // hintButton.addEventListener('click', function (e) {
  //   e.preventDefault();
  //   var feedbackContainer = document.getElementById('feedback-container');
  //   feedbackContainer.innerHTML = '<img src=img/spinner.gif />';
  //   self.emit('think');
  // });

  // var addTileButton = document.getElementById('add-tile-button');
  // addTileButton.addEventListener('click', function (e) {
  //   e.preventDefault();
  //   self.emit('add-tile-prompt');
  // });

  var runButton = document.getElementById('run-button');
  runButton.addEventListener('click', function (e) {
    e.preventDefault();
    self.emit('run')
  })

  var gridCells = document.getElementsByClassName('grid-cell');
  gridCells = Array.from(gridCells);

  gridCells.forEach(cell => {
    cell.addEventListener('click', function (e) {
      e.preventDefault();
      var pos = cell.id.slice(-2);
      console.dir(pos);
      console.dir(cell);
      self.emit('cell-clicked', pos);
      self.emit('think');
    })
  })


  // Listen to swipe events
  var gestures = [Hammer.DIRECTION_UP, Hammer.DIRECTION_RIGHT,
  Hammer.DIRECTION_DOWN, Hammer.DIRECTION_LEFT];

  var gameContainer = document.getElementsByClassName("game-container")[0];
  var handler = Hammer(gameContainer, {
    drag_block_horizontal: true,
    drag_block_vertical: true
  });

  handler.on("swipe", function (event) {
    event.gesture.preventDefault();
    mapped = gestures.indexOf(event.gesture.direction);

    if (mapped !== -1) self.emit("move", mapped);
  });
};

KeyboardInputManager.prototype.restart = function (event) {
  event.preventDefault();
  this.emit("restart");
};
