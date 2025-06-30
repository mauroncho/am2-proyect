let faceMesh;
let options = { maxFaces: 1, refineLandmarks: false, flipped: false };
let faces = [];
let face;
let video;

function preload() {
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  video = createCapture(VIDEO);
  video.hide();

  faceMesh.detectStart(video, gotFace);

  textAlign(CENTER);
}

function draw() {
  image(video, 0, 0, width, height);

  let videoW = video.width;
  let videoH = video.height;

  let scaleX = width / videoW;
  let scaleY = height / videoH;

  if (faces.length > 0) {
    face = faces[0];
    let {
      x: ovalX,
      y: ovalY,
      width: ovalWidth,
      height: ovalHeight,
    } = face.faceOval;

    let pixelOval = video.get(ovalX, ovalY, ovalWidth, ovalHeight);
    pixelOval.filter(BLUR, 8);

    let maskImg = createGraphics(ovalWidth, ovalHeight);
    maskImg.noStroke();
    maskImg.fill(255);
    maskImg.ellipse(ovalWidth / 2, ovalHeight / 2, ovalWidth, ovalHeight);

    pixelOval.mask(maskImg);

    image(
      pixelOval,
      ovalX * scaleX,
      ovalY * scaleY,
      ovalWidth * scaleX,
      ovalHeight * scaleY
    );
  }
}

function mousePressed() {
  console.log(face);
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

/**
 * helpers
 */

function gotFace(result) {
  faces = result;
}
