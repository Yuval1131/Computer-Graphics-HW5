import {OrbitControls} from './OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Set background color
scene.background = new THREE.Color(0x000000);

// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 15);
scene.add(directionalLight);

// Enable shadows
renderer.shadowMap.enabled = true;
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 30;
directionalLight.shadow.camera.left = -50;
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;

function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi/180);
}

// Create basketball court
function createBasketballCourt() {
  // Court floor - just a simple brown surface
  const courtGeometry = new THREE.BoxGeometry(30, 0.2, 15);
  const courtMaterial = new THREE.MeshPhongMaterial({
    color: 0xc68642,  // Brown wood color
    shininess: 50
  });
  const court = new THREE.Mesh(courtGeometry, courtMaterial);
  court.receiveShadow = true;
  court.castShadow = true;
  scene.add(court);

  const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

  // Center line
  const centerLineGeo = new THREE.BoxGeometry(0.15, 0.05, 15);
  const centerLine = new THREE.Mesh(centerLineGeo, lineMat);
  centerLine.position.set(0, 0.125, 0);
  scene.add(centerLine);

  // Center circle
  const centerCircleGeo = new THREE.RingGeometry(1.8, 1.95, 32);
  const centerCircle = new THREE.Mesh(centerCircleGeo, lineMat);
  centerCircle.rotation.x = -Math.PI / 2;
  centerCircle.position.set(0, 0.11, 0);
  scene.add(centerCircle);

  // Three point lines
  createThreePointLine(12.5, lineMat);
  createThreePointLine(-12.5, lineMat);

  // Paint
  createKeyArea(12.5, lineMat);
  createKeyArea(-12.5, lineMat);

  // Hoops
  createBasketballHoop(14, 1);
  createBasketballHoop(-14, -1);

  // Ball
  createBasketball();

  // Scoreboard
  createStadiumScoreboard();
}

// Function to create the three-point line
function createThreePointLine(xPos, material) {
  const arcRadius = 6.75;
  const arcGeo = new THREE.RingGeometry(arcRadius - 0.075, arcRadius + 0.075, 32, 1, 0, Math.PI);
  const arc = new THREE.Mesh(arcGeo, material);
  arc.rotation.x = -Math.PI / 2;

  let arcCenterX;
  if (xPos > 0) {
    arc.rotation.z = Math.PI / 2;
    arcCenterX = xPos - 1.25;
    arc.position.set(arcCenterX, 0.11, 0);
  } else {
    arc.rotation.z = -Math.PI / 2;
    arcCenterX = xPos + 1.25;
    arc.position.set(arcCenterX, 0.11, 0);
  }
  scene.add(arc);

  const baselineX = Math.abs(xPos);
  const lineStartX = Math.abs(arcCenterX);
  const lineLength = baselineX - lineStartX;

  if (xPos > 0) {
    const topLine = new THREE.Mesh(
        new THREE.BoxGeometry(lineLength, 0.05, 0.15),
        material
    );
    topLine.position.set(arcCenterX + lineLength/2, 0.125, -arcRadius);
    scene.add(topLine);

    const bottomLine = new THREE.Mesh(
        new THREE.BoxGeometry(lineLength, 0.05, 0.15),
        material
    );
    bottomLine.position.set(arcCenterX + lineLength/2, 0.125, arcRadius);
    scene.add(bottomLine);
  } else {
    const topLine = new THREE.Mesh(
        new THREE.BoxGeometry(lineLength, 0.05, 0.15),
        material
    );
    topLine.position.set(arcCenterX - lineLength/2, 0.125, -arcRadius);
    scene.add(topLine);

    const bottomLine = new THREE.Mesh(
        new THREE.BoxGeometry(lineLength, 0.05, 0.15),
        material
    );
    bottomLine.position.set(arcCenterX - lineLength/2, 0.125, arcRadius);
    scene.add(bottomLine);
  }
}

