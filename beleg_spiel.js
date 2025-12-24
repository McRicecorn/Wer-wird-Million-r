main();

function main() {

const stats = new Stats();
    // create context
    const canvas = document.querySelector("#c");
    const gl = new THREE.WebGLRenderer({        //malt alles auf das Canvas
        canvas,
        antialias: true
    });
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;     //BasicsShadowMap = harte Schatten


  // create camera
    const angleOfView = 75; //wie Menschliches Auge
    const aspectRatio = canvas.clientWidth / canvas.clientHeight;
    const nearPlane = 0.1;
    const farPlane = 1000;
    const camera = new THREE.PerspectiveCamera(
        angleOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );
    camera.position.set(0,0,0);


// create the scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0.3, 0.5, 0.8);
   

document.body.appendChild(stats.dom);



//ermöglicht Maussteuerung der Kamera. Brauch ich das ? 
var trackballControls = new THREE.TrackballControls(camera, gl.domElement);


var clock = new THREE.Clock(); //stoppuhr für animationen


//upright plane
const planeWidth = 256;
const planeHeight = 128;
const planeGeometry = new THREE.PlaneGeometry(
    planeWidth,
    planeHeight
);



//Objekte
//Schatztruhe :  Rechteck & halb Zylinder
const treasureChest_rectangle = new THREE.BoxGeometry(10, 6, 6);
const treasureChest_rectangle_material = new THREE.MeshStandardMaterial({color: '#98480eff'});
const treasureChestLow = new THREE.Mesh(treasureChest_rectangle, treasureChest_rectangle_material);

const treasureChest_halfCylinder = new THREE.CylinderGeometry(3, 3, 10, 32, 1, false, 0, Math.PI);
const treasureChest_halfCylinder_material = new THREE.MeshStandardMaterial({color: '#ec9a0bff'});
const treasureChestHigh = new THREE.Mesh(treasureChest_halfCylinder, treasureChest_halfCylinder_material);
treasureChestHigh.rotation.z = Math.PI / 2;
treasureChestHigh.position.x = treasureChestLow.position.x;
treasureChestHigh.position.y = treasureChestLow.position.y + 3;


const treasureChest = new THREE.Group();
treasureChest.add(treasureChestLow);
treasureChest.add(treasureChestHigh);
scene.add(treasureChest);

treasureChest.position.set(20, 1, 0);

//SpielObjekte - Standort
const playerX = 0;
let monsterX = -30;
let chestX = 30;
const step = 2;
let gameOver = false;


const monsterGeo = new THREE.SphereGeometry(3, 16, 16);
const monsterMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const monster = new THREE.Mesh(monsterGeo, monsterMat);
scene.add(monster);

monster.position.set(monsterX, 3, 0);


function correctAnswer() {
  if (gameOver) return;
  chestX -= step;
}

function wrongAnswer() {
  if (gameOver) return;
  monsterX += step;
}
function toBegin(){
    monsterX = -30
    chestX = 30

}

const winDistance = 2;

if (chestX <= winDistance) {
  console.log("GEWONNEN 🎉");
}

if (monsterX >= -winDistance) {
  console.log("VERLOREN 💀");
}

if (gameOver) {
  monster.material.color.set(0xff0000);
}




//Materialien und Texturen
const textureLoader = new THREE.TextureLoader();





const planeTextureMap = textureLoader.load('textures/R.png');
    planeTextureMap.wrapS = THREE.RepeatWrapping;
    planeTextureMap.wrapT = THREE.RepeatWrapping;
    planeTextureMap.repeat.set(1, 1);
    planeTextureMap.magFilter = THREE.NearestFilter;
    planeTextureMap.minFilter = THREE.NearestFilter;
    planeTextureMap.anisotropy = gl.getMaxAnisotropy();

    const planeMaterial = new THREE.MeshStandardMaterial({
        map: planeTextureMap,
        side: THREE.DoubleSide,
        //normalMap: planeNorm 
    });
    




 // MESHES
   
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;
    
    scene.add(plane);
/*
const sphereMaterial = new THREE.MeshStandardMaterial({
    map: sphereTextureMap
});

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(20,3,13);
    scene.add(sphere);
*/

//LIGHTS
    const color = 0xffffff;
    const intensity = .7;
    const light = new THREE.DirectionalLight(color, intensity);
    light.target = plane;
    light.position.set(20, 20, -10);
    scene.add(light);
    scene.add(light.target);

document.addEventListener('keydown', (e) => {
  if (e.key === 'a') correctAnswer(); // richtig
  if (e.key === 's') wrongAnswer();   // falsch
  if (e.key === 'r') toBegin();
});


// Kamera
camera.position.set(0, 30, 50);
camera.lookAt(0, 0, 0);
trackballControls.target.set(0, 0, 0);



function draw(time){
    time *= 0.001; //convert time to seconds
    stats.update();

    trackballControls.update();

// Schatztruhe Position aktualisieren
    monster.position.x = monsterX;
    treasureChest.position.x = chestX;
    if (!gameOver) {

    if (chestX <= winDistance) {
        gameOver = true;
        console.log("🏆 GEWONNEN!");
    }

    if (monsterX >= -winDistance) {
        gameOver = true;
        console.log("💀 VERLOREN!");
    }
    }

    if (resizeGLToDisplaySize(gl)) {
            const canvas = gl.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
    gl.render(scene, camera);
        requestAnimationFrame(draw);
    }

requestAnimationFrame(draw);

}
function resizeGLToDisplaySize(gl) {
    const canvas = gl.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width != width || canvas.height != height;
    if (needResize) {
        gl.setSize(width, height, false);
    }
    return needResize;
} 