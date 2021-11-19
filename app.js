const layers = document.getElementsByClassName("layer");
const player = document.getElementById("player");
const playerHitbox = document.getElementById("player-hitbox");
const scoreDisplay = document.getElementById("score");
const levelDisplay = document.getElementById("level");
const newGameDiv = document.getElementById("new-game");
const newGameBtn = document.getElementById("btn-new-game");
const stopText = document.getElementById("stop");
const countDown = document.getElementById("countdown");

let playerBottom = parseInt(getComputedStyle(player).getPropertyValue("bottom").split("px")[0]);
let playerHitboxBottom = parseInt(getComputedStyle(playerHitbox).getPropertyValue("bottom").split("px")[0]);
let playerHitboxWidth = parseInt(getComputedStyle(playerHitbox).getPropertyValue("width").split("px")[0]);
const playerHitboxCss = getComputedStyle(playerHitbox);

let layer1X = { val: 0 },
  layer2X = { val: 0 },
  layer3X = { val: 0 },
  layer4X = { val: 0 },
  layer5X = { val: 0 },
  layer6X = { val: 0 };
const changeMultiplier = [0.01, 0.05, 0.1, 0.25, 0.5, 1];
const layersChangeArr = [layer1X, layer2X, layer3X, layer4X, layer5X, layer6X];
const keys = [];
const tic = 10;
const change = 20;
let obstacleChange = 10;
const obstacleSpeedChange = 5;
const playerHeight = 250;
let score = (speedLvl = prevSpeedLvl = 0);
let lvl = 1;
let addScoreCheck = true;
let playerJump = false;
let obstacle, obstaclePos, obstacleHitboxCss, obstacleStartingPos, obstacleWidth;
let rotateDeg = -10;
let dead = false;
const possibleObstacleSizes = [50, 60, 70, 80, 90, 100];

function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function resetGif(id) {
  var img = document.getElementById(id);
  var imageUrl = img.src;
  img.src = "";
  img.src = imageUrl;
}

const createObstacle = () => {
  if (document.getElementById("obstacle") == null) {
    let obstacleSize = possibleObstacleSizes[lvl > 5 ? possibleObstacleSizes.length - 1 : lvl - 1];
    const newDiv = document.createElement("div");
    const obstaclePic = document.createElement("img");
    obstaclePic.src = "img/rock1.png";
    obstaclePic.style.width = `${obstacleSize + 30}px`;
    obstaclePic.style.height = `${obstacleSize + 30}px`;
    newDiv.setAttribute("id", "obstacle");
    newDiv.classList.add("obstacle");
    newDiv.appendChild(obstaclePic);

    insertAfter(playerHitbox, newDiv);
    obstacle = document.getElementById("obstacle");
    obstacle.style.width = `${obstacleSize}px`;
    obstacle.style.height = `${obstacleSize}px`;
    obstaclePos = parseInt(getComputedStyle(obstacle).getPropertyValue("left").split("px")[0]);
    obstacleHitboxCss = getComputedStyle(obstacle);
    addScoreCheck = true;
    obstacleStartingPos = obstacle.style.left;
    obstacleWidth = parseInt(getComputedStyle(obstacle).getPropertyValue("width").split("px")[0]);
  }
};

const removeObstacle = () => {
  if (obstacle.offsetLeft + obstacleWidth < 0 || dead) {
    document.getElementById("obstacle").remove();
    rotateDeg = -10;
  }
};

////
let initial = 5000;
let count = initial;
let counter; //10 will  run it every 100th of a second
let initialMillis;

function timer() {
  if (count <= 0) {
    clearInterval(counter);
    return;
  }
  let current = Date.now();

  count = count - (current - initialMillis);
  initialMillis = current;
  displayCount(count);
}

function displayCount(count) {
  let res = count / 1000;
  if (parseFloat(res.toFixed(2)) <= 0) {
    dead = true;
  }
  document.getElementById("countdown").innerHTML = res.toFixed(2);
}

displayCount(initial);
/////

const handleScore = (elm1, elm2) => {
  let elm1Rect = elm1.getBoundingClientRect();
  let elm2Rect = elm2.getBoundingClientRect();
  if (elm1Rect.right > elm2Rect.right + playerHitboxWidth && addScoreCheck) {
    score++;
    if (score % 3 == 0) {
      //every 3 score lvl increases by 1
      lvl++;
    }
    if (score % 6 == 0) {
      //every second lvl obstacleSpeed increases
      speedLvl++;
    }
    scoreDisplay.innerHTML = `Score: ${score}`;
    levelDisplay.innerHTML = `Level: ${lvl}`;
    addScoreCheck = false;
  }
};

const removeKey = (e, arr, arrow) => {
  if (e.key === arrow) {
    var index = arr.indexOf(e.key);
    if (index !== -1) {
      arr.splice(index, 1);
    }
  }
};

const rotateRock = () => {
  obstacle.style.transform = `rotate(${rotateDeg}deg)`;
  rotateDeg -= 10;
};

const stopPulse = () => {
  if (!dead) {
    if (keys.includes("ArrowLeft") && !keys.includes("ArrowRight")) {
      clearInterval(counter);
      initialMillis = Date.now();
      counter = setInterval(timer, 1);
      countDown.style.opacity = 1;

      if (getComputedStyle(stopText).getPropertyValue("opacity") == "0") {
        stopText.style.opacity = 0.25;
      } else if (getComputedStyle(stopText).getPropertyValue("opacity") == "0.25") {
        stopText.style.opacity = 0.5;
      } else if (getComputedStyle(stopText).getPropertyValue("opacity") == "0.5") {
        stopText.style.opacity = 0.75;
      } else if (getComputedStyle(stopText).getPropertyValue("opacity") == "0.75") {
        stopText.style.opacity = 1;
      } else {
        stopText.style.opacity = 0;
      }
    } else {
      clearInterval(counter);
      stopText.style.opacity = 0;
      countDown.style.opacity = 0;
    }
  }

  setTimeout(stopPulse, 100);
};

