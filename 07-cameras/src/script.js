import './style.css'
import * as THREE from 'three'

/**
 * Cursor
 */
const cursor = {
    x: 0,
    y: 0,
};

window.addEventListener("mousemove", (event) => {
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = event.clientY / sizes.height - 0.5;
});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Scene
const scene = new THREE.Scene()


// Light
const light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.set(2, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);

scene.add(light, ambientLight);

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
)
scene.add(mesh)
light.lookAt(mesh)

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)

camera.position.z = 3;
camera.lookAt(mesh.position)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    camera.position.x = Math.sin(cursor.x * Math.PI) * 4;
    camera.position.y = cursor.y * Math.PI * 4;
    camera.position.z = Math.cos(cursor.x * Math.PI) * 4;
    camera.lookAt(mesh.position);

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()