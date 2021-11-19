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
////Default values
const layerOneStartingPos = layers[0].style.backgroundPositionX;
const layerTwoStartingPos = layers[1].style.backgroundPositionX;
const layerThreeStartingPos = layers[2].style.backgroundPositionX;
const layerFourStartingPos = layers[3].style.backgroundPositionX;
const layerFiveStartingPos = parseInt(getComputedStyle(layers[4]).getPropertyValue("background-position-x").split("px")[0])
const layerSixStartingPos = layers[5].style.backgroundPositionX;
console.log(layerFiveStartingPos)
let obstacleStartingPos;

let layer1X = (layer2X = layer3X = layer4X = layer5X = layer6X = 0);
const keys = [];
const tic = 10;
const change = 20;
let obstacleChange = 10;
const obstacleSpeedChange = 5;
const playerHeight = 250;
let obstacleWidth;
let score = 0;
let lvl = 1;
let speedLvl = 0;
let prevSpeedLvl = 0;
let addScoreCheck = true;
let playerJump = false;
let obstacle;
let obstaclePos;
let obstacleHitboxCss;
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
  if (parseFloat(res.toPrecision(count.toString().length)) < 0) {
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

/*
const clash = () => {
  let obstacleLeft = parseInt(obstacleHitboxCss.getPropertyValue("left").split("px")[0]);
  let playerHitboxLeft = parseInt(playerHitboxCss.getPropertyValue("left").split("px")[0]);
  let playerHitboxWidth = parseInt(playerHitboxCss.getPropertyValue("width").split("px")[0]);
  let obstacleBottom = parseInt(obstacleHitboxCss.getPropertyValue("bottom").split("px")[0]);
  let playerHitboxBottom= parseInt(playerHitboxCss.getPropertyValue("bottom").split("px")[0]);
  let obstacleHeight = parseInt(obstacleHitboxCss.getPropertyValue("height").split("px")[0]);
  let let obstacleWidth = parseInt(obstacleHitboxCss.getPropertyValue("width").split("px")[0]);
  // NOTE: this works but copied a nicer solution

  if (obstacleLeft - playerHitboxLeft <= playerHitboxWidth
     && (playerHitboxBottom<(obstacleBottom+obstacleHeight))
      && !(playerHitboxLeft-obstacleLeft > let obstacleWidth)) {
    console.log("you ded");
  }
};*/

document.body.addEventListener("keydown", (e) => {
  // console.log(e.key);
  if (e.key === "ArrowLeft" && !keys.includes("ArrowLeft")) keys.push(e.key);
  if (e.key === "ArrowRight" && !keys.includes("ArrowRight")) keys.push(e.key);
  if (e.key === "ArrowUp" && !keys.includes("ArrowUp")) keys.push(e.key);
  if (e.key === "ArrowDown" && !keys.includes("ArrowDown")) keys.push(e.key);
  if (e.key === "d" && !keys.includes("d")) keys.push(e.key);
  if (e.key === "s" && !keys.includes("s")) keys.push(e.key);
  if (e.key === "h" && !keys.includes("h")) keys.push(e.key);
  if (e.key === " " && !keys.includes(" ")) keys.push(e.key);
  // console.log(keys);
});

document.body.addEventListener("keyup", (e) => {
  removeKey(e, keys, "ArrowLeft");
  removeKey(e, keys, "ArrowRight");
  removeKey(e, keys, "ArrowUp");
  removeKey(e, keys, "ArrowDown");
  removeKey(e, keys, "d");
  removeKey(e, keys, "s");
  removeKey(e, keys, "h");
  removeKey(e, keys, " ");
});

newGameBtn.addEventListener("click", () => {
  //might just refresh the page
  removeObstacle();
  dead = false;
  score = 0;
  lvl = 1;
  speedLvl = 0;
  prevSpeedLvl = 0;
  obstacleChange = 10;
  initial = 5000;
  count = initial;
  scoreDisplay.innerHTML = `Score: ${score}`;
  levelDisplay.innerHTML = `Level: ${lvl}`;
  player.style.transform = "scaleX(1)";
  layers[0].style.backgroundPositionX = layerOneStartingPos;
  layers[1].style.backgroundPositionX = layerTwoStartingPos;
  layers[2].style.backgroundPositionX = layerThreeStartingPos;
  layers[3].style.backgroundPositionX = layerFourStartingPos;
  layers[4].style.backgroundPositionX = layerFiveStartingPos;
  layers[5].style.backgroundPositionX = layerSixStartingPos;
  obstacle.style.left = obstacleStartingPos;
  layer1X = layer2X = layer3X = layer4X = layer5X = layer6X = 0;
  obstaclePos = 0;
  newGameDiv.style.display = "none";
  player.style.width = "210px";
  player.style.backgroundPositionX = "40px";
  reset = true;
});

const changeMultiplier = [0.01, 0.05, 0.1, 0.25, 0.5, 1];
const layersChangeArr = [layer1X, layer2X, layer3X, layer4X, layer5X, layer6X];

const moveLayer = () => {
  if (keys.includes("ArrowLeft")) {
    player.style.transform = "scaleX(-1)";

    // for (let i = 4; i < changeMultiplier.length-1; i++) {
    //   layersChangeArr[i] += change * changeMultiplier[i];
    //   console.log(layersChangeArr[i]);  // NOTE: to not have hardcoded each layerX change but it has a bug when using it after dying jumps back to previous position
    //   layers[i].style.backgroundPositionX = layersChangeArr[i] + "px";
    // }
    layer6X += change;
    layer5X += change * 0.5;
    layer4X += change * 0.25;
    layer3X += change * 0.1;
    layer2X += change * 0.05;
    layer1X += change * 0.01;

    obstaclePos += obstacleChange
    layers[0].style.backgroundPositionX = layer1X + "px";
    layers[1].style.backgroundPositionX = layer2X + "px";
    layers[2].style.backgroundPositionX = layer3X + "px";
    layers[3].style.backgroundPositionX = layer4X + "px";
    layers[4].style.backgroundPositionX = layer5X + "px";
    layers[5].style.backgroundPositionX = layer6X + "px";
    obstacle.style.left = obstaclePos + "px";
  }
  if (keys.includes("ArrowRight")) {
    player.style.transform = "scaleX(1)";
    layer6X -= change;
    layer5X -= change * 0.5;
    layer4X -= change * 0.25;
    layer3X -= change * 0.1;
    layer2X -= change * 0.05;
    layer1X -= change * 0.01;

    if (prevSpeedLvl != speedLvl) {
      obstacleChange += obstacleSpeedChange;
      prevSpeedLvl = speedLvl;
    }

    obstaclePos -= obstacleChange;

    // for (let i = 0; i < changeMultiplier.length; i++) {
    //   layersChangeArr[i]-=change*changeMultiplier[i] // NOTE: to not have hardcoded each layerX change but it has a bug when using it after dying jumps back to previous position
    //   layers[i].style.backgroundPositionX = layersChangeArr[i] + "px";
    // }

    layers[0].style.backgroundPositionX = layer1X + "px";
    layers[1].style.backgroundPositionX = layer2X + "px";
    layers[2].style.backgroundPositionX = layer3X + "px";
    layers[3].style.backgroundPositionX = layer4X + "px";
    layers[4].style.backgroundPositionX = layer5X + "px";
    layers[5].style.backgroundPositionX = layer6X + "px";
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
  console.log(dead);
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
