let faceMesh;
let backSound;
let soundFx;
let options = { maxFaces: 1, refineLandmarks: false, flipped: false };
let faces = [];
let face;
let video;

let maskAlpha = 0;
let soundVol = 0;

function preload() {
  faceMesh = ml5.faceMesh(options);
  soundFx = loadSound("./sound/perverts-sound.mp3");
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  video = createCapture(VIDEO);
  video.hide();
  faceMesh.detectStart(video, gotFace);
  soundFx.loop();
  soundFx.setVolume(0);
}

function draw() {
  image(video, 0, 0, width, height);

  let videoW = video.width;
  let videoH = video.height;
  let scaleX = width / videoW;
  let scaleY = height / videoH;

  // manejo de la opacidad de la máscara
  if (faces.length > 0) {
    maskAlpha = lerp(maskAlpha, 255, 0.009);
    soundVol = lerp(soundVol, 1, 0.02);
  } else {
    maskAlpha = lerp(maskAlpha, 0, 0.05);
    soundVol = lerp(soundVol, 0, 0.025);
  }

  // aplicar volumen suavizado
  soundFx.setVolume(soundVol);

  if (faces.length > 0 && maskAlpha > 1) {
    face = faces[0];
    let {
      x: ovalX,
      y: ovalY,
      width: ovalWidth,
      height: ovalHeight,
    } = face.faceOval;

    let pixelOval = video.get(ovalX, ovalY, ovalWidth, ovalHeight);
    pixelOval.filter(BLUR, 5);
    pixelOval.filter(POSTERIZE);

    // creación de máscara
    let maskImg = createGraphics(ovalWidth, ovalHeight);
    maskImg.ellipse(ovalWidth / 2, ovalHeight / 2, ovalWidth, ovalHeight);
    pixelOval.mask(maskImg);

    push();
    tint(255, maskAlpha);
    image(
      pixelOval,
      ovalX * scaleX,
      ovalY * scaleY,
      ovalWidth * scaleX,
      ovalHeight * scaleY
    );
    pop();
  }
}

function mousePressed() {
  console.log(face);
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function gotFace(result) {
  faces = result;
}
