import './style.css'
import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 5
camera.position.y = 1
scene.add(camera)


//temporatelly light to see the rotation
const dirlight = new THREE.DirectionalLight("white", 0.9);
dirlight.position.set(3, 5,5);
const ambientLight = new THREE.AmbientLight("white", 0.1);

scene.add(dirlight, ambientLight);


/**
 * Objects
 */
// Group
const group = new THREE.Group();
scene.add(group);

// Adding mesh to scene
const box1 = new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshStandardMaterial(0xF00000)
);

const box2 = new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshStandardMaterial(0xff0000)
);
box2.position.x = -2;

const box3 = new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshStandardMaterial(0xf00000)
);
box3.position.x = 2;

group.add(box1, box2, box3);

// Group - Now we can modify the whole group
setTimeout(() => {
    console.log("Timeout")
    group.rotation.x = 0.3;
    renderer.render(scene, camera);
}, 3000)


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