// Function to create the stadium scoreboard, for the bonus
function createStadiumScoreboard() {
  const scoreboardGroup = new THREE.Group();

  const boardGeo = new THREE.BoxGeometry(8, 3, 0.3);
  const boardMat = new THREE.MeshPhongMaterial({ color: 0x1a1a1a });
  const scoreboard = new THREE.Mesh(boardGeo, boardMat);
  scoreboard.position.set(0, 12, -20);
  scoreboard.castShadow = true;
  scoreboardGroup.add(scoreboard);

  const screenGeo = new THREE.BoxGeometry(7, 2, 0.1);
  const screenMat = new THREE.MeshPhongMaterial({
    color: 0x000033,
    emissive: 0x000011
  });
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.set(0, 12, -19.8);
  scoreboardGroup.add(screen);

  const supportGeo = new THREE.CylinderGeometry(0.2, 0.2, 12);
  const supportMat = new THREE.MeshPhongMaterial({ color: 0x666666 });
  const support = new THREE.Mesh(supportGeo, supportMat);
  support.position.set(0, 6, -20);
  support.castShadow = true;
  scoreboardGroup.add(support);

  const textMat = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    emissive: 0x222222
  });

  for (let i = 0; i < 10; i++) {
    const letterGeo = new THREE.BoxGeometry(0.3, 0.4, 0.05);
    const letter = new THREE.Mesh(letterGeo, textMat);
    letter.position.set(-2.25 + (i * 0.5), 12.5, -19.7);
    scoreboardGroup.add(letter);
  }

  const clockMat = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    emissive: 0x440000
  });

  for (let i = 0; i < 5; i++) {
    const digitGeo = new THREE.BoxGeometry(0.2, 0.3, 0.05);
    const digit = new THREE.Mesh(digitGeo, clockMat);
    digit.position.set(-0.5 + (i * 0.25), 11.5, -19.7);
    scoreboardGroup.add(digit);
  }

  scene.add(scoreboardGroup);
}

function createKeyArea(xPosition, material) {
  const keyWidth = 4.9;
  const keyLength = 5.8;
  const freeThrowDist = 4.6;

  const basketX = xPosition > 0 ? 14 : -14;
  const keyStartX = xPosition > 0 ? basketX - keyLength : basketX + keyLength;
  const freeThrowX = xPosition > 0 ? basketX - freeThrowDist : basketX + freeThrowDist;

  // Free throw line
  const ftLine = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.05, keyWidth), material);
  ftLine.position.set(freeThrowX, 0.125, 0);
  scene.add(ftLine);

  // Left side of key
  const leftLine = new THREE.Mesh(new THREE.BoxGeometry(keyLength, 0.05, 0.15), material);
  if (xPosition > 0) {
    leftLine.position.set(basketX - keyLength/2, 0.125, -keyWidth/2);
  } else {
    leftLine.position.set(basketX + keyLength/2, 0.125, -keyWidth/2);
  }
  scene.add(leftLine);

  // Right side of key
  const rightLine = new THREE.Mesh(new THREE.BoxGeometry(keyLength, 0.05, 0.15), material);
  if (xPosition > 0) {
    rightLine.position.set(basketX - keyLength/2, 0.125, keyWidth/2);
  } else {
    rightLine.position.set(basketX + keyLength/2, 0.125, keyWidth/2);
  }
  scene.add(rightLine);

  // Free throw circle
  const ftCircleGeo = new THREE.RingGeometry(1.8, 1.95, 32);
  const ftCircle = new THREE.Mesh(ftCircleGeo, material);
  ftCircle.rotation.x = -Math.PI / 2;
  ftCircle.position.set(freeThrowX, 0.11, 0);
  scene.add(ftCircle);
}

