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
const moonRadius = 15

// util functions
const axesHelper = new THREE.AxesHelper( 25 );
// scene.add( axesHelper );


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

const drawSphere = (x, y, testZ) => {
    const sphereMaterial = new THREE.MeshStandardMaterial({color: "red"})
    const SphereGeometry = new THREE.SphereGeometry(1, 40, 40)
    const sphere = new THREE.Mesh(SphereGeometry, sphereMaterial)
    
    moon.add(sphere)
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
    
    drawSphere(x, y, z)
}

drawSphereWithLatLong(0, 0)

const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

camera.position.z = 30; 

const addStar = () => {
  const g = new THREE.SphereGeometry(0.1, 24, 24);
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(g, m);
  
  for (let i = 0; i < 1000; i++) {
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

Array(300).fill().forEach(addStar);

const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 20
controls.maxDistance = 45

const rendering = () => {
  requestAnimationFrame(rendering);    
	
  moon.rotation.x += 0.0009;
  moon.rotation.y += 0.0009;
  moon.rotation.z += 0.0009;

  controls.update();
  renderer.render(scene, camera);
}

rendering();
