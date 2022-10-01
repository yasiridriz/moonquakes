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
light.position.set( 43, 24, 35 );
light.castShadow = true; // default false
light.intensity = 2
scene.add( light );

light.shadow.mapSize.width = window.innerWidth; // default
light.shadow.mapSize.height = window.innerHeight; // default
light.shadow.camera.near = 1; // default
light.shadow.camera.far = 1000; // default

const light2 = new THREE.PointLight( 0xffffff, 5, 100 );
light2.position.set( -43, -24, 35 );
// light2.castShadow = true; // default false
light2.intensity = 0.2
scene.add( light2 );

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
})

const moonTexture = new THREE.TextureLoader().load('./static/models/moon.jpg')
const moonNormal = new THREE.TextureLoader().load('./static/models/normal.jpg')

const geometry = new THREE.SphereGeometry( 13, 32, 32 );

const material = new THREE.MeshStandardMaterial( { 
    map: moonTexture, 
    displacementMap: moonNormal
} );

const sphere = new THREE.Mesh( geometry, material );

sphere.castShadow = true;

scene.add( sphere );

camera.position.z = 25; // <- New code

const starPointLight = new THREE.PointLight(0xffffff, 15, 100);
starPointLight.position.set(43 , 24, -10 );
// light2.castShadow = true; // default false
starPointLight.intensity = 5
scene.add( starPointLight );
function addStar() {
		const g = new THREE.SphereGeometry(0.1, 24, 24);
		const m = new THREE.MeshStandardMaterial( { color: 0xffffff } );
		const star = new THREE.Mesh(g, m);
		const z = THREE.MathUtils.randFloatSpread(10) - 15;
		const [x, y] = Array(2).fill().map(() => THREE.MathUtils.randFloatSpread( 150 ) );
		star.position.set(x, y, z);
		scene.add(star);
}
Array(300).fill().forEach(addStar);

const rendering = function() {
    requestAnimationFrame(rendering);

    // Constantly rotate box
	sphere.rotation.y += 0.002;
    renderer.render(scene, camera);
}

rendering();
