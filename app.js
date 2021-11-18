const layers = document.getElementsByClassName("layer");
const player = document.getElementById("player");
const playerHitbox = document.getElementById("player-hitbox");
const scoreDisplay = document.getElementById("score");
const newGameDiv = document.getElementById("new-game");
const newGameBtn = document.getElementById("btn-new-game");
// const obstacle = document.getElementById("obstacle");

let playerBottom = parseInt(getComputedStyle(player).getPropertyValue("bottom").split("px")[0]);
let playerHitboxBottom = parseInt(getComputedStyle(playerHitbox).getPropertyValue("bottom").split("px")[0]);
let playerHitboxWidth = parseInt(getComputedStyle(playerHitbox).getPropertyValue("width").split("px")[0]);
// let obstaclePos = parseInt(getComputedStyle(obstacle).getPropertyValue("left").split("px")[0]);

const playerHitboxCss = getComputedStyle(playerHitbox);
// const obstacleHitboxCss = getComputedStyle(obstacle);
////Default values
const layerOneStartingPos = layers[0].style.backgroundPositionX;
const layerTwoStartingPos = layers[1].style.backgroundPositionX;
const layerThreeStartingPos = layers[2].style.backgroundPositionX;
const layerFourStartingPos = layers[3].style.backgroundPositionX;
const layerFiveStartingPos = layers[4].style.backgroundPositionX;
const layerSixStartingPos = layers[5].style.backgroundPositionX;
let obstacleStartingPos;


let layer1X = (layer2X = layer3X = layer4X = layer5X = layer6X = 0);
const keys = [];
const tic = 10;
const change = 20;
const obstacleChange = 10;
const playerHeight = 250;
let obstacleWidth;
let score = 0;
let addScoreCheck = true;
let playerJump = false;
let obstacle;
let obstaclePos;
let obstacleHitboxCss;
let rotateDeg = -10;
let dead = false;
const possibleObstacleSizes = [50, 60, 70, 80,  90];

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
    let obstacleSize = possibleObstacleSizes[Math.floor(Math.random() * 4) + 1];
    const newDiv = document.createElement("div");
    newDiv.setAttribute("id", "obstacle");
    newDiv.classList.add("obstacle");
    insertAfter(playerHitbox, newDiv);
    obstacle = document.getElementById("obstacle");
    obstacle.style.width = `${obstacleSize}px`;
    obstacle.style.height = `${obstacleSize}px`;
    obstacle.style.backgroundSize = `${obstacleSize}px`;
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

const handleScore = (elm1, elm2) => {
  let elm1Rect = elm1.getBoundingClientRect();
  let elm2Rect = elm2.getBoundingClientRect();
  if (elm1Rect.right > elm2Rect.right + playerHitboxWidth && addScoreCheck) {
    score++;
    console.log(score);
    scoreDisplay.innerHTML = `Score: ${score}`;
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
  if (
    (keys.includes("ArrowLeft") || keys.includes("ArrowRight")) &&
    !(keys.includes("ArrowLeft") && keys.includes("ArrowRight"))
  ) {
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
  scoreDisplay.innerHTML = `Score: ${score}`;
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

const moveLayer = () => {
  if (keys.includes("ArrowLeft")) {
    player.style.transform = "scaleX(-1)";
    layer6X += change;
    layer5X += change * 0.5;
    layer4X += change * 0.25;
    layer3X += change * 0.1;
    layer2X += change * 0.05;
    layer1X += change * 0.01;
    obstaclePos += obstacleChange;
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
    obstaclePos -= obstacleChange;
    layers[0].style.backgroundPositionX = layer1X + "px";
    layers[1].style.backgroundPositionX = layer2X + "px";
    layers[2].style.backgroundPositionX = layer3X + "px";
    layers[3].style.backgroundPositionX = layer4X + "px";
    layers[4].style.backgroundPositionX = layer5X + "px";
    layers[5].style.backgroundPositionX = layer6X + "px";
    console.log(layer6X)
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



// NOTE: gotta change rock hitbox
const main = () => {
  createObstacle();
  checkCollision(playerHitbox, obstacle);
  console.log('asd')
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
    player.style.width = "300px";
    player.style.backgroundPositionX = "5px";
    player.style.zIndex = "2";
    player.style.backgroundImage = "url('img/dead.gif')";
    newGame();
    setTimeout(main, tic);
  }
  // console.log(keys);
  // console.log("obstacle left: "  + getComputedStyle(obstacle).getPropertyValue("left"))
  // console.log("player right: "  + getComputedStyle(playerHitbox).getPropertyValue("right"))
};

main();
