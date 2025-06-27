/**
 * faceMesh variables
 */
let faceMesh;
let options = { maxFaces: 1, refineLandmarks: false, flipped: false };

/**
 * variables
 */
let video;

function preload() {
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  createCanvas(700, 500, WEBGL);
  video = createCapture(VIDEO);
}

function draw() {
  translate(-(width / 2), -(height / 2));
  background(220);
  fill(255, 0, 0);
  circle(0, 0, 20);
}
