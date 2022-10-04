import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Generate Galaxy
 */
const parameters = {
    count: 10000,
    size: 0.01,
    radius: 5,
    branches: 3,
    spin: 1, // spin angle from - to +
};
let geometry = null;
let material = null;
let points = null;

function generateGalaxy(){
    // detroy old galaxy
    if(points !== null) {
        geometry.dispose();
        material.dispose();
        scene.remove(points);
    }


    // Galaxy
    geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(parameters.count * 3);

    for (let i = 0; i < parameters.count; i++) {
        // generate a random radius number from 0 to 5
        const radius = Math.random() * parameters.radius; // radius is how long it will be from the center
        const spinAngle = radius * parameters.spin; // how much will the branch curve/spin, which it will increase on how far it gets from the center
        const branchAngel = (i % parameters.branches) / parameters.branches * (Math.PI * 2);

        const i3 = i * 3 ;
        positions[i3 + 0] = Math.cos(branchAngel + spinAngle) * radius;
        positions[i3 + 1] = 0;
        positions[i3 + 2] = Math.sin(branchAngel + spinAngle) * radius;
    }

    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute( positions, 3)
    );



    /**
     * Material
     */
    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });

    /**
     * Points
     */
    points = new THREE.Points(
        geometry,
        material
    );
    scene.add(points);
}

generateGalaxy();

gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy);
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy);
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy);
gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy);
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()