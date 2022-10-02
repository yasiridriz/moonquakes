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
const pi = Math.PI;
const moonRadius = 15;
let smArr = []
let dmArr = []
let aiArr = []
let spheres = []
const year = document.getElementById("year")
const lat = document.getElementById("lat")
const long = document.getElementById("long")
const type = document.getElementById("type")
const rotate = document.getElementById("rotate")
let INTERSECTED;
let currentId;
let rB;

// util functions

// scene.add( axesHelper );
const moonTexture = new THREE.TextureLoader().load("/models/moon.jpg");
const moonDisplacement = new THREE.TextureLoader().load(
  "/models/normal.jpg"
);

const moonMaterial = new THREE.MeshStandardMaterial({
  map: moonTexture,
  displacementMap: moonDisplacement,
});

const moonGeometry = new THREE.SphereGeometry(moonRadius, 200, 200);
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.castShadow = true;
scene.add(moon);

const drawSphere = (x, y, testZ, color, size, data) => {
  const sphereMaterial = new THREE.MeshStandardMaterial({ color: color });
  const SphereGeometry = new THREE.SphereGeometry(size, 30, 30);
  const sphere = new THREE.Mesh(SphereGeometry, sphereMaterial);

  moon.add(sphere);

  sphere.position.x = x;
  sphere.position.y = y;
  sphere.position.z = testZ;

  if (color === "#F63E02") {
    smArr.push({sphere: sphere, data: data})
    spheres.push({sphere: sphere, data: data, type: "Shallow Moonquake"})
  }

  if (color === "#41969F") {
    const newData = {...data, year: "19" + data.year}
    aiArr.push({sphere: sphere, data: newData})
    spheres.push({sphere: sphere, data: newData, type: "Artificial Impace"})
  }

  if (color === "#4E376D") {
    dmArr.push({sphere: sphere, data: data})
    const newData = {...data, year:"No data."};
    spheres.push({sphere: sphere, data: newData, type: "Deep Moonquake"})
  }  
};

const drawSphereWithLatLong = (lat, long, color, size, data) => {
  const d = moonRadius + 0.4;

  const x = d * Math.sin((lat * pi) / 180) * Math.cos((long * pi) / 180);
  const y = d * Math.sin((lat * pi) / 180) * Math.sin((long * pi) / 180);
  const z = d * Math.cos((lat * pi) / 180);
  
  drawSphere(x, y, z, color, size, data);
};

//data logic
const data = {
  SM: {
  Lat: [
      48.0, 42.0, 43.0, 54.0, 12.0, 51.0, -20.0, 33.0, -84.0, -1.0, -37.0, 36.0,
      -48.0, -37.0, 21.0, 29.0, 75.0, -2.0, -19.0, -49.0, 3.0, -8.0, 50.0, 38.0,
      50.0, -19.0, 77.0,
    ],
    Long: [
      35.0, -24.0, -47.0, 101.0, 46.0, 45.0, -80.0, 35.0, -134.0, -71.0, -29.0,
      -16.0, -106.0, 42.0, 88.0, -98.0, 40.0, -51.0, -26.0, -45.0, -58.0, 64.0,
      30.0, 44.0, -20.0, -12.0, -10.0,
    ],
    Year: [
      1971, 1971, 1971, 1972, 1972, 1972, 1972, 1973, 1973, 1973, 1973, 1974,
      1974, 1974, 1974, 1975, 1975, 1975, 1975, 1975, 1975, 1975, 1976, 1976,
      1976, 1976, 1976,
    ],
    Magnitude: [
      2.8, 2.0, 1.9, 1.9, 1.0, 1.4, 1.2, 0.8, 3.2, 2.2, 1.1, 0.7, 1.6, 0.9, 2.7,
      3.2, 1.7, 1.1, 1.4, 1.3, 1.4, 1.8, 1.8, 1.1, 2.3, 1.8, 1.5,
    ],
  },
  DM: {
    Lat: [
      -15.7, -2.9, 1.1, 43.5, 25.0, -23.7, -6.0, -35.7, 9.2, -19.1, -29.6, 0.7,
      7.5, 25.5, 23.3, 27.7, 23.7, -18.2, 21.6, 35.1, 14.3, 23.0, 8.1, 53.4,
      12.7, 25.0, 5.1, 6.8, 5.0, 27.5, 22.5, 7.8, -21.9, -1.3, 13.8, 22.2, 50.2,
      8.6, 8.7, 12.3, -10.1, 13.1, 1.1, -9.5, 24.1, 30.1, 46.6, 34.8, -20.9,
      21.1, 34.7, 24.6, 27.5, -40.9, 6.2, -8.4, 10.0, -2.0, 41.0, 15.5, -40.6,
      1.0, 0.5, -28.4, -26.5, 12.8, -13.7, -2.4, 36.1, -50.7, 6.3, 34.3, 24.1,
      36.8, -7.8, 12.2, 26.3, 26.7, -69.4, 58.6, 7.0, 34.6, 8.6, 19.4, 5.3,
      -3.4, -3.6, -46.5, 1.4, 35.0, -7.1, 3.4, -1.7, -7.6, 53.8, -50.0, -3.7,
      4.4, 2.4, -53.2, 15.5, 7.1, 42.9, 54.2, 24.8, 10.6,
    ],
    Long: [
      -36.6, -50.3, -44.7, 55.5, 53.2, -35.5, -19.7, -40.3, 17.5, -41.7, -44.4,
      -3.9, 6.3, -21.9, 32.7, 34.4, -31.4, -50.8, 43.6, 59.8, 5.2, 20.4, 10.3,
      60.9, -35.7, 43.6, 115.8, -7.2, 36.1, -4.6, 29.7, 43.3, -12.7, -10.3,
      -29.2, -50.7, 60.2, -50.8, -53.4, 37.7, -39.2, -52.4, -20.6, -53.6, -52.2,
      53.2, 42.3, 63.0, -16.8, -44.0, 60.1, -23.4, 34.3, -40.6, 11.9, 17.9,
      22.8, 32.2, 53.4, 55.6, -3.8, 2.8, 47.3, -66.6, -35.1, -36.2, -21.6,
      -73.3, -2.4, -21.4, 22.1, 45.0, 26.1, 21.2, 5.4, 3.5, 20.0, 5.2, 75.4,
      54.2, 8.3, 56.1, 73.0, 24.3, 3.6, 12.5, 21.5, 38.9, 15.0, 19.1, 15.3, 2.0,
      18.0, 36.7, 35.2, 53.2, -33.9, -4.7, 46.1, -54.4, 97.0, 22.5, 110.9, 56.5,
      35.7, 6.4,
    ],
    Depth: [
      867, 946, 933, 844, 893, 1086, 1037, 988, 1187, 973, 933, 747, 1019, 807,
      925, 974, 945, 1037, 788, 924, 1122, 1085, 933, 1077, 931, 944, 877, 971,
      933, 1058, 1343, 1031, 933, 867, 847, 907, 908, 952, 828, 1125, 933, 933,
      933, 750, 750, 975, 861, 1014, 933, 908, 1043, 1419, 919, 933, 794, 989,
      989, 920, 893, 755, 862, 919, 1243, 933, 933, 963, 764, 878, 863, 933,
      855, 933, 933, 1006, 933, 933, 831, 933, 933, 1025, 1019, 933, 933, 959,
      933, 933, 933, 933, 933, 1063, 933, 559, 933, 933, 933, 933, 933, 933,
      933, 933, 1141, 984, 933, 933, 933, 933,
    ],
  },
  AI: {
    Lat: [-3.94, -2.75, -8.09, -3.42, -1.51, 26.36, -4.21, 19.99],
    Long: [-21.2, -27.86, -26.02, -19.67, -11.81, 0.25, -12.31, 30.51],
    Y: [69, 70, 71, 71, 71, 71, 72, 72],
  },
};

