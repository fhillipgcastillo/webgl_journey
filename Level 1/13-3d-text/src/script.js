import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';


/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// helper
// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/7.png');


/**
 * Fonts
 */
const fontLoader = new FontLoader();
let font;
let textGeometry;

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (response) => {
        console.log('loaded', response);
        font = response;
        textGeometry = new TextGeometry(
            'Hello World',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 4,
            }
        );
        textGeometry.computeBoundingBox();
        textGeometry.center();

        const matcapMaterial = new THREE.MeshMatcapMaterial({matcap: matcapTexture});
        // textMaterial.wireframe = true;
        
        const textMesh = new THREE.Mesh(
            textGeometry,
            matcapMaterial,
        )
        
        scene.add(textMesh);
        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
        
        // generate 300 donuts
        for(let i = 0; i < 1000; i++){
            const donutMesh = new THREE.Mesh(
                donutGeometry, 
                matcapMaterial
            );
            donutMesh.position.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 50
            )

            const scale = Math.random();
            donutMesh.scale.set(scale, scale, scale)
            scene.add(donutMesh);
        }
    },
    () => { console.log('load') },
    (err) => { console.log('Error', err) }
);

/**
 * Object
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )

// scene.add(cube)

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
    // animate text
    // textMesh

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

/**
 * Animate
 */
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