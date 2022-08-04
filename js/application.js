animationDelay = 200;
minSearchTime = 100;
var manager;

// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
  this.manager = new GameManager(4, KeyboardInputManager, HTMLActuator);
});

function changeMultiplier(element) {
  if (element.className == "active") return;
  else {
    document.querySelector(".active").className = "inactive";
    element.className = "active";
  }

  this.manager.multiplier = parseInt(element.getAttribute('alt'));
  console.log(this.manager.multiplier);
}
