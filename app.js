const layers = document.getElementsByClassName("layer");
const player = document.getElementById("player");
const playerHitbox = document.getElementById("player-hitbox");
// const obstacle = document.getElementById("obstacle");

let playerBottom = parseInt(getComputedStyle(player).getPropertyValue("bottom").split("px")[0]);
let playerHitboxBottom = parseInt(getComputedStyle(playerHitbox).getPropertyValue("bottom").split("px")[0]);
let playerHitboxWidth = parseInt(getComputedStyle(playerHitbox).getPropertyValue("width").split("px")[0]);
// let obstaclePos = parseInt(getComputedStyle(obstacle).getPropertyValue("left").split("px")[0]);

const playerHitboxCss = getComputedStyle(playerHitbox);
// const obstacleHitboxCss = getComputedStyle(obstacle);

let layer1X = (layer2X = layer3X = layer4X = layer5X = layer6X = 0);
const keys = [];
const tic = 10;
const change = 10;
const obstacleChange = 5;
const playerHeight = 250;
obstacleWidth = 80;
let score = 0;
let playerJump = false;
let obstacle;
let obstaclePos;
let obstacleHitboxCss;

function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

const createObstacle = () => {
  if (document.getElementById("obstacle") == null) {
    const newDiv = document.createElement("div");
    newDiv.setAttribute("id", "obstacle");
    newDiv.classList.add("obstacle");
    insertAfter(playerHitbox, newDiv);
    obstacle = document.getElementById("obstacle");
    obstaclePos = parseInt(getComputedStyle(obstacle).getPropertyValue("left").split("px")[0]);
    obstacleHitboxCss = getComputedStyle(obstacle);
  }
};

const removeObstacle = () => {
  if (obstacle.offsetLeft + obstacleWidth < 0) {
    document.getElementById("obstacle").remove();
  }
};

const handleScore = (elm1, elm2) => {
  let elm1Rect = elm1.getBoundingClientRect();
  let elm2Rect = elm2.getBoundingClientRect();
  if(elm1Rect.right>elm2Rect.right+playerHitboxWidth){
    console.log('plus score')
  }

  console.log("player", elm1Rect.right)
  console.log("obstacle", elm2Rect.right)
};

const removeKey = (e, arr, arrow) => {
  if (e.key === arrow) {
    var index = arr.indexOf(e.key);
    if (index !== -1) {
      arr.splice(index, 1);
    }
  }
};

const checkCollision = (elm1, elm2) => {
  let elm1Rect = elm1.getBoundingClientRect();
  let elm2Rect = elm2.getBoundingClientRect();

  return (
    elm1Rect.right >= elm2Rect.left &&
    elm1Rect.left <= elm2Rect.right &&
    elm1Rect.bottom >= elm2Rect.top &&
    elm1Rect.top <= elm2Rect.bottom
  );
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
    playerBottom += 5;
    playerHitboxBottom += 5;
    player.style.bottom = playerBottom + "px";
    playerHitbox.style.bottom = playerHitboxBottom + "px";
  } else if (playerBottom > 50) {
    playerBottom -= 5;
    playerHitboxBottom -= 5;
    player.style.bottom = playerBottom + "px";
    playerHitbox.style.bottom = playerHitboxBottom + "px";
  }
};

const jumpAnimation = () => {
  if (playerBottom > 50 && playerBottom < playerHeight) {
    player.style.backgroundImage = "url('img/jump.gif')";
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
  let obstacleWidth = parseInt(obstacleHitboxCss.getPropertyValue("width").split("px")[0]);
  // NOTE: this works but copied a nicer solution

  if (obstacleLeft - playerHitboxLeft <= playerHitboxWidth
     && (playerHitboxBottom<(obstacleBottom+obstacleHeight))
      && !(playerHitboxLeft-obstacleLeft > obstacleWidth)) {
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
    obstacle.style.left = obstaclePos + "px";
  }
};

const main = () => {
  // console.log(keys);
  // console.log("obstacle left: "  + getComputedStyle(obstacle).getPropertyValue("left"))
  // console.log("player right: "  + getComputedStyle(playerHitbox).getPropertyValue("right"))
  createObstacle();
  changeRun();
  moveLayer();
  checkJump();
  jump();
  removeObstacle();
  handleScore(playerHitbox, obstacle);
  // clash();
  createObstacle();
  console.log(checkCollision(playerHitbox, obstacle));
  jumpAnimation(); // NOTE: this is kinda shit but its alright
  setTimeout(main, tic);
};

main();