stopPulse();

const checkCollision = (elm1, elm2) => {
  let elm1Rect = elm1.getBoundingClientRect();
  let elm2Rect = elm2.getBoundingClientRect();

  if (
    elm1Rect.right >= elm2Rect.left &&
    elm1Rect.left <= elm2Rect.right &&
    elm1Rect.bottom >= elm2Rect.top &&
    elm1Rect.top <= elm2Rect.bottom
  ) {
    dead = true;
  }
};

const changeRun = () => {
  if ((keys.includes("ArrowLeft") || keys.includes("ArrowRight")) && !(keys.includes("ArrowLeft") && keys.includes("ArrowRight"))) {
    player.style.backgroundImage = "url('img/run.gif')";
  } else {
    player.style.backgroundImage = "url('img/idle.gif')";
  }
};

const checkJump = () => {
  if (keys.includes(" ") && playerBottom <= 50) {
    playerJump = true;
  }
  if (playerBottom > playerHeight) {
    playerJump = false;
  }
};

const jump = () => {
  if (playerJump) {
    playerBottom += 10;
    playerHitboxBottom += 10;
    player.style.bottom = playerBottom + "px";
    playerHitbox.style.bottom = playerHitboxBottom + "px";
  } else if (playerBottom > 50) {
    playerBottom -= 10;
    playerHitboxBottom -= 10;
    player.style.bottom = playerBottom + "px";
    playerHitbox.style.bottom = playerHitboxBottom + "px";
  }
};

const jumpAnimation = () => {
  if (playerBottom > 50 && playerBottom < playerHeight) {
    player.style.backgroundImage = "url('img/jump.gif')";
  }
};

const newGame = () => {
  if (dead) {
    newGameDiv.style.display = "block";
  }
};

document.body.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && !keys.includes("ArrowLeft")) keys.push(e.key);
  if (e.key === "ArrowRight" && !keys.includes("ArrowRight")) keys.push(e.key);
  if (e.key === " " && !keys.includes(" ")) keys.push(e.key);
});

document.body.addEventListener("keyup", (e) => {
  removeKey(e, keys, "ArrowLeft");
  removeKey(e, keys, "ArrowRight");
  removeKey(e, keys, " ");
});

newGameBtn.addEventListener("click", () => {
  removeObstacle();
  dead = false;
  score = 0;
  lvl = 1;
  speedLvl = 0;
  prevSpeedLvl = 0;
  obstacleChange = 10;
  initial = 5000;
  count = initial;

  for (let i = 0; i < changeMultiplier.length; i++) {
    layersChangeArr[i].val = 0; // reset layer changer values to 0
  }

  scoreDisplay.innerHTML = `Score: ${score}`;
  levelDisplay.innerHTML = `Level: ${lvl}`;
  player.style.transform = "scaleX(1)";
  for (let j = 0; j < layers.length; j++) {
    layers[j].style.backgroundPositionX = "0px";
  }

  obstacle.style.left = obstacleStartingPos;
  layer1X = layer2X = layer3X = layer4X = layer5X = layer6X = 0;
  obstaclePos = 0;
  newGameDiv.style.display = "none";
  player.style.width = "210px";
  player.style.backgroundPositionX = "40px";
  reset = true;
});

const moveLayer = () => {
  if (keys.includes("ArrowLeft")) {
    player.style.transform = "scaleX(-1)";

    for (let i = 0; i < changeMultiplier.length; i++) {
      layersChangeArr[i].val += change * changeMultiplier[i]; //change position for each layer
      layers[i].style.backgroundPositionX = layersChangeArr[i].val + "px";
    }

    obstaclePos += obstacleChange;
    obstacle.style.left = obstaclePos + "px";
  }
  if (keys.includes("ArrowRight")) {
    player.style.transform = "scaleX(1)";

    if (prevSpeedLvl != speedLvl) {
      obstacleChange += obstacleSpeedChange;
      prevSpeedLvl = speedLvl;
    }

    for (let i = 0; i < changeMultiplier.length; i++) {
      layersChangeArr[i].val -= change * changeMultiplier[i]; //change position for each layer
      layers[i].style.backgroundPositionX = layersChangeArr[i].val + "px";
    }

    obstaclePos -= obstacleChange;
    obstacle.style.left = obstaclePos + "px";
  }
};

const moveRock = () => {
  if (keys.length == 0 && !dead) {
    obstaclePos -= obstacleChange - 5;
    obstacle.style.left = obstaclePos + "px";
  }
};

// this is just for resetting the dying gif, pretty bad but idk how to do it better
let reset = true;
const checkIfDeadGif = () => {
  if (dead && reset) {
    resetGif("img3");
    reset = false;
  }
  setTimeout(checkIfDeadGif, 10);
};
checkIfDeadGif();

const main = () => {
  createObstacle();
  checkCollision(playerHitbox, obstacle);
  moveRock();
  if (!dead) {
    changeRun();
    moveLayer();
    checkJump();
    jump();
    removeObstacle();
    handleScore(playerHitbox, obstacle);
    createObstacle();
    jumpAnimation(); // NOTE: this is kinda shit but its alright
    setTimeout(rotateRock, tic);
    setTimeout(main, tic);
  } else {
    countDown.style.opacity = 0;
    player.style.width = "300px";
    player.style.backgroundPositionX = "5px";
    player.style.zIndex = "2";
    player.style.backgroundImage = "url('img/dead.gif')";
    newGame();
    setTimeout(main, tic);
  }
};

main();
