import * as THREE from '../node_modules/three/build/three.module.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;

renderer.shadowMap.type = THREE.PCFSoftShadowMap; //

renderer.setClearColor("lightblue");

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight( 0xffffff, 1 );
light.position.set( 0, 1, 0 ); //default; light shining from top
light.castShadow = true; // default false
scene.add( light );

light.shadow.mapSize.width = window.innerWidth; // default
light.shadow.mapSize.height = window.innerHeight; // default
light.shadow.camera.near = 1; // default
light.shadow.camera.far = 1000; // default

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
})

const geometry = new THREE.SphereGeometry( 1, 32, 32 );



const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );

const sphere = new THREE.Mesh( geometry, material );

sphere.castShadow = true;
sphere.receiveShadow = true;

scene.add( sphere );

const helper = new THREE.DirectionalLightHelper( light, 5 );
scene.add( helper );

camera.position.z = 5; // <- New code

const rendering = function() {
    requestAnimationFrame(rendering);
    // Constantly rotate box
    scene.rotation.z -= 0.005;
    scene.rotation.x -= 0.01;
    renderer.render(scene, camera);
}
rendering();
