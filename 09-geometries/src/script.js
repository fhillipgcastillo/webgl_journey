import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import diskImage from './disc.png';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Custom Marticles
const vertex1 = new THREE.Vector3(0, 0, 0);
const vertex2 = new THREE.Vector3(0, 1, 0);
const vertex3 = new THREE.Vector3(1, 0, 0);

const vertices = [];

for (let i = 0; i < 1000; i++) {
    const x = 2000 * Math.random() - 1000;
    const y = 2000 * Math.random() - 1000;
    const z = 2000 * Math.random() - 1000;

    vertices.push(x, y, z);
}

const sprite = new THREE.TextureLoader().load( diskImage );

const customGeometry = new THREE.BufferGeometry();
customGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
const customMaterial = new THREE.PointsMaterial( { size: 35, sizeAttenuation: true, map: sprite, alphaTest: 0.9, transparent: true, } );
customMaterial.color.setHSL( 1.0, 0.3, 0.7 );

const customMesh = new THREE.Points(customGeometry, customMaterial);

scene.add(customMesh)


const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)


// trying custom square
const squareCG = new THREE.BufferGeometry();
const squareVertices = new Float32Array([
    -1, -1, 1, 1, -1, 1, -1, 1,  1,
    -1,  1, 1, 1, -1, 1,  1, 1,  1,
    1, -1, -1, -1, -1, -1,  1, 1, -1,
    1,  1, -1, -1, -1, -1, -1, 1, -1,
    -1, -1, -1, -1, -1, 1, -1, 1, -1,
    -1,  1, -1, -1, -1, 1, -1, 1,  1,
    1, -1, 1, 1, -1, -1, 1, 1,  1,
    1,  1, 1, 1, -1, -1, 1, 1, -1,
    1,  1, -1, -1, 1, -1,  1, 1, 1,
    1,  1,  1, -1, 1, -1, -1, 1, 1,
    1, -1,  1, -1, -1, 1,  1, -1, -1,
    1, -1, -1, -1, -1, 1, -1, -1, -1,
  ]);

squareCG.setAttribute('position', new THREE.BufferAttribute(squareVertices, 3));
const scgMaterial = new THREE.MeshBasicMaterial({color: "yellow", wireframe: true});
const scgMesh = new THREE.Mesh(squareCG, scgMaterial);
scgMesh.position.set(4, 0, 0);
scene.add(scgMesh); 

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 10000)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
camera.lookAt(scgMesh.position);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()