function createBasketballHoop(xPos, direction) {
  const hoopGroup = new THREE.Group();

  // Pole
  const poleGeo = new THREE.CylinderGeometry(0.15, 0.15, 8);
  const poleMat = new THREE.MeshPhongMaterial({ color: 0x555555 });
  const pole = new THREE.Mesh(poleGeo, poleMat);
  pole.position.set(xPos + (direction * 2), 4, 0);
  pole.castShadow = true;
  hoopGroup.add(pole);

  // Arm
  const armGeo = new THREE.BoxGeometry(2, 0.2, 0.2);
  const arm = new THREE.Mesh(armGeo, poleMat);
  arm.position.set(xPos + (direction * 1), 6.5, 0);
  arm.castShadow = true;
  hoopGroup.add(arm);

  // Backboard, partially transparent
  const backboardGeo = new THREE.BoxGeometry(0.1, 3, 1.8);
  const backboardMat = new THREE.MeshPhongMaterial({color: 0xffffff, transparent: true, opacity: 0.9, side: THREE.DoubleSide});
  const backboard = new THREE.Mesh(backboardGeo, backboardMat);
  backboard.position.set(xPos, 6.5, 0);
  backboard.castShadow = true;
  backboard.receiveShadow = true;
  hoopGroup.add(backboard);

  //Squere for the backboard - Bonus
  createBackboardSquere(xPos, 5.05, direction, hoopGroup);

  // Rim
  const rimGeo = new THREE.TorusGeometry(0.45, 0.03, 8, 16);
  const rimMat = new THREE.MeshPhongMaterial({ color: 0xff6600 });
  const rim = new THREE.Mesh(rimGeo, rimMat);
  rim.position.set(xPos - (direction * 0.5), 5.05, 0);
  rim.rotation.x = Math.PI / 2;
  rim.castShadow = true;
  hoopGroup.add(rim);

  // Net
  createNet(xPos - (direction * 0.5), 5.05, hoopGroup);

  scene.add(hoopGroup);
}

function createBackboardSquere(x, y, direction, parentGroup) {
  const squareOutline = new THREE.Group();
  const squareSize = 0.45;
  const lineWidth = 0.025;
  const offset = direction * 0.06;

  // Top
  const topLine = new THREE.Mesh(new THREE.BoxGeometry(0.01, lineWidth, squareSize), new THREE.MeshBasicMaterial({ color: 0x000000 }));
  topLine.position.set(x - offset, y + squareSize/2, 0);
  squareOutline.add(topLine);

  // Bottom
  const bottomLine = new THREE.Mesh(new THREE.BoxGeometry(0.01, lineWidth, squareSize), new THREE.MeshBasicMaterial({ color: 0x000000 }));
  bottomLine.position.set(x - offset, y - squareSize/2, 0);
  squareOutline.add(bottomLine);

  // Left
  const leftLine = new THREE.Mesh(new THREE.BoxGeometry(0.01, squareSize, lineWidth), new THREE.MeshBasicMaterial({ color: 0x000000 }));
  leftLine.position.set(x - offset, y, -squareSize/2);
  squareOutline.add(leftLine);

  // Right
  const rightLine = new THREE.Mesh(new THREE.BoxGeometry(0.01, squareSize, lineWidth), new THREE.MeshBasicMaterial({ color: 0x000000 }));
  rightLine.position.set(x - offset, y, squareSize/2);
  squareOutline.add(rightLine);
  parentGroup.add(squareOutline);
}

function createNet(x, y, parentGroup) {
  const netMat = new THREE.LineBasicMaterial({ color: 0xcccccc });
  const segments = 10; // As required
  const netDepth = 0.6;

  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const startX = Math.cos(angle) * 0.42;
    const startZ = Math.sin(angle) * 0.42;

    const pts = [];
    pts.push(new THREE.Vector3(x + startX, y, startZ));
    pts.push(new THREE.Vector3(x + startX * 0.2, y - netDepth, startZ * 0.2));
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const line = new THREE.Line(geo, netMat);
    parentGroup.add(line);

    // Connect adjacent net segments
    if (i < segments - 1) {
      const nextAngle = ((i + 1) / segments) * Math.PI * 2;
      const nextX = Math.cos(nextAngle) * 0.42;
      const nextZ = Math.sin(nextAngle) * 0.42;

      const connectPts = [];
      connectPts.push(new THREE.Vector3(x + startX * 0.2, y - netDepth, startZ * 0.2));
      connectPts.push(new THREE.Vector3(x + nextX * 0.2, y - netDepth, nextZ * 0.2));

      const connectGeo = new THREE.BufferGeometry().setFromPoints(connectPts);
      const connectLine = new THREE.Line(connectGeo, netMat);
      parentGroup.add(connectLine);
    }
  }
}

