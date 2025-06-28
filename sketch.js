/**
 * faceMesh variables
 */

let faceMesh;
let options = { maxFaces: 1, refineLandmarks: false, flipped: false };
let faces = [];
let face;
let faceDetected = 0;

/**
 * variables
 */

let video;
2;
let ms;

function preload() {
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  createCanvas(700, 500);
  video = createCapture(VIDEO);
  video.hide();

  faceMesh.detectStart(video, gotFace);

  textAlign(CENTER);
}

function draw() {
  ms = millis();

  image(video, 0, 0, width, height);

  if (faces.length > 0) {
    face = faces[0];
    let box = face.box;
    if (faceDetected === 0) faceDetected = ms;
    console.log(faceDetected);
    push();
    noFill();
    strokeWeight(2);
    rect(box.xMin + 30, box.yMin + 10, box.width, box.height);
    pop();
    if (ms - faceDetected > 1500) {
      push();
      fill(0);
      textSize(40);
      text("HUMAN DETECTED", width * 0.5, height * 0.1);
      pop();
    }
  } else {
    faceDetected = 0;
  }
}

function mousePressed() {
  console.log(face);
}

/**
 * aditional functions
 */

function gotFace(result) {
  faces = result;
}
