import './style.css'
import * as THREE from 'three'
import gasp from 'gsap';

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

const clock = new THREE.Clock();

const tick = () => {
   const elapsedTime = clock.getElapsedTime();

   // udpate objects
   // Similar way as before
    gasp.to(mesh.rotation, {duration: 1, delay: 0.1, y: Math.sin(elapsedTime)})
    gasp.to(mesh.rotation, {duration: 1, delay: 0.1, x: Math.cos(elapsedTime)})

    // Render
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick);
};

tick();
