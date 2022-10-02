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

const displacementWidth = 5760
const displacementHeight = 2880

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

const drawSphere = (x, y, testZ) => {
    const z = findZ(x, y)
    const sphereMaterial = new THREE.MeshStandardMaterial({color: "red"})
    const SphereGeometry = new THREE.SphereGeometry(1, 40, 40)
    const sphere = new THREE.Mesh(SphereGeometry, sphereMaterial)
    scene.add(sphere)
    /*sphere.position.x = x / unitToRes
    sphere.position.y = y / unitToRes
    sphere.position.z = -(z / unitToRes) + moonRadius*/
		console.log(`x: ${x}, y: ${y}`)
		sphere.position.x = x ;
		sphere.position.y = y;
		sphere.position.z = testZ;
}


const drawSphereWithLatLong = (lat, long) => {
    
    const d = moonRadius  
  
    let x = d * Math.sin(long * pi/180)
    let y = d * Math.sin(lat * pi/180) 
    let z = (d * Math.sin((90 - long) * pi/180))
    
    // const n = unitToRes * (getPixelData(context, x, y) / 127)
    drawSphere(x, y, z)

}

drawSphereWithLatLong(0, 0)

// loading displacement map for future calculations
const displacementMap = new Image()
displacementMap.src = './static/models/normal.jpg'
displacementMap.addEventListener("load", () => {
    context.drawImage(displacementMap, 0, 0)

    // find color value of displacement Map
    // data = getPixelData(context, -200, 100)
    // console.log(data)
})

// drawSphere(200, 400)

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

camera.position.z = 60; // <- New code

const addStar = () => {
  const g = new THREE.SphereGeometry(0.1, 24, 24);
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(g, m);
  // const z = THREE.MathUtils.randFloatSpread(10) - 15;
  
  
  for (let i = 0; i < 1000; i++) {
    // let r = 50 * Math.sqrt(Math.random())
    // let alpha =  Math.random() * 2 * pi
    // let beta  =  Math.random() * 2 * pi
  
    // let x = r * Math.cos(alpha)
    // let y = r * Math.sin(alpha)
    // let z = r * Math.sin(alpha)
    // let z = 0
    // THREE.MathUtils.randFloatSpread(150)
    
    var u = Math.random();
    var v = Math.random();
    var theta = u * 2.0 * Math.PI;
    var phi = Math.acos(2.0 * v - 1.0);
    var r = 50 * Math.cbrt(Math.random());
    var sinTheta = Math.sin(theta);
    var cosTheta = Math.cos(theta);
    var sinPhi = Math.sin(phi);
    var cosPhi = Math.cos(phi);
    var x = r * sinPhi * cosTheta;
    var y = r * sinPhi * sinTheta;
    var z = r * cosPhi;

    if (Math.sqrt(x*x + y*y + z*z) > 45) {
      star.position.set(x, y, z);
      scene.add(star);
    }
  }
};

// rotation logic
// let prevClientX = 0;
// let prevClientY = 0;

// const mouseMoveEvent = (e) => {
//   if (e.clientX - window.innerWidth / 2 < prevClientX) {
// 	const rotationVal = prevClientX - (e.clientX - window.innerWidth / 2)
//     moon.rotation.y -= rotationVal * 0.006;
//     prevClientX = e.clientX - window.innerWidth / 2;
//   } 
//   else if (e.clientX - window.innerWidth / 2 > prevClientX){
// 	const rotationVal =  (e.clientX - window.innerWidth / 2) - prevClientX
//     moon.rotation.y += rotationVal * 0.006;
//     prevClientX = e.clientX - window.innerWidth / 2;
//   }

//   if (e.clientY - window.innerHeight / 2 < prevClientY) {
//     const rotationVal = prevClientY - (e.clientY - window.innerHeight / 2)
//     moon.rotation.x -= rotationVal * 0.006;
//     prevClientY = e.clientY - window.innerHeight / 2;
//   } 
//   else if(e.clientY - window.innerHeight / 2 > prevClientY){
//     const rotationVal =  (e.clientY - window.innerHeight / 2) - prevClientY
//     moon.rotation.x += rotationVal * 0.006;
//     prevClientY = e.clientY - window.innerHeight / 2;
//   }
// }

// document.addEventListener("mousedown", (e) => {
//     document.addEventListener("mousemove", mouseMoveEvent);
// });

// const mouseUpEvent = (e) => {
//     document.removeEventListener("mousemove", mouseMoveEvent);
// }

// document.addEventListener("mouseup", mouseUpEvent);

Array(300).fill().forEach(addStar);

const controls = new OrbitControls(camera, renderer.domElement);

const rendering = () => {
  controls.minDistance = 20
  controls.maxDistance = 45
  requestAnimationFrame(rendering);    
	
  controls.update();
  renderer.render(scene, camera);
}

rendering();
