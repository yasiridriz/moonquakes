import * as THREE from '../node_modules/three/build/three.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

const renderer = new THREE.WebGLRenderer();

// renderer settings
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; //
renderer.setClearColor("black");
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// resize renderer from window
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
})

const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

const moonTexture = new THREE.TextureLoader().load('./static/models/moon.jpg')
const moonNormal = new THREE.TextureLoader().load('./static/models/normal.jpg')

const moonMaterial = new THREE.MeshStandardMaterial({ 
    map: moonTexture, 
    displacementMap: moonNormal
});

const moonGeometry = new THREE.SphereGeometry( 13, 100, 100 );

const moon = new THREE.Mesh( moonGeometry, moonMaterial );

moon.castShadow = true;

scene.add( moon );

camera.position.z = 25; // <- New code

const addStar = () => {
    const g = new THREE.SphereGeometry(0.1, 24, 24);
    const m = new THREE.MeshStandardMaterial( { color: 0xffffff } );
    const star = new THREE.Mesh(g, m);
    const z = THREE.MathUtils.randFloatSpread(10) - 15;
    const [x, y] = Array(2).fill().map(() => THREE.MathUtils.randFloatSpread( 150 ) );
    star.position.set(x, y, z);
    scene.add(star);
}

Array(300).fill().forEach(addStar);

const controls = new OrbitControls(camera, renderer.domElement);
const rendering = () => {
    requestAnimationFrame(rendering);

    // Constantly rotate box
	moon.rotation.y += 0.002;
	controls.update();
    renderer.render(scene, camera);
}

rendering();
