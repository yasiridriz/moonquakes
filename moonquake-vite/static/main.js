import * as THREE from '../node_modules/three/build/three.module.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;

renderer.shadowMap.type = THREE.PCFSoftShadowMap; //

renderer.setClearColor("black");

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const light = new THREE.PointLight( 0xffffff, 5, 100 );
light.position.set( 2, 4, 5 );
light.castShadow = true; // default false
light.intensity = 0.6
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

const moonTexture = new THREE.TextureLoader().load('./static/models/moon.jpg')
const moonNormal = new THREE.TextureLoader().load('./static/models/normal.jpg')

const geometry = new THREE.SphereGeometry( 1, 32, 32 );

const material = new THREE.MeshStandardMaterial( { map: moonTexture, displacementMap: moonNormal } );

const sphere = new THREE.Mesh( geometry, material );

sphere.castShadow = true;
sphere.receiveShadow = true;

scene.add( sphere );

camera.position.z = 5; // <- New code

function addStar() {
		const g = new THREE.SphereGeometry(0.25, 24, 24);
		const m = new THREE.MeshStandardMaterial( { color: 0xffffff } );
		const star = new THREE.Mesh(g, m);
		const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ) );
		star.position.set(x, y, z);
		scene.add(star);
}
Array(200).fill().forEach(addStar);

const rendering = function() {
    requestAnimationFrame(rendering);

    // Constantly rotate box
	sphere.rotation.y += 0.002;
    renderer.render(scene, camera);
}

rendering();
