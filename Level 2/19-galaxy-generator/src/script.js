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
    randomness: 0.2,
    randomnessPower: 3,
    insideColor: "#ff6030",
    outsideColor: "#1b2984",
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
    const colors = new Float32Array(parameters.count * 3);
    // instance of instance threejs color
    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);
    // now get the mix color values
    // to mix colors, Colors instances have a method called `lerp` which receive a color and an alpha float value for interpolation factor [0, 1]

    // generate a random value and randomly multiply by -1 or 1, if its under or above 0.5
    const getRandomPNMultiplier = () => Math.random() < 0.5 ? 1 : -1;
    const getRandomPowByRandomnessPower = () => Math.pow(Math.random(), parameters.randomnessPower);

    for (let i = 0; i < parameters.count; i++) {
        // position
        // generate a random radius number from 0 to 5
        const radius = Math.random() * parameters.radius; // radius is how long it will be from the center
        const spinAngle = radius * parameters.spin; // how much will the branch curve/spin, which it will increase on how far it gets from the center
        const branchAngel = (i % parameters.branches) / parameters.branches * (Math.PI * 2);
        
        const randomX = getRandomPowByRandomnessPower() * getRandomPNMultiplier();
        const randomY = getRandomPowByRandomnessPower() * getRandomPNMultiplier();
        const randomZ = getRandomPowByRandomnessPower() * getRandomPNMultiplier();
        
        const i3 = i * 3 ;
        positions[i3] = Math.cos(branchAngel + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(branchAngel + spinAngle) * radius + randomZ;

        // color
        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, radius / parameters.radius);
        
        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute( positions, 3)
    );
    geometry.setAttribute(
        'color',
        new THREE.BufferAttribute( colors, 3)
    );


    /**
     * Material
     */
    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
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
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy);
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy);
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy);
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