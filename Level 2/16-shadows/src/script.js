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
 * Lights
 */

// textures
const textureLoader = new THREE.TextureLoader();
const bakedShadow = textureLoader.load("/textures/bakedShadow.jpg");
const simpleShadow = textureLoader.load("/textures/simpleShadow.jpg");


// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)
directionalLight.position.set(2, 2, - 1)
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(directionalLight);

directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;

directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = -2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = 2;
directionalLight.shadow.radius = 10;
gui.add(directionalLight.shadow, 'radius').min(0).max(180).step(1).name("DireccionalLight Radius")

directionalLight.shadow.camera.near = 1.0;
directionalLight.shadow.camera.far = 6;

const dlcHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(dlcHelper);
dlcHelper.visible = false;
gui.add(dlcHelper, 'visible').name('DirLight Helper');

// SpotLight
const spotLight = new THREE.SpotLight(0xffffff, 0.3, 10, Math.PI * 0.3);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

spotLight.position.set(0, 1, 2);
spotLight.shadow.camera.fov = 30;

spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 5;
scene.add(spotLight);
scene.add(spotLight.target);

const spcHelper = new THREE.CameraHelper(spotLight.shadow.camera);
scene.add(spcHelper);
spcHelper.visible = false;
gui.add(spcHelper, 'visible').name("SpotLight Helper");


//PointLIght
const pointLight = new THREE.PointLight(0xffffff, 0.3);
pointLight.castShadow = true;
pointLight.position.set(-1, 1, 0)
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;


scene.add(pointLight);

const plHelper = new THREE.CameraHelper(pointLight.shadow.camera);
scene.add(plHelper);
plHelper.visible = false;
gui.add(plHelper, 'visible').name("PointLight Helper");

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001).name("Material Metalness");
gui.add(material, 'roughness').min(0).max(1).step(0.001).name("Material Roughness");

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.castShadow = true;
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material,
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5
plane.receiveShadow = true;
scene.add(sphere, plane)

const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: simpleShadow
    })
);
sphereShadow.rotation.x = -Math.PI * 0.5;
sphereShadow.position.y = plane.position.y + 0.001;
scene.add(sphereShadow);

gui.add(sphere, "castShadow").name("Sphere Cast Shadow");
gui.add(plane, "castShadow").name("Plan Cast Shadow");
gui.add(directionalLight, "castShadow").name("DirectionalLight Cast Shadow");

gui.add(sphere, "receiveShadow").name("Sphere Receives Shadow");
gui.add(plane, "receiveShadow").name("Plan Receives Shadow");
gui.add(directionalLight, "receiveShadow").name("DirectionalLight Receives Shadow");

/**
 * Sizes
 */
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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
/**
 * Animate
 */
const clock = new THREE.Clock()

const animateBakedShadow =() => {
    sphereShadow.position.x = sphere.position.x;
    sphereShadow.position.z = sphere.position.z;
    sphereShadow.material.opacity = (1 - sphere.position.y) * 0.8;
}
const animateSphere = (elapsedTime)=> {
    sphere.position.set(
        Math.cos(elapsedTime) * 1.5,
        Math.abs(Math.sin(elapsedTime * 3)),
        Math.sin(elapsedTime) * 1.5,
    )
    animateBakedShadow();
}
const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    animateSphere(elapsedTime);

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()