function createBasketball() {
  // Orange color for the basketball
  const ballGeo = new THREE.SphereGeometry(0.3, 32, 16);
  const ballMat = new THREE.MeshPhongMaterial({color: 0xff8c00, shininess: 50});
  const basketball = new THREE.Mesh(ballGeo, ballMat);
  basketball.position.set(0, 0.4, 0);  // Exactly at the center
  basketball.castShadow = true;
  basketball.receiveShadow = true;
  scene.add(basketball);

  // The lines on the ball
  const seamMat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 3 });
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const points = [];
    for (let j = 0; j <= 20; j++) {
      const phi = (j / 20) * Math.PI;
      const x = 0.31 * Math.sin(phi) * Math.cos(angle);
      const y = 0.31 * Math.cos(phi);
      const z = 0.31 * Math.sin(phi) * Math.sin(angle);
      points.push(new THREE.Vector3(x, y + 0.4, z));
    }

    const seamGeo = new THREE.BufferGeometry().setFromPoints(points);
    const seamLine = new THREE.Line(seamGeo, seamMat);
    scene.add(seamLine);
  }

  for (let offset of [-0.1, 0.1]) {
    const curvePts = [];
    for (let i = 0; i <= 40; i++) {
      const angle = (i / 40) * Math.PI * 2;
      const x = 0.31 * Math.cos(angle);
      const z = 0.31 * Math.sin(angle);
      curvePts.push(new THREE.Vector3(x, 0.4 + offset, z));
    }

    const curveGeo = new THREE.BufferGeometry().setFromPoints(curvePts);
    const curveLine = new THREE.Line(curveGeo, seamMat);
    scene.add(curveLine);
  }
}

function createUIElements() {
  // HTML container for score display
  const scoreContainer = document.createElement('div');
  scoreContainer.id = 'scoreContainer';
  scoreContainer.style.position = 'absolute';
  scoreContainer.style.top = '20px';
  scoreContainer.style.left = '50%';
  scoreContainer.style.transform = 'translateX(-50%)';
  scoreContainer.style.color = 'white';
  scoreContainer.style.fontSize = '24px';
  scoreContainer.style.fontFamily = 'Arial, sans-serif';
  scoreContainer.style.textAlign = 'center';
  scoreContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  scoreContainer.style.border = '2px solid #ffffff';
  scoreContainer.style.padding = '15px 25px';
  scoreContainer.style.borderRadius = '10px';
  scoreContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
  scoreContainer.style.zIndex = '1000';
  scoreContainer.innerHTML = 'Score Display Ready';
  document.body.appendChild(scoreContainer);

  // HTML container for the controls
  const instructionsElement = document.createElement('div');
  instructionsElement.id = 'controlsContainer';
  instructionsElement.style.position = 'absolute';
  instructionsElement.style.bottom = '20px';
  instructionsElement.style.left = '20px';
  instructionsElement.style.color = 'white';
  instructionsElement.style.fontSize = '16px';
  instructionsElement.style.fontFamily = 'Arial, sans-serif';
  instructionsElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  instructionsElement.style.border = '2px solid #cccccc';
  instructionsElement.style.padding = '15px';
  instructionsElement.style.borderRadius = '8px';
  instructionsElement.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
  instructionsElement.style.zIndex = '1000';
  instructionsElement.style.textAlign = 'left';
  instructionsElement.innerHTML = `
    <h3 style="margin-top: 0; margin-bottom: 10px; color: #ffffff;">Controls:</h3>
    <p style="margin: 5px 0; color: #ffffff;">• O - Toggle orbit camera</p>
    <p style="margin: 5px 0; color: #cccccc; font-size: 14px;">Place Holder for the instruction in HW6</p>
  `;
  document.body.appendChild(instructionsElement);
}

// Create all elements
createBasketballCourt();
createUIElements();

// Set camera position for better view
const cameraTranslate = new THREE.Matrix4();
cameraTranslate.makeTranslation(0, 15, 30);
camera.applyMatrix4(cameraTranslate);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
let isOrbitEnabled = true;

// Handle key events
function handleKeyDown(e) {
  if (e.key === "o") {
    isOrbitEnabled = !isOrbitEnabled;
  }
}

document.addEventListener('keydown', handleKeyDown);

// Animation function
function animate() {
  requestAnimationFrame(animate);

  // Update controls
  controls.enabled = isOrbitEnabled;
  controls.update();

  renderer.render(scene, camera);
}

animate();