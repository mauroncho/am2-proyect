/**
 * faceMesh variables
 */
let faceMesh;
let options = { maxFaces: 1, refineLandmarks: false, flipped: false };
let face = [];

/**
 * variables
 */
let video;

function preload() {
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  createCanvas(700, 500);
  video = createCapture(VIDEO);
  video.hide();

  faceMesh.detectStart(video, gotFace);
}

function draw() {
  // translate(-(width / 2), -(height / 2));
  background(220);
  fill(255, 0, 0);
  circle(0, 0, 20);
}

/**
 * aditional functions
 */

function gotFace(result) {
  face = result;
  console.log(face);
}
