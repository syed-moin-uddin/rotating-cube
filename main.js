import * as THREE from 'three';

// --- Scene setup ---
const scene    = new THREE.Scene();
const camera   = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true });

camera.position.z = 3;
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

// --- Load 6 photos (edit filenames to match yours) ---
const loader = new THREE.TextureLoader();
const images = [
  '/images/face1.jpg',  // right  (+X)
  '/images/face2.jpg',  // left   (-X)
  '/images/face3.jpg',  // top    (+Y)
  '/images/face4.jpg',  // bottom (-Y)
  '/images/face5.jpg',  // front  (+Z)
  '/images/face6.jpg',  // back   (-Z)
];
const materials = images.map(path =>
  new THREE.MeshStandardMaterial({ map: loader.load(path) })
);

// --- Cube ---
const cube = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), materials);
scene.add(cube);

// --- Lighting ---
scene.add(new THREE.AmbientLight(0xffffff, 1.2));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

// --- Mouse-drag to rotate ---
let isDragging = false, prevX = 0, prevY = 0;
renderer.domElement.addEventListener('mousedown', e => {
  isDragging = true; prevX = e.clientX; prevY = e.clientY;
});
addEventListener('mouseup',   () => isDragging = false);
addEventListener('mousemove', e => {
  if (!isDragging) return;
  cube.rotation.y += (e.clientX - prevX) * 0.01;
  cube.rotation.x += (e.clientY - prevY) * 0.01;
  prevX = e.clientX; prevY = e.clientY;
});

// --- Touch support (mobile) ---
renderer.domElement.addEventListener('touchstart', e => {
  isDragging = true;
  prevX = e.touches[0].clientX; prevY = e.touches[0].clientY;
});
addEventListener('touchend',  () => isDragging = false);
addEventListener('touchmove', e => {
  if (!isDragging) return;
  cube.rotation.y += (e.touches[0].clientX - prevX) * 0.01;
  cube.rotation.x += (e.touches[0].clientY - prevY) * 0.01;
  prevX = e.touches[0].clientX; prevY = e.touches[0].clientY;
});

// --- Resize ---
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// --- Animate (auto-spin when not dragging) ---
function animate() {
  requestAnimationFrame(animate);
  if (!isDragging) {
    cube.rotation.y += 0.005;
    cube.rotation.x += 0.002;
  }
  renderer.render(scene, camera);
}
animate();