const getData = async (url) => {
  console.log(data, "this is data", url);
  const { AI, SM, DM } = data;
  console.log("data fetched");
  drawSmSpheres(SM);
  drawAI(AI);
  drawDM(DM);
};


const drawAI = (AI) => {
  const color = "#41969F";
  AI.Lat.forEach((lat, index) => {
    drawSphereWithLatLong(lat, AI.Long[index], color, 0.4, {year: AI.Y[index], lat: lat, long: AI.Long[index]});
  });
};

const drawDM = (DM) => {
  const color = "#4E376D";
  DM.Lat.forEach((lat, index) => {
    drawSphereWithLatLong(
      lat,
      DM.Long[index],
      color,
      0.00035 * DM.Depth[index],
      {year: null, lat: lat, long: DM.Long[index], depth: DM.Depth[index]}
    );
  });
};

const drawSmSpheres = (SM) => {
  const color = "#F63E02";
  SM.Lat.forEach((lat, index) => {
    drawSphereWithLatLong(
      lat,
      SM.Long[index],
      color,
      0.15 * SM.Magnitude[index],
      {year: SM.Year[index], lat: lat, long: SM.Long[index]}
    );
  });
};


window.onload = (event) => {
  console.log("fetching data");
  getData("http://localhost:8000");
};

const light = new THREE.PointLight( 0xffffff, 1, 0 );
light.position.set( 30, 30, 70 );
scene.add(camera);
camera.add(light);


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

    if (Math.sqrt(x * x + y * y + z * z) > 45) {
      star.position.set(x, y, z);
      scene.add(star);
    }
  }
};

Array(300).fill().forEach(addStar);

const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 20;
controls.maxDistance = 45;

// raycaster
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

// spheres onclick foreach
window.addEventListener( 'pointermove', onPointerMove );

function onPointerMove( event ) {
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

spheres.forEach((sphere) => {
  s = sphere.sphere
  s.on('click', () => {
    console.log(sphere.data)
  })
})

const rendering = () => {
  requestAnimationFrame(rendering);

  raycaster.setFromCamera( pointer, camera );

  const intersects = raycaster.intersectObjects( moon.children, false );
  if ( intersects.length > 0 ) {
    if ( INTERSECTED != intersects[ 0 ].object ) {
      if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
      INTERSECTED = intersects[ 0 ].object;
      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      INTERSECTED.material.emissive.setHex( 0xffffff );

      currentId = INTERSECTED.uuid
      const currentData = spheres.find((sphere) => sphere.sphere.uuid == currentId)

      year.innerHTML = currentData.data.year
      lat.innerHTML = currentData.data.lat
      long.innerHTML = currentData.data.long
      type.innerHTML = currentData.type;
      rB = false
    }
  } 
  else {
    if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
    INTERSECTED = null;
    rB = true
  }
  
  if (rB && rotate.checked) {
    moon.rotation.x += 0.0009;
    moon.rotation.y += 0.0009;
    moon.rotation.z += 0.0009;
  } 

  controls.update();
  renderer.render(scene, camera);
};

rendering();
