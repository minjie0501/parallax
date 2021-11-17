const layers = document.getElementsByClassName("layer");
const player = document.getElementById("player");

let playerBottom = parseInt(getComputedStyle(player).getPropertyValue("bottom").split("px")[0]);
console.log(playerBottom);

let layer1X = (layer2X = layer3X = layer4X = layer5X = layer6X = 0);
const keys = [];
const tic = 10;
const change = 10;
let playerJump = false;
let playerDescend = false;

const removeKey = (e, arr, arrow) => {
  if (e.key === arrow) {
    var index = arr.indexOf(e.key);
    if (index !== -1) {
      arr.splice(index, 1);
    }
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
  if (keys.includes(" ") && playerBottom <=50 ) {
    playerJump = true;
  }
  if (playerBottom > 200) {
    playerJump = false;
    playerDescend = true;
  }
};

const jump = () => {
  if (playerJump) {
    playerBottom += 5;
    player.style.bottom = playerBottom + "px";
  }else if(playerDescend && playerBottom > 50){
    playerBottom -= 5;
    player.style.bottom = playerBottom + "px";
  }
};

document.body.addEventListener("keydown", (e) => {
  console.log(e.key);
  if (e.key === "ArrowLeft" && !keys.includes("ArrowLeft")) keys.push(e.key);
  if (e.key === "ArrowRight" && !keys.includes("ArrowRight")) keys.push(e.key);
  if (e.key === "ArrowUp" && !keys.includes("ArrowUp")) keys.push(e.key);
  if (e.key === "ArrowDown" && !keys.includes("ArrowDown")) keys.push(e.key);
  if (e.key === "d" && !keys.includes("d")) keys.push(e.key);
  if (e.key === "s" && !keys.includes("s")) keys.push(e.key);
  if (e.key === "h" && !keys.includes("h")) keys.push(e.key);
  if (e.key === " " && !keys.includes(" ")) keys.push(e.key);
  console.log(keys);
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
    layers[0].style.backgroundPositionX = layer1X + "px";
    layers[1].style.backgroundPositionX = layer2X + "px";
    layers[2].style.backgroundPositionX = layer3X + "px";
    layers[3].style.backgroundPositionX = layer4X + "px";
    layers[4].style.backgroundPositionX = layer5X + "px";
    layers[5].style.backgroundPositionX = layer6X + "px";
  }
  if (keys.includes("ArrowRight")) {
    player.style.transform = "scaleX(1)";
    layer6X -= change;
    layer5X -= change * 0.5;
    layer4X -= change * 0.25;
    layer3X -= change * 0.1;
    layer2X -= change * 0.05;
    layer1X -= change * 0.01;
    layers[0].style.backgroundPositionX = layer1X + "px";
    layers[1].style.backgroundPositionX = layer2X + "px";
    layers[2].style.backgroundPositionX = layer3X + "px";
    layers[3].style.backgroundPositionX = layer4X + "px";
    layers[4].style.backgroundPositionX = layer5X + "px";
    layers[5].style.backgroundPositionX = layer6X + "px";
  }
};

const main = () => {
  console.log(keys);
  changeRun();
  moveLayer();
  checkJump();
  jump();
  setTimeout(main, tic);
};

main();
