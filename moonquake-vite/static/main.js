import * as THREE from "../node_modules/three/build/three.module.js";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { drawFuncs } from "./utils.js";
import { data } from "./data.js";
//constants
const moonRadius = 15;
const spheres = [];
const year = document.getElementById("year");
const lat = document.getElementById("lat");
const long = document.getElementById("long");
const type = document.getElementById("type");
const rotate = document.getElementById("rotate");
let INTERSECTED;
let currentId;
let rB;

//initialize

const scene = new THREE.Scene();
const slider = document.getElementById("slider");
const sliderYear = document.getElementById("sliderYear");
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; //
renderer.setClearColor("black");
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

const moonTexture = new THREE.TextureLoader().load("/models/moon.jpg");
const moonDisplacement = new THREE.TextureLoader().load("/models/normal.jpg");

const moonMaterial = new THREE.MeshStandardMaterial({
  map: moonTexture,
  displacementMap: moonDisplacement,
});

const moonGeometry = new THREE.SphereGeometry(moonRadius, 200, 200);
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.castShadow = true;
scene.add(moon);

// draw Functionality

const { drawSM, drawAI, drawDM } = drawFuncs(THREE, moon, moonRadius, spheres);
const { AI, SM, DM } = data;
drawSM(SM);
drawAI(AI);
drawDM(DM);

const light = new THREE.PointLight(0xffffff, 1, 0);
light.position.set(30, 30, 70);
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
window.addEventListener("pointermove", onPointerMove);

function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

//slider logic
slider.addEventListener("input", (e) => {
  const v = e.target.value;
  const factor = 100 / 8;

  if (v < 5) {
    sliderYear.innerText = "N/A";
    spheres.forEach((sphere) => {
      moon.add(sphere.sphere);
      if (sphere.data.year !== "No data.") {
        moon.remove(sphere.sphere);
      }
    });
  } else if (v > 5 && v < factor) {
    sliderYear.innerText = "1969";
    spheres.forEach((sphere) => {
      moon.add(sphere.sphere);
      if (sphere.data.year != 1969) {
        moon.remove(sphere.sphere);
      }
    });
  } else if (v > factor && v < factor * 2) {
    sliderYear.innerText = "1970";
    spheres.forEach((sphere) => {
      moon.add(sphere.sphere);
      if (sphere.data.year != 1970) {
        moon.remove(sphere.sphere);
      }
    });
  } else if (v > 2 * factor && v < factor * 3) {
    sliderYear.innerText = "1971";
    spheres.forEach((sphere) => {
      moon.add(sphere.sphere);
      if (sphere.data.year != 1971) {
        moon.remove(sphere.sphere);
      }
    });
  } else if (v > factor * 3 && v < factor * 4) {
    sliderYear.innerText = "1972";
    spheres.forEach((sphere) => {
      moon.add(sphere.sphere);
      if (sphere.data.year != 1972) {
        moon.remove(sphere.sphere);
      }
    });
  } else if (v > factor * 4 && v < factor * 5) {
    sliderYear.innerText = "1973";
    spheres.forEach((sphere) => {
      moon.add(sphere.sphere);
      if (sphere.data.year != 1973) {
        moon.remove(sphere.sphere);
      }
    });
  } else if (v > factor * 5 && v < factor * 6) {
    sliderYear.innerText = "1974";
    spheres.forEach((sphere) => {
      moon.add(sphere.sphere);
      if (sphere.data.year != 1974) {
        moon.remove(sphere.sphere);
      }
    });
  } else if (v > factor * 6 && v < factor * 7) {
    sliderYear.innerText = "1975";
    spheres.forEach((sphere) => {
      moon.add(sphere.sphere);
      if (sphere.data.year != 1975) {
        moon.remove(sphere.sphere);
      }
    });
  } else if (v > factor * 7 && v < 100) {
    sliderYear.innerText = "1976";
    spheres.forEach((sphere) => {
      moon.add(sphere.sphere);
      if (sphere.data.year != 1976) {
        moon.remove(sphere.sphere);
      }
    });
  } else if (v == 100) {
    sliderYear.innerText = "All";
    spheres.forEach((sphere) => {
      moon.add(sphere.sphere);
    });
  }
});
const rendering = () => {
  requestAnimationFrame(rendering);

  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(moon.children, false);
  if (intersects.length > 0) {
    if (INTERSECTED != intersects[0].object) {
      if (INTERSECTED)
        INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
      INTERSECTED = intersects[0].object;
      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      INTERSECTED.material.emissive.setHex(0xffffff);

      currentId = INTERSECTED.uuid;
      const currentData = spheres.find(
        (sphere) => sphere.sphere.uuid == currentId
      );

      year.innerHTML = currentData.data.year;
      lat.innerHTML = currentData.data.lat;
      long.innerHTML = currentData.data.long;
      type.innerHTML = currentData.type;
      rB = false;
    }
  } else {
    if (INTERSECTED)
      INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
    INTERSECTED = null;
    rB = true;
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