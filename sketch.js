let faceMesh;
let soundFx;
let options = { maxFaces: 1, refineLandmarks: false, flipped: false };
let faces = [];
let face;
let video;

let maskAlpha = 0;
let soundVol = 0;

// modos de efecto
let effectModes = ["blur", "noise", "storedFace", "whiteSquare"];
let effectIndex = 0;
let effectMode = effectModes[effectIndex];

// caras guardadas
let storedFaces = [];
let hadFace = false; // bandera para detectar aparición nueva

function preload() {
  faceMesh = ml5.faceMesh(options);
  soundFx = loadSound("./sound/sound.mp3");
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

  // manejo de opacidad y volumen
  if (faces.length > 0) {
    maskAlpha = lerp(maskAlpha, 255, 0.009);
    soundVol = lerp(soundVol, 1, 0.02);
  } else {
    maskAlpha = lerp(maskAlpha, 0, 0.05);
    soundVol = lerp(soundVol, 0, 0.025);
  }
  soundFx.setVolume(soundVol);

  if (faces.length > 0 && maskAlpha > 1) {
    face = faces[0];
    let {
      x: ovalX,
      y: ovalY,
      width: ovalWidth,
      height: ovalHeight,
    } = face.faceOval;

    // recorte actual de la cara
    let pixelOval = video.get(ovalX, ovalY, ovalWidth, ovalHeight);

    // --- detectar aparición de nueva cara ---
    if (!hadFace) {
      // guardar esta cara
      storedFaces.push(pixelOval.get());
      if (storedFaces.length > 5) {
        storedFaces.shift(); // mantener máximo de 5
      }
      console.log("Nueva cara guardada. Total:", storedFaces.length);

      // reiniciar a blur
      effectMode = "blur";
      effectIndex = 0;
    }
    hadFace = true;

    // --- aplicar efecto según el modo ---
    if (effectMode === "blur") {
      pixelOval.filter(BLUR, 5);
      pixelOval.filter(POSTERIZE);

      // aplicar máscara
      let maskImg = createGraphics(ovalWidth, ovalHeight);
      maskImg.ellipse(ovalWidth / 2, ovalHeight / 2, ovalWidth, ovalHeight);
      pixelOval.mask(maskImg);
    } else if (effectMode === "noise") {
      // glitch: ruido blanco brusco
      pixelOval.loadPixels();
      for (let i = 0; i < pixelOval.pixels.length; i += 4) {
        let v = random(255);
        pixelOval.pixels[i] = v;
        pixelOval.pixels[i + 1] = v;
        pixelOval.pixels[i + 2] = v;
        pixelOval.pixels[i + 3] = 255;
      }
      pixelOval.updatePixels();

      // aplicar máscara
      let maskImg = createGraphics(ovalWidth, ovalHeight);
      maskImg.ellipse(ovalWidth / 2, ovalHeight / 2, ovalWidth, ovalHeight);
      pixelOval.mask(maskImg);
    } else if (effectMode === "storedFace" && storedFaces.length > 0) {
      // cara random del array
      let randomFace = random(storedFaces);
      pixelOval = randomFace.get();

      // aplicar máscara
      let maskImg = createGraphics(ovalWidth, ovalHeight);
      maskImg.ellipse(ovalWidth / 2, ovalHeight / 2, ovalWidth, ovalHeight);
      pixelOval.mask(maskImg);
    } else if (effectMode === "whiteSquare") {
      // cara rellena de blanco (usando la máscara)
      pixelOval = createGraphics(ovalWidth, ovalHeight);
      pixelOval.noStroke();
      pixelOval.fill(255);
      pixelOval.ellipse(ovalWidth / 2, ovalHeight / 2, ovalWidth, ovalHeight);
    }

    push();
    if (effectMode === "noise") {
      tint(255, 255); // glitch sin fade
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
    hadFace = false; // si no hay cara, reseteamos bandera
  }
}

// --- cambiar efecto con barra espaciadora ---
function keyPressed() {
  if (key === " ") {
    effectIndex = (effectIndex + 1) % effectModes.length;
    effectMode = effectModes[effectIndex];
    console.log("Modo:", effectMode);
  }
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function gotFace(result) {
  faces = result;
}
