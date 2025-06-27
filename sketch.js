let faceMesh;
let options = { maxFaces: 1, refineLandmarks: false, flipped: false };

function preload() {
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}
