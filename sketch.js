let faceMesh;
let pervert_fx;
let noise_sfx;
let rough_sfx;
let options = { maxFaces: 1, refineLandmarks: false, flipped: false };
let faces = [];
let face;
let video;
let storedFaces = [];
let hadFace = false;

let maskAlpha = 0;
let soundVol = 0;

//efectos
let effectModes = ["blur", "noise", "storedFace"];
let effectIndex = 0;
let effectMode = effectModes[effectIndex];

function preload() {
  faceMesh = ml5.faceMesh(options);
  pervert_fx = loadSound("./sound/pervert.mp3");
  noise_sfx = loadSound("./sound/white_noise.mp3");
  rough_sfx = loadSound("./sound/rough.mp3");
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  video = createCapture(VIDEO);
  video.hide();
  faceMesh.detectStart(video, gotFace);

  pervert_fx.loop();
  pervert_fx.setVolume(0);
}

function draw() {
  image(video, 0, 0, width, height);

  let videoW = video.width;
  let videoH = video.height;
  let scaleX = width / videoW;
  let scaleY = height / videoH;

  //manejo de opacidad y volumen
  if (faces.length > 0) {
    maskAlpha = lerp(maskAlpha, 255, 0.009);
    soundVol = lerp(soundVol, 1, 0.02);
  } else {
    maskAlpha = lerp(maskAlpha, 0, 0.05);
    soundVol = lerp(soundVol, 0, 0.025);
  }

  //setear volumen al sonido actual
  if (effectMode === "blur") {
    pervert_fx.setVolume(soundVol);
  } else if (effectMode === "noise") {
    noise_sfx.setVolume(soundVol);
  } else if (effectMode === "storedFace") {
    rough_sfx.setVolume(soundVol);
  }

  if (faces.length > 0 && maskAlpha > 1) {
    face = faces[0];
    let {
      x: ovalX,
      y: ovalY,
      width: ovalWidth,
      height: ovalHeight,
    } = face.faceOval;

    //recorte actual de la cara
    let pixelOval = video.get(ovalX, ovalY, ovalWidth, ovalHeight);

    if (!hadFace) {
      storedFaces.push(pixelOval.get());
      if (storedFaces.length > 5) {
        storedFaces.shift();
      }
      // console.log("nueva cara guardada. total:", storedFaces.length);

      //reiniciar a blur
      effectMode = "blur";
      effectIndex = 0;
      playSoundForMode(effectMode);
    }
    hadFace = true;

    //aplicar efectos
    if (effectMode === "blur") {
      pixelOval.filter(BLUR, 5);
      pixelOval.filter(POSTERIZE);

      let maskImg = createGraphics(ovalWidth, ovalHeight);
      maskImg.ellipse(ovalWidth / 2, ovalHeight / 2, ovalWidth, ovalHeight);
      pixelOval.mask(maskImg);
    } else if (effectMode === "noise") {
      pixelOval.loadPixels();
      for (let i = 0; i < pixelOval.pixels.length; i += 4) {
        let v = random(255);
        pixelOval.pixels[i] = v;
        pixelOval.pixels[i + 1] = v;
        pixelOval.pixels[i + 2] = v;
        pixelOval.pixels[i + 3] = 255;
      }
      pixelOval.updatePixels();

      let maskImg = createGraphics(ovalWidth, ovalHeight);
      maskImg.ellipse(ovalWidth / 2, ovalHeight / 2, ovalWidth, ovalHeight);
      pixelOval.mask(maskImg);
    } else if (effectMode === "storedFace" && storedFaces.length > 0) {
      let randomFace = random(storedFaces);
      pixelOval = randomFace.get();

      let maskImg = createGraphics(ovalWidth, ovalHeight);
      maskImg.ellipse(ovalWidth / 2, ovalHeight / 2, ovalWidth, ovalHeight);
      pixelOval.mask(maskImg);
    }

    push();
    if (effectMode === "noise") {
      tint(255, 255);
    } else {
      tint(255, maskAlpha);
    }
    image(
      pixelOval,
      ovalX * scaleX,
      ovalY * scaleY,
      ovalWidth * scaleX,
      ovalHeight * scaleY
    );
    pop();
  } else {
    hadFace = false;
  }
}

//funciones auxiliares
function keyPressed() {
  if (key === " ") {
    effectIndex = (effectIndex + 1) % effectModes.length;
    effectMode = effectModes[effectIndex];
    // console.log("modo:", effectMode);
    playSoundForMode(effectMode);
  }
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function gotFace(result) {
  faces = result;
}

function stopAllSounds() {
  pervert_fx.stop();
  noise_sfx.stop();
  rough_sfx.stop();
}

function playSoundForMode(mode) {
  stopAllSounds();
  if (mode === "blur") {
    pervert_fx.loop();
    pervert_fx.setVolume(soundVol);
  } else if (mode === "noise") {
    noise_sfx.loop();
    noise_sfx.setVolume(soundVol);
  } else if (mode === "storedFace") {
    rough_sfx.loop();
    rough_sfx.setVolume(soundVol);
  }
}
