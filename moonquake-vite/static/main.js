import * as THREE from "../node_modules/three/build/three.module.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  1000
);

const renderer = new THREE.WebGLRenderer();

// renderer settings
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; //
renderer.setClearColor("black");
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// resize renderer from window
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// constant variables
const pi = Math.PI
const unitToRes = 61.1155 // of normal map
const moonRadius = 15


// util functions
let canvas = document.createElement('canvas');
let context = canvas.getContext('2d');
let data = null;

const axesHelper = new THREE.AxesHelper( 25 );
scene.add( axesHelper );

const getPixelData = (context, x, y) => {
    // returns grayscale data (remove [0] to return all data)
    return context.getImageData(x, y, 1, 1).data[0] - 127;
}

const findZ = (x, y) => {
    const n = unitToRes * (getPixelData(context, x, y) / 127)
    let dx = x / unitToRes
    let dy = y / unitToRes

    return Math.sqrt((moonRadius * moonRadius) + (n * n) + (2 * n * moonRadius) - (dx * dx) - (dy * dy))
}

const drawSphere = (x, y) => {
    const z = findZ(x, y)
    const sphereMaterial = new THREE.MeshStandardMaterial({color: "yellow"})
    const SphereGeometry = new THREE.SphereGeometry((1 / 41), 1, 1)
    const sphere = new THREE.Mesh(SphereGeometry, sphereMaterial)
    scene.add(sphere)
    console.log(x / unitToRes, y / unitToRes, z / unitToRes)
    sphere.position.x = x / unitToRes
    sphere.position.y = y / unitToRes
    sphere.position.z = z / unitToRes
}

// loading displacement map for future calculations
const displacementMap = new Image()
displacementMap.src = './static/models/normal.jpg'
displacementMap.addEventListener("load", () => {
    context.drawImage(displacementMap, 0, 0)

    // find color value of displacement Map
    // data = getPixelData(context, -200, 100)
    // console.log(data)
})

drawSphere(200, 200)

const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

const moonTexture = new THREE.TextureLoader().load('./static/models/moon.jpg')
const moonDisplacement = new THREE.TextureLoader().load('./static/models/normal.jpg')

const moonMaterial = new THREE.MeshStandardMaterial({ 
    map: moonTexture, 
    displacementMap: moonDisplacement,
});

const moonGeometry = new THREE.SphereGeometry( moonRadius, 200, 200 );
const moon = new THREE.Mesh( moonGeometry, moonMaterial );
moon.castShadow = true;

scene.add(moon);

camera.position.z = 30; // <- New code

const addStar = () => {
  const g = new THREE.SphereGeometry(0.1, 24, 24);
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(g, m);
  const z = THREE.MathUtils.randFloatSpread(10) - 15;
  const [x, y] = Array(2)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(150));
  star.position.set(x, y, z);
  scene.add(star);
};
// rotation logic
let prevClientX = 0;
let prevClientY = 0;
function mouseMoveEvent(e) {
  if (e.clientX - window.innerWidth / 2 < prevClientX) {
		  const rotationVal = prevClientX - (e.clientX - window.innerWidth / 2)
      moon.rotation.y -= rotationVal * 0.006;
    prevClientX = e.clientX - window.innerWidth / 2;
  } else if(e.clientX - window.innerWidth / 2 > prevClientX){
		  const rotationVal =  (e.clientX - window.innerWidth / 2) - prevClientX
		  console.log(rotationVal*0.0001, "rotationVal down")
      moon.rotation.y += rotationVal * 0.006;
    prevClientX = e.clientX - window.innerWidth / 2;
  }
  if (e.clientY - window.innerHeight / 2 < prevClientY) {
		  const rotationVal = prevClientY - (e.clientY - window.innerHeight / 2)
		  console.log(rotationVal*0.0001, "rotationVal up")
      moon.rotation.x -= rotationVal * 0.006;
    prevClientY = e.clientY - window.innerHeight / 2;
  } else if(e.clientY - window.innerHeight / 2 > prevClientY){
		  const rotationVal =  (e.clientY - window.innerHeight / 2) - prevClientY
		  console.log(rotationVal*0.0001, "rotationVal down")
      moon.rotation.x += rotationVal * 0.006;
    prevClientY = e.clientY - window.innerHeight / 2;
  }
}
document.addEventListener("mousedown", (e) => {
  document.addEventListener("mousemove", mouseMoveEvent);
});
function mouseUpEvent(e) {
  document.removeEventListener("mousemove", mouseMoveEvent);
}
document.addEventListener("mouseup", mouseUpEvent);
Array(300).fill().forEach(addStar);
const controls = new OrbitControls(camera, renderer.domElement);
const rendering = () => {
  requestAnimationFrame(rendering);

  // Constantly rotate box
  moon.rotation.y += 0.002;
  controls.update();
  renderer.render(scene, camera);
};

rendering();
