import './style.css'
import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
mesh.position.set(1, -0.5, 0);

// Aces helper
const strokeLenght = 1;
const axesHelper = new THREE.AxesHelper(strokeLenght);
scene.add(axesHelper);


// scale
mesh.scale.y = 0.5
mesh.scale.x = 0.4
// or
mesh.scale.set(1, 1.5, 1);

// rotation
/*
2 options
* rotation
 by mesh.rotation and receive an euler 
 rotation will change all of the meshes axes from the prespective
*/
mesh.rotation.y = 0.3;
// lets say we wamt tp halt rotate, so do this
mesh.rotation.x = Math.PI;


// to fix the rotation issues that the axes get changes, wee need to change
// the rotation order
mesh.rotation.reorder("YXZ");
//then do the rotations
mesh.rotation.y = 0.7;

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
const dirlight = new THREE.DirectionalLight("white", 1);
dirlight.position.set(3, 5, 3);
const ambientLight = new THREE.AmbientLight("blue", 0.1);

scene.add(dirlight, ambientLight);
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)