function GameManager(size, InputManager, Actuator) {
  this.size = size; // Size of the grid
  this.inputManager = new InputManager;
  this.actuator = new Actuator;
  this.multiplier = 2;

  this.running = false;

  this.inputManager.on("move", this.move.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));

  this.inputManager.on('think', function () {
    this.actuator.showLoading();
    var best = this.ai.getBest();
    this.actuator.showHint(best.move);
  }.bind(this));

  this.inputManager.on('add-tile-prompt', function () {
    var XPos = parseInt(prompt("Enter X Pos")) - 1;
    var YPos = parseInt(prompt("Enter Y Pos")) - 1;

    var validPositions = [0, 1, 2, 3];

    if (
      !validPositions.includes(XPos) ||
      !validPositions.includes(YPos)) return;

    var tile = new Tile({ x: XPos, y: YPos }, 2)


    this.actuator.addTile(tile, true);
    this.grid.insertTile(tile);
  }.bind(this));




  this.inputManager.on('cell-clicked', function (position) {
    var XPos = parseInt(position[0]);
    var YPos = parseInt(position[1]);
    var tile;

    var tileValue = this.multiplier;


    if (this.grid.cells[XPos][YPos] == null) // If Cell is Empty
    {
      tile = new Tile({ x: XPos, y: YPos }, tileValue);
      this.actuator.addTile(tile, true);
      this.grid.insertTile(tile);
    }
    else {
      tile = this.grid.cells[XPos][YPos].clone();
      tile.value *= 2;
      this.actuator.addTile(tile, true);
      this.grid.insertTile(tile)

    }
  }.bind(this));


  this.inputManager.on('run', function () {
    if (this.running) {
      this.running = false;
      this.actuator.setRunButton('Auto-run');
    } else {
      this.running = true;
      this.run()
      this.actuator.setRunButton('Stop');
    }
  }.bind(this));

  this.inputManager.on('upgradeTile', function (tile) {
    console.log("test");
    this.grid.removeTile(tile);
    tile.value *= 2;
    this.grid.insertTile(tile)

  }.bind(this));

  this.setup();
}

// Restart the game
GameManager.prototype.restart = function () {
  this.actuator.restart();
  this.running = false;
  this.actuator.setRunButton('Auto-run');
  this.setup();

};

// Set up the game
GameManager.prototype.setup = function () {
  this.grid = new Grid(this.size);
  this.grid.addStartTiles();

  this.ai = new AI(this.grid);

  this.score = 0;
  this.over = false;
  this.won = false;

  // Update the actuator
  this.actuate();
};


// Sends the updated grid to the actuator
GameManager.prototype.actuate = function () {
  this.actuator.actuate(this.grid, {
    score: this.score,
    over: this.over,
    won: this.won
  });
};

// makes a given move and updates state
GameManager.prototype.move = function (direction) {
  if (document.getElementById('feedback-container').innerHTML != "Place a tile" || this.running == true) {
    var result = this.grid.move(direction);
    this.score += result.score;
    document.getElementById('feedback-container').innerHTML = "Place a tile"
    if (!result.won) {
      if (result.moved) {
        this.grid.computerMove();
      }
    } else {
      this.won = true;
    }

    //console.log(this.grid.valueSum());

    if (!this.grid.movesAvailable()) {
      this.over = true; // Game over!
    }

    this.actuate();
  }
  else {
    alert("Please ensure you place a tile before moving")
  }
}

// moves continuously until game is over
GameManager.prototype.run = function () {
  this.grid.addRandomTileValue(this.multiplier)
  var best = this.ai.getBest();
  this.move(best.move);
  var timeout = animationDelay;
  if (this.running && !this.over && !this.won) {
    var self = this;
    setTimeout(function () {
      self.run();
    }, timeout);
  }
}

